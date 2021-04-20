"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterTimeBooking = exports.CoinServer = exports.ScheduleConstant = exports.PointConstant = exports.TransactionConstant = exports.MembershipConstant = exports.BookingConstant = exports.CoWorkingConstant = exports.BASE_URL = void 0;
exports.BASE_URL = `http://34.87.113.186`;
// export const BASE_URL = `http://saldyy.ddns.net:3000`;
var CoWorkingConstant;
(function (CoWorkingConstant) {
    let Type;
    (function (Type) {
        Type.HOTEL = "HOTEL";
        Type.CAFE = "CAFE";
        Type.INDEPENDENT = "INDEPENDENT";
        Type.OTHER = "OTHER";
    })(Type = CoWorkingConstant.Type || (CoWorkingConstant.Type = {}));
})(CoWorkingConstant = exports.CoWorkingConstant || (exports.CoWorkingConstant = {}));
var BookingConstant;
(function (BookingConstant) {
    // Waitting for check in
    BookingConstant.PENDING = "PENDING";
    // Checked in
    BookingConstant.ON_GOING = "ON_GOING";
    // Checked out
    BookingConstant.FINISH = "FINISH";
    // Canceled: User không đến hoặc thực hiện cancel
    BookingConstant.CANCELED = "CANCELED";
    // Fail: User check in nhung khong check out
    BookingConstant.FAIL = "FAIL";
    // Thoi gian notify checkin
    BookingConstant.TIME_TO_CHECK_IN = 1000 * 60 * 15;
    // Thoi gian notify checkout
    BookingConstant.TIME_TO_CHECK_OUT = 1000 * 60 * 15;
    // Thoi gian cho phep tre check in
    BookingConstant.TIME_LATE_CHECK_IN = 1000 * 60 * 15;
    // Thoi gian cho phep tre check out
    BookingConstant.TIME_LATE_CHECK_OUT = 1000 * 60 * 15;
})(BookingConstant = exports.BookingConstant || (exports.BookingConstant = {}));
var MembershipConstant;
(function (MembershipConstant) {
    MembershipConstant.UNPAID = "UNPAID";
    MembershipConstant.AVAILABLE = "AVAILABLE";
    MembershipConstant.EXPIRED = "EXPIRED";
    MembershipConstant.CANCELED = "CANCELED";
    let TRANSACTION_TYPE;
    (function (TRANSACTION_TYPE) {
        TRANSACTION_TYPE.NEW = "NEW";
        TRANSACTION_TYPE.RENEW = "RENEW";
    })(TRANSACTION_TYPE = MembershipConstant.TRANSACTION_TYPE || (MembershipConstant.TRANSACTION_TYPE = {}));
})(MembershipConstant = exports.MembershipConstant || (exports.MembershipConstant = {}));
var TransactionConstant;
(function (TransactionConstant) {
    TransactionConstant.PENDING = "PENDING";
    TransactionConstant.ON_GOING = "ON_GOING";
    TransactionConstant.SUCCESS = "SUCCESS";
    TransactionConstant.CANCELED = "CANCELED";
})(TransactionConstant = exports.TransactionConstant || (exports.TransactionConstant = {}));
var PointConstant;
(function (PointConstant) {
    PointConstant.PointToCoin = 20000;
    PointConstant.CashToPoint = 1000;
    let EXCHANGE_TYPE;
    (function (EXCHANGE_TYPE) {
        EXCHANGE_TYPE.BOOKING = "BOOKING";
        EXCHANGE_TYPE.CONVERT = "CONVERT";
    })(EXCHANGE_TYPE = PointConstant.EXCHANGE_TYPE || (PointConstant.EXCHANGE_TYPE = {}));
    PointConstant.ON_GOING = "ON_GOING";
    PointConstant.SUCCESS = "SUCCESS";
    PointConstant.CANCELED = "CANCELED";
})(PointConstant = exports.PointConstant || (exports.PointConstant = {}));
var ScheduleConstant;
(function (ScheduleConstant) {
    ScheduleConstant.CHECK_IN_NOTIFICATION = "CHECK_IN_NOTIFICATION";
    ScheduleConstant.CHECK_OUT_NOTIFICATION = "CHECK_OUT_NOTIFICATION";
    ScheduleConstant.VERIFY_CHECK_IN = "VERIFY_CHECK_IN";
    ScheduleConstant.VERIFY_CHECK_OUT = "VERIFY_CHECK_OUT";
    ScheduleConstant.NOTIFY_EXPIRE_MEMBERSHIP = "NOTIFY_EXPIRE_MEMBERSHIP";
    ScheduleConstant.TERMINATE_MEMBERSHIP = "TERMINATE_MEMBERSHIP";
})(ScheduleConstant = exports.ScheduleConstant || (exports.ScheduleConstant = {}));
/**
 *      /addCoin: convert point to coin
 *      /withdrawEth: withDraw coin from wallet
 */
exports.CoinServer = "http://dev.coinserver.unox.site";
exports.filterTimeBooking = (infoStartTime, infoEndTime) => ({
    or: [
        {
            // TH infoTimeBooking nằm trọn bên trong
            and: [
                {
                    startTime: {
                        gte: infoStartTime,
                    },
                },
                {
                    endTime: {
                        lte: infoEndTime,
                    },
                },
                { status: BookingConstant.PENDING || BookingConstant.ON_GOING },
            ],
        },
        {
            // TH infoTimeBooking nằm lệch về phía end
            and: [
                {
                    startTime: {
                        lte: infoStartTime,
                    },
                },
                {
                    endTime: {
                        gte: infoStartTime,
                    },
                },
                { status: BookingConstant.PENDING || BookingConstant.ON_GOING },
            ],
        },
        {
            // TH infoTimeBooking nằm lệch về phía start
            and: [
                {
                    startTime: {
                        lte: infoEndTime,
                    },
                },
                {
                    endTime: {
                        gte: infoEndTime,
                    },
                },
                { status: BookingConstant.PENDING || BookingConstant.ON_GOING },
            ],
        },
    ],
});
//# sourceMappingURL=constants.js.map