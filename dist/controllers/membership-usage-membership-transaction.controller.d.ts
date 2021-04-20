import { Count, Filter, Where } from '@loopback/repository';
import { MembershipUsage, MembershipTransaction } from '../models';
import { MembershipUsageRepository } from '../repositories';
export declare class MembershipUsageMembershipTransactionController {
    protected membershipUsageRepository: MembershipUsageRepository;
    constructor(membershipUsageRepository: MembershipUsageRepository);
    find(id: string, filter?: Filter<MembershipTransaction>): Promise<MembershipTransaction[]>;
    create(id: typeof MembershipUsage.prototype.id, membershipTransaction: Omit<MembershipTransaction, 'id'>): Promise<MembershipTransaction>;
    patch(id: string, membershipTransaction: Partial<MembershipTransaction>, where?: Where<MembershipTransaction>): Promise<Count>;
    delete(id: string, where?: Where<MembershipTransaction>): Promise<Count>;
}
