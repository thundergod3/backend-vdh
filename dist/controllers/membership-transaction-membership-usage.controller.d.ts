import { MembershipTransaction, MembershipUsage } from '../models';
import { MembershipTransactionRepository } from '../repositories';
export declare class MembershipTransactionMembershipUsageController {
    membershipTransactionRepository: MembershipTransactionRepository;
    constructor(membershipTransactionRepository: MembershipTransactionRepository);
    getMembershipUsage(id: typeof MembershipTransaction.prototype.id): Promise<MembershipUsage>;
}
