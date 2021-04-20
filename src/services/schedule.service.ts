import { Firebase } from ".";
import {
	BookingConstant,
	MembershipConstant,
	ScheduleConstant,
} from "../config/constants";
import { User } from "../models";
import { MembershipUsageRepository, UserRepository } from "../repositories";
import { BookingRepository } from "../repositories/booking.repository";
import { TransactionRepository } from "../repositories/transaction.repository";

export class ScheduleService {
	public static agenda: any;

	constructor(
		private userRepository: UserRepository,
		private bookingRepository: BookingRepository,
		private transactionRepository: TransactionRepository
	) {}

	// cancel specific scheduled task by name
	static async cancelSchedule(name: string) {
		ScheduleService.agenda.cancel({ name });
	}

	// Notify incoming check in
	static async notifyCheckIn(
		bookingId: string,
		bookingRef: string,
		startTime: Date,
		user: User,
		host: User,
		before: number = BookingConstant.TIME_TO_CHECK_IN // mins
	) {
		const time = startTime.getTime();
		const beforeTime = before;
		const now = Date.now();
		let notifyTime = new Date(time - beforeTime);
		if (time - now <= beforeTime) {
			before = Math.floor((time - now) / (1000 * 60));
		}
		console.log(`Set up checkin reminder #${bookingRef}: ${notifyTime}`);

		// define the process of cronjob
		ScheduleService.agenda.define(
			`${ScheduleConstant.CHECK_IN_NOTIFICATION}:${bookingRef}`,
			async (job: any) => {
				console.log(
					`${ScheduleConstant.CHECK_IN_NOTIFICATION}:${bookingRef}`
				);
				try {
					const data = job.attrs.data;
					// console.log(data);
					Firebase.remindCheckInClient(
						data.user.firebaseToken,
						data.bookingId,
						data.bookingRef,
						data.before
					);

					Firebase.remindCheckInHost(
						data.host.firebaseToken,
						data.bookingId,
						data.user.fullname,
						data.bookingRef,
						data.before
					);
				} catch (err) {
					console.log(err);
				}
			}
		);

		// Set up schedule for cron job
		ScheduleService.agenda.schedule(
			notifyTime,
			`${ScheduleConstant.CHECK_IN_NOTIFICATION}:${bookingRef}`,
			{ bookingId, bookingRef, startTime, before, user, host }
		);
	}

	// Notify incoming check out
	static async notifyCheckOut(
		bookingId: string,
		bookingRef: string,
		endTime: Date,
		user: User,
		host: User,
		before: number = BookingConstant.TIME_TO_CHECK_OUT //mins
	) {
		const time = endTime.getTime();
		const beforeTime = before;
		const now = Date.now();
		let notifyTime = new Date(time - beforeTime);
		if (time - now >= beforeTime) {
			before = Math.floor(((time - now) / 1000) * 60);
		}
		console.log(`Set up checkout reminder #${bookingRef}: ${notifyTime}`);
		ScheduleService.agenda.define(
			`${ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`,
			async (job: any) => {
				console.log(
					`${ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`
				);
				try {
					const data = job.attrs.data;
					Firebase.remindCheckOutClient(
						data.user.firebaseToken,
						data.bookingId,
						data.bookingRef,
						data.before
					);

					Firebase.remindCheckOutHost(
						data.host.firebaseToken,
						data.bookingId,
						data.user.fullname,
						data.bookingRef,
						data.before
					);
				} catch (err) {
					console.log(err);
				}
			}
		);

		ScheduleService.agenda.schedule(
			notifyTime,
			`${ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`,
			{ bookingId, bookingRef, endTime, before, user, host }
		);
	}

	// Notify not check in
	static verifyCheckIn = async (
		id: string,
		startTime: Date,
		bookingRef: string,
		bookingRepository: BookingRepository,
		before: number = BookingConstant.TIME_LATE_CHECK_IN
	) => {
		const checkTime = new Date(startTime.getTime() + before);
		console.log(`Set verify checkin time #${bookingRef}: ${checkTime}`);
		ScheduleService.agenda.define(
			`${ScheduleConstant.VERIFY_CHECK_IN}:${bookingRef}`,
			async (job: any) => {
				console.log(
					`${ScheduleConstant.VERIFY_CHECK_IN}:${bookingRef}`
				);
				try {
					const data = job.attrs.data;
					const booking: any = await bookingRepository.findById(
						data.id,
						{
							include: [
								{
									relation: "transaction",
								},
								{
									relation: "user",
								},
								{
									relation: "room",
									scope: {
										include: [
											{
												relation: "coWorking",
												scope: {
													include: [
														{ relation: "user" },
													],
												},
											},
										],
									},
								},
							],
						}
					);

					if (
						booking.status === BookingConstant.ON_GOING ||
						booking.transaction.checkIn
					) {
						console.log("valid check in");
						return;
					}
					booking.status = BookingConstant.CANCELED;
					Firebase.notifyClientCheckInOverTime(
						booking.user.firebaseToken,
						data.id,
						booking.transaction.bookingRefernce
					);
					Firebase.notifyHostCheckInOverTime(
						booking.room.coWorking.user.firebaseToken,
						data.bookingId,
						booking.transaction.bookingRefernce
					);

					// Cancel verify check out of this booking
					ScheduleService.cancelSchedule(
						`${ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`
					);
					ScheduleService.cancelSchedule(
						`${ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`
					);

					delete booking.transaction;
					delete booking.room;
					delete booking.user;

					await bookingRepository.update(booking);
				} catch (error) {
					console.log(error);
				}
			}
		);

		ScheduleService.agenda.schedule(
			checkTime,
			`${ScheduleConstant.VERIFY_CHECK_IN}:${bookingRef}`,
			{ id, startTime }
		);
	};

