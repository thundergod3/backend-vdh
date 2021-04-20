import { MembershipUsage, User } from '../models';
import { MembershipUsageRepository } from '../repositories';
export declare class MembershipUsageUserController {
    membershipUsageRepository: MembershipUsageRepository;
    constructor(membershipUsageRepository: MembershipUsageRepository);
    getUser(id: typeof MembershipUsage.prototype.id): Promise<User>;
}
