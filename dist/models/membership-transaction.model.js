"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipTransaction = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const membership_usage_model_1 = require("./membership-usage.model");
let MembershipTransaction = class MembershipTransaction extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", String)
], MembershipTransaction.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], MembershipTransaction.prototype, "price", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        default: 'UNPROCESSED',
    }),
    tslib_1.__metadata("design:type", String)
], MembershipTransaction.prototype, "type", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], MembershipTransaction.prototype, "createdAt", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], MembershipTransaction.prototype, "payment", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => membership_usage_model_1.MembershipUsage, { name: 'membershipUsage' }),
    tslib_1.__metadata("design:type", String)
], MembershipTransaction.prototype, "membershipUsageId", void 0);
MembershipTransaction = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], MembershipTransaction);
exports.MembershipTransaction = MembershipTransaction;
//# sourceMappingURL=membership-transaction.model.js.map