	static async verifyCheckOut(
		id: string,
		endTime: Date,
		bookingRef: string,
		bookingRepository: BookingRepository,
		before: number = BookingConstant.TIME_LATE_CHECK_OUT
	) {
		const checkTime = new Date(endTime.getTime() + before);
		console.log(`Set verify checkout time #${bookingRef}: ${checkTime}`);
		ScheduleService.agenda.define(
			`${ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`,
			async (job: any) => {
				console.log(
					`${ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`
				);
				try {
					const data = job.attrs.data;
					const booking: any = await bookingRepository.findById(
						data.id,
						{
							include: [
								{
									relation: "transaction",
								},
								{
									relation: "user",
								},
								{
									relation: "room",
									scope: {
										include: [
											{
												relation: "coWorking",
												scope: {
													include: [
														{ relation: "user" },
													],
												},
											},
										],
									},
								},
							],
						}
					);
					if (
						booking.status === BookingConstant.FINISH &&
						booking.transaction.checkOut
					) {
						console.log("valid check out");
						return;
					}
					booking.status = BookingConstant.FAIL;
					Firebase.notifyClientCheckOutOverTime(
						booking.user.firebaseToken,
						data.id,
						booking.transaction.bookingRefernce
					);
					Firebase.notifyHostCheckOutOverTime(
						booking.room.coWorking.user.firebaseToken,
						data.id,
						booking.transaction.bookingRefernce
					);
					delete booking.transaction;
					delete booking.room;
					delete booking.user;

					await bookingRepository.update(booking);
				} catch (error) {
					console.log(error);
				}
			}
		);
		ScheduleService.agenda.schedule(
			checkTime,
			`${ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`,
			{ id, endTime }
		);
	}

	// Notify expire membership before 2 days

	static async notifyExpireMbs(
		fbToken: [],
		expireTime: Date,
		mbsUsageId: string,
		mbsId: string
	) {
		// const timestamp = new Date();
		// const sendTime = new Date(
		// 	new Date().setTime(timestamp.getTime() + 1000 * 10)
		// );
		const sendTime = new Date(expireTime.setDate(expireTime.getDate() - 1));

		// console.log(sendTime.toUTCString());
		ScheduleService.agenda.define(
			`${ScheduleConstant.NOTIFY_EXPIRE_MEMBERSHIP}:${mbsUsageId}`,
			async (job: any) => {
				try {
					// console.log("SEND EXPIRE");
					// console.log(sendTime);
					Firebase.notifyExpiredMembership(
						fbToken,
						mbsUsageId,
						mbsId
					);
				} catch (error) {
					console.log(error);
				}
			}
		);
		ScheduleService.agenda.schedule(
			sendTime,
			`${ScheduleConstant.NOTIFY_EXPIRE_MEMBERSHIP}:${mbsUsageId}`
		);
	}

	// Terminate membership
	static async terminateMbs(
		fbToken: [],
		expireTime: Date,
		mbsUsageId: string,
		mbsId: string,
		mbsUsageRepository: MembershipUsageRepository
	) {
		// expireTime = new Date(new Date().setTime(Date.now() + 1000 * 15));
		ScheduleService.agenda.define(
			`${ScheduleConstant.TERMINATE_MEMBERSHIP}:${mbsUsageId}`,
			async (job: any) => {
				console.log("Term", expireTime);
				await mbsUsageRepository.updateById(mbsUsageId, {
					status: MembershipConstant.EXPIRED,
				});
				Firebase.terminateMembership(fbToken, mbsUsageId, mbsId);
			}
		);
		ScheduleService.agenda.schedule(
			expireTime,
			`${ScheduleConstant.TERMINATE_MEMBERSHIP}:${mbsUsageId}`
		);
	}
}
