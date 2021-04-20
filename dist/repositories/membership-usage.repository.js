"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipUsageRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let MembershipUsageRepository = class MembershipUsageRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, userRepositoryGetter, membershipRepositoryGetter, membershipTransactionRepositoryGetter, membershipBookingRepositoryGetter) {
        super(models_1.MembershipUsage, dataSource);
        this.userRepositoryGetter = userRepositoryGetter;
        this.membershipRepositoryGetter = membershipRepositoryGetter;
        this.membershipTransactionRepositoryGetter = membershipTransactionRepositoryGetter;
        this.membershipBookingRepositoryGetter = membershipBookingRepositoryGetter;
        this.membershipBookings = this.createHasManyRepositoryFactoryFor("membershipBookings", membershipBookingRepositoryGetter);
        this.registerInclusionResolver("membershipBookings", this.membershipBookings.inclusionResolver);
        this.membershipTransactions = this.createHasManyRepositoryFactoryFor("membershipTransactions", membershipTransactionRepositoryGetter);
        this.registerInclusionResolver("membershipTransactions", this.membershipTransactions.inclusionResolver);
        this.membership = this.createBelongsToAccessorFor("membership", membershipRepositoryGetter);
        this.registerInclusionResolver("membership", this.membership.inclusionResolver);
        this.usage = this.createBelongsToAccessorFor("usage", userRepositoryGetter);
        this.registerInclusionResolver("usage", this.usage.inclusionResolver);
    }
    async checkUserMembership(userId) {
        const result = await this.findOne({
            where: { userId },
            include: [{ relation: "membership" }],
        });
        return result;
    }
};
MembershipUsageRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject("datasources.MongoConnector")),
    tslib_1.__param(1, repository_1.repository.getter("UserRepository")),
    tslib_1.__param(2, repository_1.repository.getter("MembershipRepository")),
    tslib_1.__param(3, repository_1.repository.getter("MembershipTransactionRepository")),
    tslib_1.__param(4, repository_1.repository.getter("MembershipBookingRepository")),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function, Function, Function, Function])
], MembershipUsageRepository);
exports.MembershipUsageRepository = MembershipUsageRepository;
//# sourceMappingURL=membership-usage.repository.js.map