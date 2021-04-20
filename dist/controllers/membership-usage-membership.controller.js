"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipUsageMembershipController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let MembershipUsageMembershipController = class MembershipUsageMembershipController {
    constructor(membershipUsageRepository) {
        this.membershipUsageRepository = membershipUsageRepository;
    }
    async getMembership(id) {
        return this.membershipUsageRepository.membership(id);
    }
};
tslib_1.__decorate([
    rest_1.get('/membership-usages/{id}/membership', {
        responses: {
            '200': {
                description: 'Membership belonging to MembershipUsage',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.Membership) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MembershipUsageMembershipController.prototype, "getMembership", null);
MembershipUsageMembershipController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.MembershipUsageRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MembershipUsageRepository])
], MembershipUsageMembershipController);
exports.MembershipUsageMembershipController = MembershipUsageMembershipController;
//# sourceMappingURL=membership-usage-membership.controller.js.map