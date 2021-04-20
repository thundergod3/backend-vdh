import {Getter, inject} from '@loopback/core';
import {
    BelongsToAccessor,
    DefaultCrudRepository,
    repository,
} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {
    MembershipTransaction,
    MembershipTransactionRelations,
    MembershipUsage,
} from '../models';
import {MembershipUsageRepository} from './membership-usage.repository';

export class MembershipTransactionRepository extends DefaultCrudRepository<
    MembershipTransaction,
    typeof MembershipTransaction.prototype.id,
    MembershipTransactionRelations
> {
    public readonly membershipTransactions: BelongsToAccessor<
        MembershipUsage,
        typeof MembershipTransaction.prototype.id
    >;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('MembershipUsageRepository')
        protected membershipUsageRepositoryGetter: Getter<
            MembershipUsageRepository
        >,
    ) {
        super(MembershipTransaction, dataSource);
        this.membershipTransactions = this.createBelongsToAccessorFor(
            'membershipUsage',
            membershipUsageRepositoryGetter,
        );
        this.registerInclusionResolver(
            'membershipUsage',
            this.membershipTransactions.inclusionResolver,
        );
    }
}
