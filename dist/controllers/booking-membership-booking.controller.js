"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingMembershipBookingController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let BookingMembershipBookingController = class BookingMembershipBookingController {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async find(id, filter) {
        return this.bookingRepository.membershipBookings(id).find(filter);
    }
    async create(id, membershipBooking) {
        return this.bookingRepository.membershipBookings(id).create(membershipBooking);
    }
    async patch(id, membershipBooking, where) {
        return this.bookingRepository.membershipBookings(id).patch(membershipBooking, where);
    }
    async delete(id, where) {
        return this.bookingRepository.membershipBookings(id).delete(where);
    }
};
tslib_1.__decorate([
    rest_1.get('/bookings/{id}/membership-bookings', {
        responses: {
            '200': {
                description: 'Array of Booking has many MembershipBooking',
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
], BookingMembershipBookingController.prototype, "find", null);
tslib_1.__decorate([
    rest_1.post('/bookings/{id}/membership-bookings', {
        responses: {
            '200': {
                description: 'Booking model instance',
                content: { 'application/json': { schema: rest_1.getModelSchemaRef(models_1.MembershipBooking) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.MembershipBooking, {
                    title: 'NewMembershipBookingInBooking',
                    exclude: ['id'],
                    optional: ['bookingId']
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingMembershipBookingController.prototype, "create", null);
tslib_1.__decorate([
    rest_1.patch('/bookings/{id}/membership-bookings', {
        responses: {
            '200': {
                description: 'Booking.MembershipBooking PATCH success count',
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
], BookingMembershipBookingController.prototype, "patch", null);
tslib_1.__decorate([
    rest_1.del('/bookings/{id}/membership-bookings', {
        responses: {
            '200': {
                description: 'Booking.MembershipBooking DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.MembershipBooking))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingMembershipBookingController.prototype, "delete", null);
BookingMembershipBookingController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.BookingRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.BookingRepository])
], BookingMembershipBookingController);
exports.BookingMembershipBookingController = BookingMembershipBookingController;
//# sourceMappingURL=booking-membership-booking.controller.js.map