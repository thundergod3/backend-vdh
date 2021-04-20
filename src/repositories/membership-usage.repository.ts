import { Getter, inject } from "@loopback/core";
import {
	BelongsToAccessor,
	DefaultCrudRepository,
	HasManyRepositoryFactory,
	repository,
} from "@loopback/repository";
import { MongoConnectorDataSource } from "../datasources";
import {
	Membership,
	MembershipBooking,
	MembershipTransaction,
	MembershipUsage,
	MembershipUsageRelations,
	User,
} from "../models";
import { MembershipBookingRepository } from "./membership-booking.repository";
import { MembershipTransactionRepository } from "./membership-transaction.repository";
import { MembershipRepository } from "./membership.repository";
import { UserRepository } from "./user.repository";

export class MembershipUsageRepository extends DefaultCrudRepository<
	MembershipUsage,
	typeof MembershipUsage.prototype.id,
	MembershipUsageRelations
> {
	public readonly usage: BelongsToAccessor<
		User,
		typeof MembershipUsage.prototype.id
	>;

	public readonly membership: BelongsToAccessor<
		Membership,
		typeof MembershipUsage.prototype.id
	>;

	public readonly membershipTransactions: HasManyRepositoryFactory<
		MembershipTransaction,
		typeof MembershipUsage.prototype.id
	>;

	public readonly membershipBookings: HasManyRepositoryFactory<
		MembershipBooking,
		typeof MembershipUsage.prototype.id
	>;

	constructor(
		@inject("datasources.MongoConnector")
		dataSource: MongoConnectorDataSource,
		@repository.getter("UserRepository")
		protected userRepositoryGetter: Getter<UserRepository>,
		@repository.getter("MembershipRepository")
		protected membershipRepositoryGetter: Getter<MembershipRepository>,
		@repository.getter("MembershipTransactionRepository")
		protected membershipTransactionRepositoryGetter: Getter<
			MembershipTransactionRepository
		>,
		@repository.getter("MembershipBookingRepository")
		protected membershipBookingRepositoryGetter: Getter<
			MembershipBookingRepository
		>
	) {
		super(MembershipUsage, dataSource);
		this.membershipBookings = this.createHasManyRepositoryFactoryFor(
			"membershipBookings",
			membershipBookingRepositoryGetter
		);
		this.registerInclusionResolver(
			"membershipBookings",
			this.membershipBookings.inclusionResolver
		);

		this.membershipTransactions = this.createHasManyRepositoryFactoryFor(
			"membershipTransactions",
			membershipTransactionRepositoryGetter
		);
		this.registerInclusionResolver(
			"membershipTransactions",
			this.membershipTransactions.inclusionResolver
		);
		this.membership = this.createBelongsToAccessorFor(
			"membership",
			membershipRepositoryGetter
		);
		this.registerInclusionResolver(
			"membership",
			this.membership.inclusionResolver
		);
		this.usage = this.createBelongsToAccessorFor(
			"usage",
			userRepositoryGetter
		);
		this.registerInclusionResolver("usage", this.usage.inclusionResolver);
	}

	async checkUserMembership(userId: string): Promise<any> {
		const result = await this.findOne({
			where: { userId },
			include: [{ relation: "membership" }],
		});
		return result;
	}
}
