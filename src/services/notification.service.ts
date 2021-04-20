import { Firebase, ScheduleService } from ".";
import { ScheduleConstant } from "../config/constants";
import { Booking, Room, Transaction, User } from "../models";
import { BookingRepository, MembershipUsageRepository } from "../repositories";

export class NotificationService {
	static async notifyAfterCreate(
		newTransaction: Transaction,
		newBooking: Booking,
		room: any,
		user: User,
		host: User,
		bookingRepository: BookingRepository
	) {
		ScheduleService.notifyCheckIn(
			newBooking.id,
			newTransaction.bookingRefernce,
			newBooking.startTime,
			user,
			host
		);

		ScheduleService.notifyCheckOut(
			newBooking.id,
			newTransaction.bookingRefernce,
			newBooking.endTime,
			user,
			host
		);

		// Cancel booking if user not check in late 10 mins
		ScheduleService.verifyCheckIn(
			newBooking.id,
			newBooking.startTime,
			newTransaction.bookingRefernce,
			bookingRepository
		);
		ScheduleService.verifyCheckOut(
			newBooking.id,
			newBooking.endTime,
			newTransaction.bookingRefernce,
			bookingRepository
		);

		// Notify host
		Firebase.notifyHostNewBooking(
			room.coWorking.user.firebaseToken,
			newBooking.id,
			room.name,
			newTransaction.bookingRefernce
		);
	}

	static async notifyAfterUpdate(
		newTransaction: Transaction,
		newBooking: Booking,
		room: any,
		user: User,
		host: User,
		bookingRepository: BookingRepository
	) {
		ScheduleService.cancelSchedule(
			`${ScheduleConstant.CHECK_IN_NOTIFICATION}:${newTransaction.bookingRefernce}`
		);
		ScheduleService.cancelSchedule(
			`${ScheduleConstant.CHECK_OUT_NOTIFICATION}:${newTransaction.bookingRefernce}`
		);
		ScheduleService.cancelSchedule(
			`${ScheduleConstant.VERIFY_CHECK_IN}:${newTransaction.bookingRefernce}`
		);
		ScheduleService.cancelSchedule(
			`${ScheduleConstant.VERIFY_CHECK_OUT}:${newTransaction.bookingRefernce}`
		);

		ScheduleService.notifyCheckIn(
			newBooking.id,
			newTransaction.bookingRefernce,
			newBooking.startTime,
			user,
			host
		);

		ScheduleService.notifyCheckOut(
			newBooking.id,
			newTransaction.bookingRefernce,
			newBooking.startTime,
			user,
			host
		);

		// Notify host
		Firebase.notifyHostUpdatedBooking(
			room.coWorking.user.firebaseToken,
			newBooking.id,
			newTransaction.bookingRefernce
		);

		// Cancel booking if user not check in late 10 mins
		ScheduleService.verifyCheckIn(
			newBooking.id,
			newBooking.startTime,
			newTransaction.bookingRefernce,
			bookingRepository
		);
		ScheduleService.verifyCheckOut(
			newBooking.id,
			newBooking.endTime,
			newTransaction.bookingRefernce,
			bookingRepository
		);
	}

	static async notifyAfterCancel(
		bookingId: string,
		newTransaction: Transaction,
		host: User
	) {
		ScheduleService.cancelSchedule(
			`${ScheduleConstant.CHECK_IN_NOTIFICATION}:${newTransaction.bookingRefernce}`
		);
		ScheduleService.cancelSchedule(
			`${ScheduleConstant.CHECK_OUT_NOTIFICATION}:${newTransaction.bookingRefernce}`
		);
		ScheduleService.cancelSchedule(
			`${ScheduleConstant.VERIFY_CHECK_IN}:${newTransaction.bookingRefernce}`
		);
		ScheduleService.cancelSchedule(
			`${ScheduleConstant.VERIFY_CHECK_OUT}:${newTransaction.bookingRefernce}`
		);

		Firebase.notifyCancelBooking(
			host.firebaseToken,
			bookingId,
			newTransaction.bookingRefernce
		);
	}

	static async notifyAfterCheckin(
		client: User,
		host: User,
		room: Room,
		bookingId: string,
		bookingRef: string
	) {
		Firebase.notifyClientCheckIn(
			client.firebaseToken,
			bookingId,
			room.name,
			bookingRef
		);
		Firebase.notifyHostCheckIn(
			host.firebaseToken,
			bookingId,
			client.fullname,
			room.name,
			bookingRef
		);
	}

	static async notifyAfterCheckout(
		user: User,
		host: User,
		point: number,
		bookingId: string,
		bookingRef: string
	) {
		Firebase.notifyPoint(user.firebaseToken, bookingId, point, bookingRef);
		Firebase.notifyHostCheckOut(
			host.firebaseToken,
			bookingId,
			user.fullname,
			bookingRef
		);
	}

	static async notifyExpireMbs(
		userId: string,
		mbsUsageId: string,
		mbsUsageRepository: MembershipUsageRepository
	) {
		const used: any = await mbsUsageRepository.findById(mbsUsageId, {
			include: [{ relation: "usage" }],
		});
		ScheduleService.cancelSchedule(
			`${ScheduleConstant.NOTIFY_EXPIRE_MEMBERSHIP}:${mbsUsageId}`
		);
		ScheduleService.notifyExpireMbs(
			used.usage.firebaseToken,
			used.outdatedAt,
			used.id,
			used.membershipId
		);
	}

	static async terminateMbs(
		mbsUsageId: string,
		mbsUsageRepository: MembershipUsageRepository
	) {
		const used: any = await mbsUsageRepository.findById(mbsUsageId, {
			include: [{ relation: "usage" }],
		});

		ScheduleService.cancelSchedule(
			`${ScheduleConstant.TERMINATE_MEMBERSHIP}:${mbsUsageId}`
		);

		ScheduleService.terminateMbs(
			used.usage.firebaseToken,
			used.outdatedAt,
			used.id,
			used.membershipId,
			mbsUsageRepository
		);
	}
}
