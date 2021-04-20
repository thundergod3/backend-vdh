import { DefaultCrudRepository, BelongsToAccessor } from '@loopback/repository';
import { MembershipBooking, MembershipBookingRelations, Booking, MembershipUsage } from '../models';
import { MongoConnectorDataSource } from '../datasources';
import { Getter } from '@loopback/core';
import { BookingRepository } from './booking.repository';
import { MembershipUsageRepository } from './membership-usage.repository';
export declare class MembershipBookingRepository extends DefaultCrudRepository<MembershipBooking, typeof MembershipBooking.prototype.id, MembershipBookingRelations> {
    protected bookingRepositoryGetter: Getter<BookingRepository>;
    protected membershipUsageRepositoryGetter: Getter<MembershipUsageRepository>;
    readonly booking: BelongsToAccessor<Booking, typeof MembershipBooking.prototype.id>;
    readonly membershipUsage: BelongsToAccessor<MembershipUsage, typeof MembershipBooking.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, bookingRepositoryGetter: Getter<BookingRepository>, membershipUsageRepositoryGetter: Getter<MembershipUsageRepository>);
}
