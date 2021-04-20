"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const moment_1 = tslib_1.__importDefault(require("moment"));
const qs_1 = tslib_1.__importDefault(require("qs"));
const sha256_1 = tslib_1.__importDefault(require("sha256"));
const vnpay_1 = tslib_1.__importDefault(require("../config/vnpay"));
let PaymentService = class PaymentService {
    constructor( /* Add @inject to inject parameters */) { }
    async getVNPayURL(request, transaction, userId, mbsUsageId) {
        const ipAddr = request.headers["x-forwarded-for"] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.connection.socket.remoteAddress;
        const tmnCode = vnpay_1.default.vnp_TmnCode;
        const secretKey = vnpay_1.default.vnp_HashSecret;
        const vnpUrl = vnpay_1.default.vnp_Url;
        const returnUrl = vnpay_1.default.vnp_ReturnUrl;
        console.log("Config :", vnpay_1.default);
        const date = new Date();
        var vnp_Params = {};
        vnp_Params["vnp_Version"] = "2";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params["vnp_Locale"] = "en";
        vnp_Params["vnp_CurrCode"] = "VND";
        vnp_Params["vnp_TxnRef"] =
            moment_1.default(date).format("HHmmss") + "_" + transaction.id;
        vnp_Params["vnp_OrderInfo"] = JSON.stringify({
            transactionId: transaction.id,
            userId,
            mbsUsageId,
        });
        vnp_Params["vnp_OrderType"] = "billpayment";
        vnp_Params["vnp_Amount"] = transaction.price * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = moment_1.default(date).format("YYYYMMDDHHmmss");
        vnp_Params["vnp_BankCode"] = "NCB";
        vnp_Params = this.sortObject(vnp_Params);
        // var querystring = require('qs');
        var signData = secretKey + qs_1.default.stringify(vnp_Params, { encode: false });
        // var sha256 = require('sha256');
        var secureHash = sha256_1.default(signData);
        vnp_Params["vnp_SecureHashType"] = "SHA256";
        vnp_Params["vnp_SecureHash"] = secureHash;
        const retUrl = vnpUrl + "?" + qs_1.default.stringify(vnp_Params, { encode: true });
        console.log(vnp_Params["vnp_CreateDate"]);
        console.log(vnp_Params["vnp_TxnRef"]);
        return { vnpayUrl: retUrl };
    }
    sortObject(o) {
        var sorted = {}, key, a = [];
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
};
PaymentService = tslib_1.__decorate([
    core_1.bind({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map