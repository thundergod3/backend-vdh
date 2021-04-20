export declare const BASE_URL = "http://34.87.113.186";
export declare namespace CoWorkingConstant {
    namespace Type {
        const HOTEL = "HOTEL";
        const CAFE = "CAFE";
        const INDEPENDENT = "INDEPENDENT";
        const OTHER = "OTHER";
    }
}
export declare namespace BookingConstant {
    const PENDING = "PENDING";
    const ON_GOING = "ON_GOING";
    const FINISH = "FINISH";
    const CANCELED = "CANCELED";
    const FAIL = "FAIL";
    const TIME_TO_CHECK_IN: number;
    const TIME_TO_CHECK_OUT: number;
    const TIME_LATE_CHECK_IN: number;
    const TIME_LATE_CHECK_OUT: number;
}
export declare namespace MembershipConstant {
    const UNPAID = "UNPAID";
    const AVAILABLE = "AVAILABLE";
    const EXPIRED = "EXPIRED";
    const CANCELED = "CANCELED";
    namespace TRANSACTION_TYPE {
        const NEW = "NEW";
        const RENEW = "RENEW";
    }
}
export declare namespace TransactionConstant {
    const PENDING = "PENDING";
    const ON_GOING = "ON_GOING";
    const SUCCESS = "SUCCESS";
    const CANCELED = "CANCELED";
}
export declare namespace PointConstant {
    const PointToCoin = 20000;
    const CashToPoint = 1000;
    namespace EXCHANGE_TYPE {
        const BOOKING = "BOOKING";
        const CONVERT = "CONVERT";
    }
    const ON_GOING = "ON_GOING";
    const SUCCESS = "SUCCESS";
    const CANCELED = "CANCELED";
}
export declare namespace ScheduleConstant {
    const CHECK_IN_NOTIFICATION = "CHECK_IN_NOTIFICATION";
    const CHECK_OUT_NOTIFICATION = "CHECK_OUT_NOTIFICATION";
    const VERIFY_CHECK_IN = "VERIFY_CHECK_IN";
    const VERIFY_CHECK_OUT = "VERIFY_CHECK_OUT";
    const NOTIFY_EXPIRE_MEMBERSHIP = "NOTIFY_EXPIRE_MEMBERSHIP";
    const TERMINATE_MEMBERSHIP = "TERMINATE_MEMBERSHIP";
}
/**
 *      /addCoin: convert point to coin
 *      /withdrawEth: withDraw coin from wallet
 */
export declare const CoinServer = "http://dev.coinserver.unox.site";
export declare const filterTimeBooking: (infoStartTime: Date, infoEndTime: Date) => {
    or: ({
        and: ({
            startTime: {
                gte: Date;
            };
            endTime?: undefined;
            status?: undefined;
        } | {
            endTime: {
                lte: Date;
            };
            startTime?: undefined;
            status?: undefined;
        } | {
            status: string;
            startTime?: undefined;
            endTime?: undefined;
        })[];
    } | {
        and: ({
            startTime: {
                lte: Date;
            };
            endTime?: undefined;
            status?: undefined;
        } | {
            endTime: {
                gte: Date;
            };
            startTime?: undefined;
            status?: undefined;
        } | {
            status: string;
            startTime?: undefined;
            endTime?: undefined;
        })[];
    })[];
};
