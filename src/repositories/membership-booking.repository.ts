import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MembershipBooking, MembershipBookingRelations, Booking, MembershipUsage} from '../models';
import {MongoConnectorDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {BookingRepository} from './booking.repository';
import {MembershipUsageRepository} from './membership-usage.repository';

export class MembershipBookingRepository extends DefaultCrudRepository<
  MembershipBooking,
  typeof MembershipBooking.prototype.id,
  MembershipBookingRelations
> {

  public readonly booking: BelongsToAccessor<Booking, typeof MembershipBooking.prototype.id>;

  public readonly membershipUsage: BelongsToAccessor<MembershipUsage, typeof MembershipBooking.prototype.id>;

  constructor(
    @inject('datasources.MongoConnector') dataSource: MongoConnectorDataSource, @repository.getter('BookingRepository') protected bookingRepositoryGetter: Getter<BookingRepository>, @repository.getter('MembershipUsageRepository') protected membershipUsageRepositoryGetter: Getter<MembershipUsageRepository>,
  ) {
    super(MembershipBooking, dataSource);
    this.membershipUsage = this.createBelongsToAccessorFor('membershipUsage', membershipUsageRepositoryGetter,);
    this.registerInclusionResolver('membershipUsage', this.membershipUsage.inclusionResolver);
    this.booking = this.createBelongsToAccessorFor('booking', bookingRepositoryGetter,);
    this.registerInclusionResolver('booking', this.booking.inclusionResolver);
  }
}
