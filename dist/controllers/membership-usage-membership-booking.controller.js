"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipUsageMembershipBookingController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let MembershipUsageMembershipBookingController = class MembershipUsageMembershipBookingController {
    constructor(membershipUsageRepository) {
        this.membershipUsageRepository = membershipUsageRepository;
    }
    async find(id, filter) {
        return this.membershipUsageRepository.y(id).find(filter);
    }
    async create(id, membershipBooking) {
        return this.membershipUsageRepository.y(id).create(membershipBooking);
    }
    async patch(id, membershipBooking, where) {
        return this.membershipUsageRepository.y(id).patch(membershipBooking, where);
    }
    async delete(id, where) {
        return this.membershipUsageRepository.y(id).delete(where);
    }
};
tslib_1.__decorate([
    rest_1.get('/membership-usages/{id}/membership-bookings', {
        responses: {
            '200': {
                description: 'Array of MembershipUsage has many MembershipBooking',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.MembershipBooking) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('filter')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MembershipUsageMembershipBookingController.prototype, "find", null);
tslib_1.__decorate([
    rest_1.post('/membership-usages/{id}/membership-bookings', {
        responses: {
            '200': {
                description: 'MembershipUsage model instance',
                content: { 'application/json': { schema: rest_1.getModelSchemaRef(models_1.MembershipBooking) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.MembershipBooking, {
                    title: 'NewMembershipBookingInMembershipUsage',
                    exclude: ['id'],
                    optional: ['membershipUsageId']
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MembershipUsageMembershipBookingController.prototype, "create", null);
tslib_1.__decorate([
    rest_1.patch('/membership-usages/{id}/membership-bookings', {
        responses: {
            '200': {
                description: 'MembershipUsage.MembershipBooking PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.MembershipBooking, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.MembershipBooking))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MembershipUsageMembershipBookingController.prototype, "patch", null);
tslib_1.__decorate([
    rest_1.del('/membership-usages/{id}/membership-bookings', {
        responses: {
            '200': {
                description: 'MembershipUsage.MembershipBooking DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.MembershipBooking))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MembershipUsageMembershipBookingController.prototype, "delete", null);
MembershipUsageMembershipBookingController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.MembershipUsageRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MembershipUsageRepository])
], MembershipUsageMembershipBookingController);
exports.MembershipUsageMembershipBookingController = MembershipUsageMembershipBookingController;
//# sourceMappingURL=membership-usage-membership-booking.controller.js.map