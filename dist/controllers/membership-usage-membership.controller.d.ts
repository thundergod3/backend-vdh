import { MembershipUsage, Membership } from '../models';
import { MembershipUsageRepository } from '../repositories';
export declare class MembershipUsageMembershipController {
    membershipUsageRepository: MembershipUsageRepository;
    constructor(membershipUsageRepository: MembershipUsageRepository);
    getMembership(id: typeof MembershipUsage.prototype.id): Promise<Membership>;
}
