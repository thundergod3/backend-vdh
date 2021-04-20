import { Getter } from "@loopback/core";
import { BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory } from "@loopback/repository";
import { MongoConnectorDataSource } from "../datasources";
import { Membership, MembershipBooking, MembershipTransaction, MembershipUsage, MembershipUsageRelations, User } from "../models";
import { MembershipBookingRepository } from "./membership-booking.repository";
import { MembershipTransactionRepository } from "./membership-transaction.repository";
import { MembershipRepository } from "./membership.repository";
import { UserRepository } from "./user.repository";
export declare class MembershipUsageRepository extends DefaultCrudRepository<MembershipUsage, typeof MembershipUsage.prototype.id, MembershipUsageRelations> {
    protected userRepositoryGetter: Getter<UserRepository>;
    protected membershipRepositoryGetter: Getter<MembershipRepository>;
    protected membershipTransactionRepositoryGetter: Getter<MembershipTransactionRepository>;
    protected membershipBookingRepositoryGetter: Getter<MembershipBookingRepository>;
    readonly usage: BelongsToAccessor<User, typeof MembershipUsage.prototype.id>;
    readonly membership: BelongsToAccessor<Membership, typeof MembershipUsage.prototype.id>;
    readonly membershipTransactions: HasManyRepositoryFactory<MembershipTransaction, typeof MembershipUsage.prototype.id>;
    readonly membershipBookings: HasManyRepositoryFactory<MembershipBooking, typeof MembershipUsage.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, userRepositoryGetter: Getter<UserRepository>, membershipRepositoryGetter: Getter<MembershipRepository>, membershipTransactionRepositoryGetter: Getter<MembershipTransactionRepository>, membershipBookingRepositoryGetter: Getter<MembershipBookingRepository>);
    checkUserMembership(userId: string): Promise<any>;
}
