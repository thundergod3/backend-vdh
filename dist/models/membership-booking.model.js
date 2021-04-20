"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipBooking = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const booking_model_1 = require("./booking.model");
const membership_usage_model_1 = require("./membership-usage.model");
let MembershipBooking = class MembershipBooking extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property({
        type: "string",
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", String)
], MembershipBooking.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: "boolean",
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], MembershipBooking.prototype, "payment", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: "string",
        default: "",
    }),
    tslib_1.__metadata("design:type", String)
], MembershipBooking.prototype, "host", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => booking_model_1.Booking),
    tslib_1.__metadata("design:type", String)
], MembershipBooking.prototype, "bookingId", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => membership_usage_model_1.MembershipUsage),
    tslib_1.__metadata("design:type", String)
], MembershipBooking.prototype, "membershipUsageId", void 0);
MembershipBooking = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], MembershipBooking);
exports.MembershipBooking = MembershipBooking;
//# sourceMappingURL=membership-booking.model.js.map