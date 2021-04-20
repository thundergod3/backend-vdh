"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipRepository = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const models_1 = require("../models");
const datasources_1 = require("../datasources");
const core_1 = require("@loopback/core");
let MembershipRepository = class MembershipRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, membershipUsageRepositoryGetter) {
        super(models_1.Membership, dataSource);
        this.membershipUsageRepositoryGetter = membershipUsageRepositoryGetter;
        this.usage = this.createHasManyRepositoryFactoryFor('usage', membershipUsageRepositoryGetter);
        this.registerInclusionResolver('usage', this.usage.inclusionResolver);
    }
};
MembershipRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')), tslib_1.__param(1, repository_1.repository.getter('MembershipUsageRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function])
], MembershipRepository);
exports.MembershipRepository = MembershipRepository;
//# sourceMappingURL=membership.repository.js.map