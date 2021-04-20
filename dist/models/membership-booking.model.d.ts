import { Entity } from "@loopback/repository";
export declare class MembershipBooking extends Entity {
    id?: string;
    payment?: boolean;
    host?: string;
    bookingId: string;
    membershipUsageId: string;
    constructor(data?: Partial<MembershipBooking>);
}
export interface MembershipBookingRelations {
}
export declare type MembershipBookingWithRelations = MembershipBooking & MembershipBookingRelations;
