"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const qs_1 = tslib_1.__importDefault(require("qs"));
const sha256_1 = tslib_1.__importDefault(require("sha256"));
const constants_1 = require("../config/constants");
const key_1 = require("../config/key");
const vnpay_1 = tslib_1.__importDefault(require("../config/vnpay"));
const repositories_1 = require("../repositories");
const services_1 = require("../services");
let PaymentController = class PaymentController {
    constructor(mbsTransactionRepository, mbsUsageRepository, request, paymentService) {
        this.mbsTransactionRepository = mbsTransactionRepository;
        this.mbsUsageRepository = mbsUsageRepository;
        this.request = request;
        this.paymentService = paymentService;
    }
    // @authorize({
    //     allowedRoles: ['client'],
    //     voters: [basicAuthorization],
    // })
    // @authenticate('jwt')
    async vnpayIpn() {
        var vnp_Params = this.request.query;
        var secureHash = vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];
        console.log("qwerqwerqwer ", vnp_Params);
        vnp_Params = this.paymentService.sortObject(vnp_Params);
        var secretKey = vnpay_1.default["vnp_HashSecret"];
        var signData = secretKey + qs_1.default.stringify(vnp_Params, { encode: false });
        var checkSum = sha256_1.default(signData);
        if (secureHash === checkSum) {
            var orderId = vnp_Params["vnp_TxnRef"];
            var rspCode = vnp_Params["vnp_ResponseCode"];
            //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
            if (rspCode === "00") {
                const body = JSON.parse(vnp_Params["vnp_OrderInfo"]);
                // const transactionId = orderId?.slice(orderId.indexOf("_") + 1);
                const transaction = await this.mbsTransactionRepository.findById(body.transactionId);
                const usage = await this.mbsUsageRepository.findById(transaction.membershipUsageId);
                transaction.payment = true;
                transaction.type =
                    usage.times == 0
                        ? constants_1.MembershipConstant.TRANSACTION_TYPE.NEW
                        : constants_1.MembershipConstant.TRANSACTION_TYPE.RENEW;
                await this.mbsTransactionRepository.update(transaction);
                usage.times += 1;
                if (usage.status !== constants_1.MembershipConstant.AVAILABLE) {
                    let now = new Date();
                    usage.outdatedAt = now.setDate(now.getDate() + 30);
                }
                else {
                    usage.outdatedAt.setDate(usage.outdatedAt.getDate() + 30);
                }
                usage.status = constants_1.MembershipConstant.AVAILABLE;
                await this.mbsUsageRepository.update(usage);
                services_1.NotificationService.notifyExpireMbs(body.userId, body.mbsUsageId, this.mbsUsageRepository);
                services_1.NotificationService.terminateMbs(body.mbsUsageId, this.mbsUsageRepository);
                return "Payment Success";
            }
            return { RspCode: rspCode, Message: "nope" };
        }
        else {
            return { RspCode: "97", Message: "Fail checksum" };
        }
    }
    async paymentResult() {
        var vnp_Params = this.request.query;
        var secureHash = vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];
        vnp_Params = this.paymentService.sortObject(vnp_Params);
        var tmnCode = vnpay_1.default["vnp_TmnCode"];
        var secretKey = vnpay_1.default["vnp_HashSecret"];
        var signData = secretKey + qs_1.default.stringify(vnp_Params, { encode: false });
        var checkSum = sha256_1.default(signData);
        if (secureHash === checkSum) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            return { code: vnp_Params["vnp_ResponseCode"] };
        }
    }
};
tslib_1.__decorate([
    rest_1.get("/vnpay/ipn"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentController.prototype, "vnpayIpn", null);
tslib_1.__decorate([
    rest_1.get("/vnpay/return"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentController.prototype, "paymentResult", null);
PaymentController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.MembershipTransactionRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.MembershipUsageRepository)),
    tslib_1.__param(2, core_1.inject(rest_1.RestBindings.Http.REQUEST)),
    tslib_1.__param(3, core_1.inject(key_1.PAYMENT_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MembershipTransactionRepository,
        repositories_1.MembershipUsageRepository, Object, services_1.PaymentService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map