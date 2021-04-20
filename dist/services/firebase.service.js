"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Firebase = void 0;
const tslib_1 = require("tslib");
const admin = tslib_1.__importStar(require("firebase-admin"));
class Firebase {
    static async sendNotification(firebaseToken, noti) {
        try {
            if (!firebaseToken || firebaseToken.length === 0) {
                return;
            }
            const message = {
                notification: noti,
                tokens: firebaseToken,
            };
            const result = await admin.messaging().sendMulticast(message);
            return result;
        }
        catch (err) {
            return { error: true, message: err.message };
        }
    }
    //Reminder Check in
    static async remindCheckInClient(tokens, bookingId, bookingRef, before) {
        const noti = {
            title: "Check In Remider",
            body: JSON.stringify({
                bookingId: bookingId,
                content: `Your booking #${bookingRef} is starting in ${before} minutes.`,
            }),
        };
        await this.sendNotification(tokens, noti);
    }
    static async remindCheckInHost(tokens, bookingId, clientName, bookingRef, before) {
        const noti = {
            title: "Check In Remider",
            body: JSON.stringify({
                bookingId: bookingId,
                content: `You have booking #${bookingRef} with ${clientName} in ${before} minutes`,
            }),
        };
        await this.sendNotification(tokens, noti);
    }
    //Reminder Check out
    static async remindCheckOutClient(tokens, bookingId, bookingRef, before) {
        const noti = {
            title: "Check Out Remider",
            body: JSON.stringify({
                content: `Your booking #${bookingRef} is ending in ${before} minutes.`,
            }),
        };
        await this.sendNotification(tokens, noti);
    }
    static async remindCheckOutHost(tokens, bookingId, clientName, bookingRef, before) {
        const noti = {
            title: "Check Out Remider",
            body: JSON.stringify({
                content: `Booking #${bookingRef} with ${clientName} is ending in ${before} minutes`,
            }),
        };
        await this.sendNotification(tokens, noti);
    }
    // Notify host new booking
    static async notifyHostNewBooking(tokens, bookingId, name, bookingRef) {
        const noti = {
            title: "New Booking Alert",
            body: JSON.stringify({
                bookingId,
                content: `Room ${name} has new booking #${bookingRef}`,
            }),
        };
        await this.sendNotification(tokens, noti);
    }
    //Notify host booking update
    static async notifyHostUpdatedBooking(tokens, bookingId, bookingRef) {
        const noti = {
            title: "Update Booking Alert",
            body: JSON.stringify({
                bookingId,
                content: `Booking #${bookingRef} has been updated`,
            }),
        };
        await this.sendNotification(tokens, noti);
    }
    // Verify Check in Check out
    static async notifyClientCheckInOverTime(tokens, bookingId, bookingRef) {
        const noti = {
            title: "Booking Overdue",
            body: JSON.stringify({
                bookingId,
                content: `Your booking #${bookingRef} is canceled due to not check in.`,
            }),
        };
        await this.sendNotification(tokens, noti);
    }
    static async notifyHostCheckInOverTime(tokens, bookingId, bookingRef) {
        const noti = {
            title: "Booking Overdue",
            body: JSON.stringify({
                bookingId,
                content: `Booking #${bookingRef} is canceled due to not check in.`,
            }),
        };
        await this.sendNotification(tokens, noti);
    }
    static async notifyClientCheckOutOverTime(tokens, bookingId, bookingRef) {
        const noti = {
            title: "Booking Overdue",
            body: JSON.stringify({
                bookingId,
                content: `Your booking #${bookingRef} is marked as fail due to not check out.`,
            }),
        };
        await this.sendNotification(tokens, noti);
    }
    static async notifyHostCheckOutOverTime(tokens, bookingId, bookingRef) {
        const noti = {
            title: "Booking Overdue",
            body: JSON.stringify({
                bookingId,
                content: `Booking #${bookingRef} is failed due to user not check out.`,
            }),
        };
        await this.sendNotification(tokens, noti);
    }
    // Notify booking cancel
    static async notifyCancelBooking(tokens, bookingId, bookingRef) {
        const noti = {
            title: "Booking Canceled",
            body: JSON.stringify({
                bookingId,
                content: `Booking #${bookingRef} has been canceled`,
            }),
        };
        this.sendNotification(tokens, noti);
    }
    // Notify check in
    static async notifyClientCheckIn(tokens, bookingId, roomName, bookingRef) {
        const noti = {
            title: `Check in booking #${bookingRef}`,
            body: JSON.stringify({
                bookingId,
                content: `Checked in at room ${roomName} successfully.`,
            }),
        };
        this.sendNotification(tokens, noti);
    }
    static async notifyHostCheckIn(tokens, bookingId, clientName, roomName, bookingRef) {
        const noti = {
            title: `Check in booking #${bookingRef}`,
            body: JSON.stringify({
                bookingId,
                content: `${clientName} just checked in room ${roomName}`,
            }),
        };
        this.sendNotification(tokens, noti);
    }
    // Notify earn point for user after checkout
    static async notifyPoint(tokens, bookingId, point, bookingRef) {
        const noti = {
            title: `Check out #${bookingRef} successfully`,
            body: JSON.stringify({
                bookingId,
                content: `Thank you for choosing our service. You've earned ${point} points`,
            }),
        };
        this.sendNotification(tokens, noti);
    }
    // Notify host check out successfully
    static async notifyHostCheckOut(tokens, bookingId, userName, bookingRef) {
        const noti = {
            title: `Booking #${bookingRef} check out.`,
            body: JSON.stringify({
                bookingId,
                content: `${userName} checked out successfully.`,
            }),
        };
        this.sendNotification(tokens, noti);
    }
    // Send notification whem mbs about to expired, before 2 days
    static async notifyExpiredMembership(tokens, mbsUsage, mbsId) {
        const noti = {
            title: `Membership expiration.`,
            body: JSON.stringify({
                mbsUsage,
                mbsId,
                content: `Your Membership is going to expire in 2 days.`,
            }),
        };
        // console.log("TOKEN" + tokens);
        this.sendNotification(tokens, noti);
    }
    // Send notification whem mbs about to expired, before 2 days
    static async terminateMembership(tokens, mbsUsage, mbsId) {
        const noti = {
            title: `Membership expiration.`,
            body: JSON.stringify({
                mbsUsage,
                mbsId,
                content: `Your Membership is expired.`,
            }),
        };
        // console.log("TOKEN" + tokens);
        this.sendNotification(tokens, noti);
    }
}
exports.Firebase = Firebase;
//# sourceMappingURL=firebase.service.js.map