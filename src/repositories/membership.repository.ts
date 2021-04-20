import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Membership, MembershipRelations, MembershipUsage} from '../models';
import {MongoConnectorDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {MembershipUsageRepository} from './membership-usage.repository';

export class MembershipRepository extends DefaultCrudRepository<
  Membership,
  typeof Membership.prototype.id,
  MembershipRelations
> {

  public readonly usage: HasManyRepositoryFactory<MembershipUsage, typeof Membership.prototype.id>;

  constructor(
    @inject('datasources.MongoConnector') dataSource: MongoConnectorDataSource, @repository.getter('MembershipUsageRepository') protected membershipUsageRepositoryGetter: Getter<MembershipUsageRepository>,
  ) {
    super(Membership, dataSource);
    this.usage = this.createHasManyRepositoryFactoryFor('usage', membershipUsageRepositoryGetter,);
    this.registerInclusionResolver('usage', this.usage.inclusionResolver);
  }
}
