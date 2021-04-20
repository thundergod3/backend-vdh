"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipBookingRepository = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const models_1 = require("../models");
const datasources_1 = require("../datasources");
const core_1 = require("@loopback/core");
let MembershipBookingRepository = class MembershipBookingRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, bookingRepositoryGetter, membershipUsageRepositoryGetter) {
        super(models_1.MembershipBooking, dataSource);
        this.bookingRepositoryGetter = bookingRepositoryGetter;
        this.membershipUsageRepositoryGetter = membershipUsageRepositoryGetter;
        this.membershipUsage = this.createBelongsToAccessorFor('membershipUsage', membershipUsageRepositoryGetter);
        this.registerInclusionResolver('membershipUsage', this.membershipUsage.inclusionResolver);
        this.booking = this.createBelongsToAccessorFor('booking', bookingRepositoryGetter);
        this.registerInclusionResolver('booking', this.booking.inclusionResolver);
    }
};
MembershipBookingRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')), tslib_1.__param(1, repository_1.repository.getter('BookingRepository')), tslib_1.__param(2, repository_1.repository.getter('MembershipUsageRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function, Function])
], MembershipBookingRepository);
exports.MembershipBookingRepository = MembershipBookingRepository;
//# sourceMappingURL=membership-booking.repository.js.map