import { DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { Membership, MembershipRelations, MembershipUsage } from '../models';
import { MongoConnectorDataSource } from '../datasources';
import { Getter } from '@loopback/core';
import { MembershipUsageRepository } from './membership-usage.repository';
export declare class MembershipRepository extends DefaultCrudRepository<Membership, typeof Membership.prototype.id, MembershipRelations> {
    protected membershipUsageRepositoryGetter: Getter<MembershipUsageRepository>;
    readonly usage: HasManyRepositoryFactory<MembershipUsage, typeof Membership.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, membershipUsageRepositoryGetter: Getter<MembershipUsageRepository>);
}
