import { Entity } from "@loopback/repository";
import { MembershipBooking } from "./membership-booking.model";
import { MembershipTransaction } from "./membership-transaction.model";
export declare class MembershipUsage extends Entity {
    id?: string;
    cash?: number;
    createdAt?: Date;
    status: string;
    times: number;
    outdatedAt: Date;
    userId: string;
    membershipId: string;
    membershipTransactions: MembershipTransaction[];
    membershipBookings: MembershipBooking[];
    constructor(data?: Partial<MembershipUsage>);
}
export interface MembershipUsageRelations {
}
export declare type MembershipUsageWithRelations = MembershipUsage & MembershipUsageRelations;
