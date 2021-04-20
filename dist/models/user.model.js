"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const booking_model_1 = require("./booking.model");
const card_model_1 = require("./card.model");
const co_working_model_1 = require("./co-working.model");
const review_model_1 = require("./review.model");
const membership_usage_model_1 = require("./membership-usage.model");
let User = class User extends repository_1.Entity {
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
], User.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "fullname", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "birth", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
        jsonSchema: {
            pattern: `^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$`,
        },
    }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "email", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "address", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        default: Date(),
    }),
    tslib_1.__metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        default: Date(),
    }),
    tslib_1.__metadata("design:type", Date)
], User.prototype, "modifiedAt", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        default: 'default/user-account.png',
    }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "avatar", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "point", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "coin", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "password", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        default: [],
    }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "token", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        default: [],
    }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "firebaseToken", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'array',
        itemType: 'string',
        required: true,
        default: [],
    }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "role", void 0);
tslib_1.__decorate([
    repository_1.hasOne(() => co_working_model_1.CoWorking),
    tslib_1.__metadata("design:type", co_working_model_1.CoWorking)
], User.prototype, "coWorking", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => booking_model_1.Booking),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "bookings", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => card_model_1.Card),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "cards", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => review_model_1.Review),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "reviews", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => membership_usage_model_1.MembershipUsage, { keyTo: 'usage' }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "membershipUsages", void 0);
User = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], User);
exports.User = User;
//# sourceMappingURL=user.model.js.map