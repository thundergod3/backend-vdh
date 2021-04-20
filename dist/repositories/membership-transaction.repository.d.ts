import { Getter } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { MembershipTransaction, MembershipTransactionRelations, MembershipUsage } from '../models';
import { MembershipUsageRepository } from './membership-usage.repository';
export declare class MembershipTransactionRepository extends DefaultCrudRepository<MembershipTransaction, typeof MembershipTransaction.prototype.id, MembershipTransactionRelations> {
    protected membershipUsageRepositoryGetter: Getter<MembershipUsageRepository>;
    readonly membershipTransactions: BelongsToAccessor<MembershipUsage, typeof MembershipTransaction.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, membershipUsageRepositoryGetter: Getter<MembershipUsageRepository>);
}
