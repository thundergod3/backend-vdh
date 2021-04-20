import {
	belongsTo,
	Entity,
	hasMany,
	model,
	property,
} from "@loopback/repository";
import { MembershipBooking } from "./membership-booking.model";
import { MembershipTransaction } from "./membership-transaction.model";
import { Membership } from "./membership.model";
import { User } from "./user.model";

@model()
export class MembershipUsage extends Entity {
	@property({
		type: "string",
		id: true,
		generated: true,
	})
	id?: string;

	@property({
		type: "number",
		default: 0,
	})
	cash?: number;

	@property({
		type: "date",
		default: new Date(),
	})
	createdAt?: Date;

	@property({
		type: "string",
	})
	status: string;
	@property({
		type: "number",
		default: 0,
	})
	times: number;
	@property({
		type: "date",
	})
	outdatedAt: Date;

	@belongsTo(() => User, { name: "usage" })
	userId: string;

	@belongsTo(() => Membership)
	membershipId: string;

	@hasMany(() => MembershipTransaction, { keyTo: "membershipTransaction" })
	membershipTransactions: MembershipTransaction[];

	@hasMany(() => MembershipBooking)
	membershipBookings: MembershipBooking[];

	constructor(data?: Partial<MembershipUsage>) {
		super(data);
	}
}

export interface MembershipUsageRelations {
	// describe navigational properties here
}

export type MembershipUsageWithRelations = MembershipUsage &
	MembershipUsageRelations;
