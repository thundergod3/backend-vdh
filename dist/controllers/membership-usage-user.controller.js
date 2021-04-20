"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipUsageUserController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let MembershipUsageUserController = class MembershipUsageUserController {
    constructor(membershipUsageRepository) {
        this.membershipUsageRepository = membershipUsageRepository;
    }
    async getUser(id) {
        return this.membershipUsageRepository.usage(id);
    }
};
tslib_1.__decorate([
    rest_1.get('/membership-usages/{id}/user', {
        responses: {
            '200': {
                description: 'User belonging to MembershipUsage',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.User) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MembershipUsageUserController.prototype, "getUser", null);
MembershipUsageUserController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.MembershipUsageRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MembershipUsageRepository])
], MembershipUsageUserController);
exports.MembershipUsageUserController = MembershipUsageUserController;
//# sourceMappingURL=membership-usage-user.controller.js.map