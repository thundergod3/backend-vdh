// Uncomment these imports to begin using these cool features!

import { inject } from "@loopback/core";
import { repository } from "@loopback/repository";
import { get, Request, RestBindings } from "@loopback/rest";
import querystring from "qs";
import sha256 from "sha256";
import { MembershipConstant } from "../config/constants";
import { PAYMENT_SERVICE } from "../config/key";
import vnpayConfig from "../config/vnpay";
import {
	MembershipTransactionRepository,
	MembershipUsageRepository,
} from "../repositories";
import { NotificationService, PaymentService } from "../services";

export class PaymentController {
	constructor(
		@repository(MembershipTransactionRepository)
		private mbsTransactionRepository: MembershipTransactionRepository,
		@repository(MembershipUsageRepository)
		private mbsUsageRepository: MembershipUsageRepository,
		@inject(RestBindings.Http.REQUEST) private request: Request,
		@inject(PAYMENT_SERVICE) private paymentService: PaymentService
	) {}

	// @authorize({
	//     allowedRoles: ['client'],
	//     voters: [basicAuthorization],
	// })
	// @authenticate('jwt')
	@get("/vnpay/ipn")
	async vnpayIpn(): Promise<any> {
		var vnp_Params: any = this.request.query;
		var secureHash = vnp_Params["vnp_SecureHash"];

		delete vnp_Params["vnp_SecureHash"];
		delete vnp_Params["vnp_SecureHashType"];
		console.log("qwerqwerqwer ", vnp_Params);
		vnp_Params = this.paymentService.sortObject(vnp_Params);

		var secretKey = vnpayConfig["vnp_HashSecret"];

		var signData =
			secretKey + querystring.stringify(vnp_Params, { encode: false });

		var checkSum = sha256(signData);

		if (secureHash === checkSum) {
			var orderId: any = vnp_Params["vnp_TxnRef"];
			var rspCode = vnp_Params["vnp_ResponseCode"];
			//Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
			if (rspCode === "00") {
				const body = JSON.parse(vnp_Params["vnp_OrderInfo"]);
				// const transactionId = orderId?.slice(orderId.indexOf("_") + 1);

				const transaction = await this.mbsTransactionRepository.findById(
					body.transactionId
				);
				const usage: any = await this.mbsUsageRepository.findById(
					transaction.membershipUsageId
				);

				transaction.payment = true;
				transaction.type =
					usage.times == 0
						? MembershipConstant.TRANSACTION_TYPE.NEW
						: MembershipConstant.TRANSACTION_TYPE.RENEW;

				await this.mbsTransactionRepository.update(transaction);

				usage.times += 1;
				if (usage.status !== MembershipConstant.AVAILABLE) {
					let now = new Date();
					usage.outdatedAt = now.setDate(now.getDate() + 30);
				} else {
					usage.outdatedAt.setDate(usage.outdatedAt.getDate() + 30);
				}
				usage.status = MembershipConstant.AVAILABLE;
				await this.mbsUsageRepository.update(usage);
				NotificationService.notifyExpireMbs(
					body.userId,
					body.mbsUsageId,
					this.mbsUsageRepository
				);
				NotificationService.terminateMbs(
					body.mbsUsageId,
					this.mbsUsageRepository
				);
				return "Payment Success";
			}
			return { RspCode: rspCode, Message: "nope" };
		} else {
			return { RspCode: "97", Message: "Fail checksum" };
		}
	}

	@get("/vnpay/return")
	async paymentResult() {
		var vnp_Params = this.request.query;

		var secureHash = vnp_Params["vnp_SecureHash"];

		delete vnp_Params["vnp_SecureHash"];
		delete vnp_Params["vnp_SecureHashType"];

		vnp_Params = this.paymentService.sortObject(vnp_Params);
		var tmnCode = vnpayConfig["vnp_TmnCode"];
		var secretKey = vnpayConfig["vnp_HashSecret"];

		var signData =
			secretKey + querystring.stringify(vnp_Params, { encode: false });

		var checkSum = sha256(signData);

		if (secureHash === checkSum) {
			//Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

			return { code: vnp_Params["vnp_ResponseCode"] };
		}
	}
}
