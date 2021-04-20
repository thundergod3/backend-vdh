"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Membership = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const membership_usage_model_1 = require("./membership-usage.model");
let Membership = class Membership extends repository_1.Entity {
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
], Membership.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Membership.prototype, "price", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Membership.prototype, "name", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Membership.prototype, "description", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => membership_usage_model_1.MembershipUsage),
    tslib_1.__metadata("design:type", Array)
], Membership.prototype, "usage", void 0);
Membership = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Membership);
exports.Membership = Membership;
//# sourceMappingURL=membership.model.js.map