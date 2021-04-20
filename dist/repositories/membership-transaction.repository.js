"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipTransactionRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let MembershipTransactionRepository = class MembershipTransactionRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, membershipUsageRepositoryGetter) {
        super(models_1.MembershipTransaction, dataSource);
        this.membershipUsageRepositoryGetter = membershipUsageRepositoryGetter;
        this.membershipTransactions = this.createBelongsToAccessorFor('membershipUsage', membershipUsageRepositoryGetter);
        this.registerInclusionResolver('membershipUsage', this.membershipTransactions.inclusionResolver);
    }
};
MembershipTransactionRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')),
    tslib_1.__param(1, repository_1.repository.getter('MembershipUsageRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function])
], MembershipTransactionRepository);
exports.MembershipTransactionRepository = MembershipTransactionRepository;
//# sourceMappingURL=membership-transaction.repository.js.map