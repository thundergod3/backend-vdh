"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipTransactionMembershipUsageController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let MembershipTransactionMembershipUsageController = class MembershipTransactionMembershipUsageController {
    constructor(membershipTransactionRepository) {
        this.membershipTransactionRepository = membershipTransactionRepository;
    }
    async getMembershipUsage(id) {
        return this.membershipTransactionRepository.membershipTransactions(id);
    }
};
tslib_1.__decorate([
    rest_1.get('/membership-transactions/{id}/membership-usage', {
        responses: {
            '200': {
                description: 'MembershipUsage belonging to MembershipTransaction',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.MembershipUsage) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MembershipTransactionMembershipUsageController.prototype, "getMembershipUsage", null);
MembershipTransactionMembershipUsageController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.MembershipTransactionRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MembershipTransactionRepository])
], MembershipTransactionMembershipUsageController);
exports.MembershipTransactionMembershipUsageController = MembershipTransactionMembershipUsageController;
//# sourceMappingURL=membership-transaction-membership-usage.controller.js.map