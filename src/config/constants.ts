export const BASE_URL = `http://34.87.113.186`;
// export const BASE_URL = `http://saldyy.ddns.net:3000`;

export namespace CoWorkingConstant {
	export namespace Type {
		export const HOTEL = "HOTEL";
		export const CAFE = "CAFE";
		export const INDEPENDENT = "INDEPENDENT";
		export const OTHER = "OTHER";
	}
}

export namespace BookingConstant {
	// Waitting for check in
	export const PENDING = "PENDING";
	// Checked in
	export const ON_GOING = "ON_GOING";
	// Checked out
	export const FINISH = "FINISH";
	// Canceled: User không đến hoặc thực hiện cancel
	export const CANCELED = "CANCELED";
	// Fail: User check in nhung khong check out
	export const FAIL = "FAIL";
	// Thoi gian notify checkin
	export const TIME_TO_CHECK_IN = 1000 * 60 * 15;
	// Thoi gian notify checkout
	export const TIME_TO_CHECK_OUT = 1000 * 60 * 15;
	// Thoi gian cho phep tre check in
	export const TIME_LATE_CHECK_IN = 1000 * 60 * 15;
	// Thoi gian cho phep tre check out
	export const TIME_LATE_CHECK_OUT = 1000 * 60 * 15;
}
export namespace MembershipConstant {
	export const UNPAID = "UNPAID";
	export const AVAILABLE = "AVAILABLE";
	export const EXPIRED = "EXPIRED";
	export const CANCELED = "CANCELED";
	export namespace TRANSACTION_TYPE {
		export const NEW = "NEW";
		export const RENEW = "RENEW";
	}
}
export namespace TransactionConstant {
	export const PENDING = "PENDING";
	export const ON_GOING = "ON_GOING";
	export const SUCCESS = "SUCCESS";
	export const CANCELED = "CANCELED";
}

export namespace PointConstant {
	export const PointToCoin = 20000;
	export const CashToPoint = 1000;

	export namespace EXCHANGE_TYPE {
		export const BOOKING = "BOOKING";
		export const CONVERT = "CONVERT";
	}
	export const ON_GOING = "ON_GOING";
	export const SUCCESS = "SUCCESS";
	export const CANCELED = "CANCELED";
}

export namespace ScheduleConstant {
	export const CHECK_IN_NOTIFICATION = "CHECK_IN_NOTIFICATION";
	export const CHECK_OUT_NOTIFICATION = "CHECK_OUT_NOTIFICATION";
	export const VERIFY_CHECK_IN = "VERIFY_CHECK_IN";
	export const VERIFY_CHECK_OUT = "VERIFY_CHECK_OUT";

	export const NOTIFY_EXPIRE_MEMBERSHIP = "NOTIFY_EXPIRE_MEMBERSHIP";
	export const TERMINATE_MEMBERSHIP = "TERMINATE_MEMBERSHIP";
}

/**
 *      /addCoin: convert point to coin
 *      /withdrawEth: withDraw coin from wallet
 */
export const CoinServer = "http://dev.coinserver.unox.site";

export const filterTimeBooking = (infoStartTime: Date, infoEndTime: Date) => ({
	or: [
		{
			// TH infoTimeBooking nằm trọn bên trong
			and: [
				{
					startTime: {
						gte: infoStartTime, // <
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
