import { belongsTo, Entity, model, property } from "@loopback/repository";
import { Booking } from "./booking.model";
import { MembershipUsage } from "./membership-usage.model";

@model()
export class MembershipBooking extends Entity {
	@property({
		type: "string",
		id: true,
		generated: true,
	})
	id?: string;

	@property({
		type: "boolean",
		default: false,
	})
	payment?: boolean;

	@property({
		type: "string",
		default: "",
	})
	host?: string;

	@belongsTo(() => Booking)
	bookingId: string;

	@belongsTo(() => MembershipUsage)
	membershipUsageId: string;

	constructor(data?: Partial<MembershipBooking>) {
		super(data);
	}
}

export interface MembershipBookingRelations {
	// describe navigational properties here
}

export type MembershipBookingWithRelations = MembershipBooking &
	MembershipBookingRelations;
