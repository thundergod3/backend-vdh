"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const _1 = require(".");
const constants_1 = require("../config/constants");
class ScheduleService {
    constructor(userRepository, bookingRepository, transactionRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.transactionRepository = transactionRepository;
    }
    // cancel specific scheduled task by name
    static async cancelSchedule(name) {
        ScheduleService.agenda.cancel({ name });
    }
    // Notify incoming check in
    static async notifyCheckIn(bookingId, bookingRef, startTime, user, host, before = constants_1.BookingConstant.TIME_TO_CHECK_IN // mins
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
        ScheduleService.agenda.define(`${constants_1.ScheduleConstant.CHECK_IN_NOTIFICATION}:${bookingRef}`, async (job) => {
            console.log(`${constants_1.ScheduleConstant.CHECK_IN_NOTIFICATION}:${bookingRef}`);
            try {
                const data = job.attrs.data;
                // console.log(data);
                _1.Firebase.remindCheckInClient(data.user.firebaseToken, data.bookingId, data.bookingRef, data.before);
                _1.Firebase.remindCheckInHost(data.host.firebaseToken, data.bookingId, data.user.fullname, data.bookingRef, data.before);
            }
            catch (err) {
                console.log(err);
            }
        });
        // Set up schedule for cron job
        ScheduleService.agenda.schedule(notifyTime, `${constants_1.ScheduleConstant.CHECK_IN_NOTIFICATION}:${bookingRef}`, { bookingId, bookingRef, startTime, before, user, host });
    }
    // Notify incoming check out
    static async notifyCheckOut(bookingId, bookingRef, endTime, user, host, before = constants_1.BookingConstant.TIME_TO_CHECK_OUT //mins
    ) {
        const time = endTime.getTime();
        const beforeTime = before;
        const now = Date.now();
        let notifyTime = new Date(time - beforeTime);
        if (time - now >= beforeTime) {
            before = Math.floor(((time - now) / 1000) * 60);
        }
        console.log(`Set up checkout reminder #${bookingRef}: ${notifyTime}`);
        ScheduleService.agenda.define(`${constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`, async (job) => {
            console.log(`${constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`);
            try {
                const data = job.attrs.data;
                _1.Firebase.remindCheckOutClient(data.user.firebaseToken, data.bookingId, data.bookingRef, data.before);
                _1.Firebase.remindCheckOutHost(data.host.firebaseToken, data.bookingId, data.user.fullname, data.bookingRef, data.before);
            }
            catch (err) {
                console.log(err);
            }
        });
        ScheduleService.agenda.schedule(notifyTime, `${constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`, { bookingId, bookingRef, endTime, before, user, host });
    }
    static async verifyCheckOut(id, endTime, bookingRef, bookingRepository, before = constants_1.BookingConstant.TIME_LATE_CHECK_OUT) {
        const checkTime = new Date(endTime.getTime() + before);
        console.log(`Set verify checkout time #${bookingRef}: ${checkTime}`);
        ScheduleService.agenda.define(`${constants_1.ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`, async (job) => {
            console.log(`${constants_1.ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`);
            try {
                const data = job.attrs.data;
                const booking = await bookingRepository.findById(data.id, {
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
                });
                if (booking.status === constants_1.BookingConstant.FINISH &&
                    booking.transaction.checkOut) {
                    console.log("valid check out");
                    return;
                }
                booking.status = constants_1.BookingConstant.FAIL;
                _1.Firebase.notifyClientCheckOutOverTime(booking.user.firebaseToken, data.id, booking.transaction.bookingRefernce);
                _1.Firebase.notifyHostCheckOutOverTime(booking.room.coWorking.user.firebaseToken, data.id, booking.transaction.bookingRefernce);
                delete booking.transaction;
                delete booking.room;
                delete booking.user;
                await bookingRepository.update(booking);
            }
            catch (error) {
                console.log(error);
            }
        });
        ScheduleService.agenda.schedule(checkTime, `${constants_1.ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`, { id, endTime });
    }
    // Notify expire membership before 2 days
    static async notifyExpireMbs(fbToken, expireTime, mbsUsageId, mbsId) {
        // const timestamp = new Date();
        // const sendTime = new Date(
        // 	new Date().setTime(timestamp.getTime() + 1000 * 10)
        // );
        const sendTime = new Date(expireTime.setDate(expireTime.getDate() - 1));
        // console.log(sendTime.toUTCString());
        ScheduleService.agenda.define(`${constants_1.ScheduleConstant.NOTIFY_EXPIRE_MEMBERSHIP}:${mbsUsageId}`, async (job) => {
            try {
                // console.log("SEND EXPIRE");
                // console.log(sendTime);
                _1.Firebase.notifyExpiredMembership(fbToken, mbsUsageId, mbsId);
            }
            catch (error) {
                console.log(error);
            }
        });
        ScheduleService.agenda.schedule(sendTime, `${constants_1.ScheduleConstant.NOTIFY_EXPIRE_MEMBERSHIP}:${mbsUsageId}`);
    }
    // Terminate membership
    static async terminateMbs(fbToken, expireTime, mbsUsageId, mbsId, mbsUsageRepository) {
        // expireTime = new Date(new Date().setTime(Date.now() + 1000 * 15));
        ScheduleService.agenda.define(`${constants_1.ScheduleConstant.TERMINATE_MEMBERSHIP}:${mbsUsageId}`, async (job) => {
            console.log("Term", expireTime);
            await mbsUsageRepository.updateById(mbsUsageId, {
                status: constants_1.MembershipConstant.EXPIRED,
            });
            _1.Firebase.terminateMembership(fbToken, mbsUsageId, mbsId);
        });
        ScheduleService.agenda.schedule(expireTime, `${constants_1.ScheduleConstant.TERMINATE_MEMBERSHIP}:${mbsUsageId}`);
    }
}
exports.ScheduleService = ScheduleService;
// Notify not check in
ScheduleService.verifyCheckIn = async (id, startTime, bookingRef, bookingRepository, before = constants_1.BookingConstant.TIME_LATE_CHECK_IN) => {
    const checkTime = new Date(startTime.getTime() + before);
    console.log(`Set verify checkin time #${bookingRef}: ${checkTime}`);
    ScheduleService.agenda.define(`${constants_1.ScheduleConstant.VERIFY_CHECK_IN}:${bookingRef}`, async (job) => {
        console.log(`${constants_1.ScheduleConstant.VERIFY_CHECK_IN}:${bookingRef}`);
        try {
            const data = job.attrs.data;
            const booking = await bookingRepository.findById(data.id, {
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
            });
            if (booking.status === constants_1.BookingConstant.ON_GOING ||
                booking.transaction.checkIn) {
                console.log("valid check in");
                return;
            }
            booking.status = constants_1.BookingConstant.CANCELED;
            _1.Firebase.notifyClientCheckInOverTime(booking.user.firebaseToken, data.id, booking.transaction.bookingRefernce);
            _1.Firebase.notifyHostCheckInOverTime(booking.room.coWorking.user.firebaseToken, data.bookingId, booking.transaction.bookingRefernce);
            // Cancel verify check out of this booking
            ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`);
            ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`);
            delete booking.transaction;
            delete booking.room;
            delete booking.user;
            await bookingRepository.update(booking);
        }
        catch (error) {
            console.log(error);
        }
    });
    ScheduleService.agenda.schedule(checkTime, `${constants_1.ScheduleConstant.VERIFY_CHECK_IN}:${bookingRef}`, { id, startTime });
};
//# sourceMappingURL=schedule.service.js.map