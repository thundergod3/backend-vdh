"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipUsage = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const membership_booking_model_1 = require("./membership-booking.model");
const membership_transaction_model_1 = require("./membership-transaction.model");
const membership_model_1 = require("./membership.model");
const user_model_1 = require("./user.model");
let MembershipUsage = class MembershipUsage extends repository_1.Entity {
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
], MembershipUsage.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: "number",
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], MembershipUsage.prototype, "cash", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: "date",
        default: new Date(),
    }),
    tslib_1.__metadata("design:type", Date)
], MembershipUsage.prototype, "createdAt", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: "string",
    }),
    tslib_1.__metadata("design:type", String)
], MembershipUsage.prototype, "status", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: "number",
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], MembershipUsage.prototype, "times", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: "date",
    }),
    tslib_1.__metadata("design:type", Date)
], MembershipUsage.prototype, "outdatedAt", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => user_model_1.User, { name: "usage" }),
    tslib_1.__metadata("design:type", String)
], MembershipUsage.prototype, "userId", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => membership_model_1.Membership),
    tslib_1.__metadata("design:type", String)
], MembershipUsage.prototype, "membershipId", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => membership_transaction_model_1.MembershipTransaction, { keyTo: "membershipTransaction" }),
    tslib_1.__metadata("design:type", Array)
], MembershipUsage.prototype, "membershipTransactions", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => membership_booking_model_1.MembershipBooking),
    tslib_1.__metadata("design:type", Array)
], MembershipUsage.prototype, "membershipBookings", void 0);
MembershipUsage = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], MembershipUsage);
exports.MembershipUsage = MembershipUsage;
//# sourceMappingURL=membership-usage.model.js.map