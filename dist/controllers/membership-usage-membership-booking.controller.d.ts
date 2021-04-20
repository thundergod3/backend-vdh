import { Count, Filter, Where } from '@loopback/repository';
import { MembershipUsage, MembershipBooking } from '../models';
import { MembershipUsageRepository } from '../repositories';
export declare class MembershipUsageMembershipBookingController {
    protected membershipUsageRepository: MembershipUsageRepository;
    constructor(membershipUsageRepository: MembershipUsageRepository);
    find(id: string, filter?: Filter<MembershipBooking>): Promise<MembershipBooking[]>;
    create(id: typeof MembershipUsage.prototype.id, membershipBooking: Omit<MembershipBooking, 'id'>): Promise<MembershipBooking>;
    patch(id: string, membershipBooking: Partial<MembershipBooking>, where?: Where<MembershipBooking>): Promise<Count>;
    delete(id: string, where?: Where<MembershipBooking>): Promise<Count>;
}
