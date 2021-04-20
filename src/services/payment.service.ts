import { bind, /* inject, */ BindingScope } from "@loopback/core";
import { Request } from "@loopback/rest";
import moment from "moment";
import querystring from "qs";
import sha256 from "sha256";
import VNPayConfig from "../config/vnpay";
import { MembershipTransaction } from "../models";

@bind({ scope: BindingScope.TRANSIENT })
export class PaymentService {
	constructor(/* Add @inject to inject parameters */) {}

	async getVNPayURL(
		request: Request,
		transaction: MembershipTransaction,
		userId: string,
		mbsUsageId: string
	): Promise<{ vnpayUrl: string }> {
		const ipAddr =
			request.headers["x-forwarded-for"] ||
			request.connection.remoteAddress ||
			request.socket.remoteAddress ||
			(request.connection as any).socket.remoteAddress;

		const tmnCode = VNPayConfig.vnp_TmnCode;
		const secretKey = VNPayConfig.vnp_HashSecret;
		const vnpUrl = VNPayConfig.vnp_Url;
		const returnUrl = VNPayConfig.vnp_ReturnUrl;
		console.log("Config :", VNPayConfig);
		const date = new Date();
		var vnp_Params: any = {};
		vnp_Params["vnp_Version"] = "2";
		vnp_Params["vnp_Command"] = "pay";
		vnp_Params["vnp_TmnCode"] = tmnCode;
		// vnp_Params['vnp_Merchant'] = ''
		vnp_Params["vnp_Locale"] = "en";
		vnp_Params["vnp_CurrCode"] = "VND";
		vnp_Params["vnp_TxnRef"] =
			moment(date).format("HHmmss") + "_" + transaction.id;
		vnp_Params["vnp_OrderInfo"] = JSON.stringify({
			transactionId: transaction.id,
			userId,
			mbsUsageId,
		});
		vnp_Params["vnp_OrderType"] = "billpayment";
		vnp_Params["vnp_Amount"] = transaction.price * 100;
		vnp_Params["vnp_ReturnUrl"] = returnUrl;
		vnp_Params["vnp_IpAddr"] = ipAddr;
		vnp_Params["vnp_CreateDate"] = moment(date).format("YYYYMMDDHHmmss");
		vnp_Params["vnp_BankCode"] = "NCB";
		vnp_Params = this.sortObject(vnp_Params);

		// var querystring = require('qs');
		var signData =
			secretKey + querystring.stringify(vnp_Params, { encode: false });

		// var sha256 = require('sha256');

		var secureHash = sha256(signData);

		vnp_Params["vnp_SecureHashType"] = "SHA256";
		vnp_Params["vnp_SecureHash"] = secureHash;
		const retUrl =
			vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: true });

		console.log(vnp_Params["vnp_CreateDate"]);
		console.log(vnp_Params["vnp_TxnRef"]);
		return { vnpayUrl: retUrl };
	}
	sortObject(o: any) {
		var sorted: any = {},
			key,
			a = [];

		for (key in o) {
			if (o.hasOwnProperty(key)) {
				a.push(key);
			}
		}

		a.sort();

		for (key = 0; key < a.length; key++) {
			sorted[a[key]] = o[a[key]];
		}
		return sorted;
	}
}
