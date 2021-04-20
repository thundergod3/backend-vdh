import * as admin from "firebase-admin";

export class Firebase {
	static async sendNotification(
		firebaseToken: string[],
		noti: { title: string; body: string }
	) {
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
		} catch (err) {
			return { error: true, message: err.message };
		}
	}

	//Reminder Check in
	static async remindCheckInClient(
		tokens: string[],
		bookingId: string,
		bookingRef: string,
		before: number
	) {
		const noti = {
			title: "Check In Remider",
			body: JSON.stringify({
				bookingId: bookingId,
				content: `Your booking #${bookingRef} is starting in ${before} minutes.`,
			}),
		};
		await this.sendNotification(tokens, noti);
	}

	static async remindCheckInHost(
		tokens: string[],
		bookingId: string,
		clientName: string,
		bookingRef: string,
		before: number
	) {
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
	static async remindCheckOutClient(
		tokens: string[],
		bookingId: string,
		bookingRef: string,
		before: number
	) {
		const noti = {
			title: "Check Out Remider",
			body: JSON.stringify({
				content: `Your booking #${bookingRef} is ending in ${before} minutes.`,
			}),
		};
		await this.sendNotification(tokens, noti);
	}

	static async remindCheckOutHost(
		tokens: string[],
		bookingId: string,
		clientName: string,
		bookingRef: string,
		before: number
	) {
		const noti = {
			title: "Check Out Remider",
			body: JSON.stringify({
				content: `Booking #${bookingRef} with ${clientName} is ending in ${before} minutes`,
			}),
		};
		await this.sendNotification(tokens, noti);
	}

	// Notify host new booking
	static async notifyHostNewBooking(
		tokens: string[],
		bookingId: string,
		name: string,
		bookingRef: string
	) {
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
	static async notifyHostUpdatedBooking(
		tokens: string[],
		bookingId: string,
		bookingRef: string
	) {
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
	static async notifyClientCheckInOverTime(
		tokens: string[],
		bookingId: string,
		bookingRef: string
	) {
		const noti = {
			title: "Booking Overdue",
			body: JSON.stringify({
				bookingId,
				content: `Your booking #${bookingRef} is canceled due to not check in.`,
			}),
		};
		await this.sendNotification(tokens, noti);
	}

	static async notifyHostCheckInOverTime(
		tokens: string[],
		bookingId: string,
		bookingRef: string
	) {
		const noti = {
			title: "Booking Overdue",
			body: JSON.stringify({
				bookingId,
				content: `Booking #${bookingRef} is canceled due to not check in.`,
			}),
		};
		await this.sendNotification(tokens, noti);
	}

	static async notifyClientCheckOutOverTime(
		tokens: string[],
		bookingId: string,
		bookingRef: string
	) {
		const noti = {
			title: "Booking Overdue",
			body: JSON.stringify({
				bookingId,
				content: `Your booking #${bookingRef} is marked as fail due to not check out.`,
			}),
		};
		await this.sendNotification(tokens, noti);
	}

	static async notifyHostCheckOutOverTime(
		tokens: string[],
		bookingId: string,
		bookingRef: string
	) {
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
	static async notifyCancelBooking(
		tokens: string[],
		bookingId: string,
		bookingRef: string
	) {
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
	static async notifyClientCheckIn(
		tokens: string[],
		bookingId: string,
		roomName: any,
		bookingRef: string
	) {
		const noti = {
			title: `Check in booking #${bookingRef}`,
			body: JSON.stringify({
				bookingId,
				content: `Checked in at room ${roomName} successfully.`,
			}),
		};

		this.sendNotification(tokens, noti);
	}
	static async notifyHostCheckIn(
		tokens: string[],
		bookingId: string,
		clientName: any,
		roomName: any,
		bookingRef: string
	) {
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
	static async notifyPoint(
		tokens: string[],
		bookingId: string,
		point: number,
		bookingRef: string
	) {
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
	static async notifyHostCheckOut(
		tokens: string[],
		bookingId: string,
		userName: any,
		bookingRef: string
	) {
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
	static async notifyExpiredMembership(
		tokens: string[],
		mbsUsage: string,
		mbsId: string
	) {
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
	static async terminateMembership(
		tokens: string[],
		mbsUsage: string,
		mbsId: string
	) {
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
