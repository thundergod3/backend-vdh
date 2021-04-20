"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const _1 = require(".");
const constants_1 = require("../config/constants");
class NotificationService {
    static async notifyAfterCreate(newTransaction, newBooking, room, user, host, bookingRepository) {
        _1.ScheduleService.notifyCheckIn(newBooking.id, newTransaction.bookingRefernce, newBooking.startTime, user, host);
        _1.ScheduleService.notifyCheckOut(newBooking.id, newTransaction.bookingRefernce, newBooking.endTime, user, host);
        // Cancel booking if user not check in late 10 mins
        _1.ScheduleService.verifyCheckIn(newBooking.id, newBooking.startTime, newTransaction.bookingRefernce, bookingRepository);
        _1.ScheduleService.verifyCheckOut(newBooking.id, newBooking.endTime, newTransaction.bookingRefernce, bookingRepository);
        // Notify host
        _1.Firebase.notifyHostNewBooking(room.coWorking.user.firebaseToken, newBooking.id, room.name, newTransaction.bookingRefernce);
    }
    static async notifyAfterUpdate(newTransaction, newBooking, room, user, host, bookingRepository) {
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.CHECK_IN_NOTIFICATION}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.VERIFY_CHECK_IN}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.VERIFY_CHECK_OUT}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.notifyCheckIn(newBooking.id, newTransaction.bookingRefernce, newBooking.startTime, user, host);
        _1.ScheduleService.notifyCheckOut(newBooking.id, newTransaction.bookingRefernce, newBooking.startTime, user, host);
        // Notify host
        _1.Firebase.notifyHostUpdatedBooking(room.coWorking.user.firebaseToken, newBooking.id, newTransaction.bookingRefernce);
        // Cancel booking if user not check in late 10 mins
        _1.ScheduleService.verifyCheckIn(newBooking.id, newBooking.startTime, newTransaction.bookingRefernce, bookingRepository);
        _1.ScheduleService.verifyCheckOut(newBooking.id, newBooking.endTime, newTransaction.bookingRefernce, bookingRepository);
    }
    static async notifyAfterCancel(bookingId, newTransaction, host) {
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.CHECK_IN_NOTIFICATION}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.VERIFY_CHECK_IN}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.VERIFY_CHECK_OUT}:${newTransaction.bookingRefernce}`);
        _1.Firebase.notifyCancelBooking(host.firebaseToken, bookingId, newTransaction.bookingRefernce);
    }
    static async notifyAfterCheckin(client, host, room, bookingId, bookingRef) {
        _1.Firebase.notifyClientCheckIn(client.firebaseToken, bookingId, room.name, bookingRef);
        _1.Firebase.notifyHostCheckIn(host.firebaseToken, bookingId, client.fullname, room.name, bookingRef);
    }
    static async notifyAfterCheckout(user, host, point, bookingId, bookingRef) {
        _1.Firebase.notifyPoint(user.firebaseToken, bookingId, point, bookingRef);
        _1.Firebase.notifyHostCheckOut(host.firebaseToken, bookingId, user.fullname, bookingRef);
    }
    static async notifyExpireMbs(userId, mbsUsageId, mbsUsageRepository) {
        const used = await mbsUsageRepository.findById(mbsUsageId, {
            include: [{ relation: "usage" }],
        });
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.NOTIFY_EXPIRE_MEMBERSHIP}:${mbsUsageId}`);
        _1.ScheduleService.notifyExpireMbs(used.usage.firebaseToken, used.outdatedAt, used.id, used.membershipId);
    }
    static async terminateMbs(mbsUsageId, mbsUsageRepository) {
        const used = await mbsUsageRepository.findById(mbsUsageId, {
            include: [{ relation: "usage" }],
        });
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.TERMINATE_MEMBERSHIP}:${mbsUsageId}`);
        _1.ScheduleService.terminateMbs(used.usage.firebaseToken, used.outdatedAt, used.id, used.membershipId, mbsUsageRepository);
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map