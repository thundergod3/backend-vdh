"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.MebershipController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const basic_authentication_1 = require("../access-control/authenticator/basic-authentication");
const constants_1 = require("../config/constants");
const key_1 = require("../config/key");
const repositories_1 = require("../repositories");
const services_1 = require("../services");
let MebershipController = class MebershipController {
    constructor(memberShipRepository, usageRepository, userRepository, mbsBookingRepository, user, paymentService, request) {
        this.memberShipRepository = memberShipRepository;
        this.usageRepository = usageRepository;
        this.userRepository = userRepository;
        this.mbsBookingRepository = mbsBookingRepository;
        this.user = user;
        this.paymentService = paymentService;
        this.request = request;
    }
    async getMembership() {
        return this.memberShipRepository.find();
    }
    async registerMembership(membershipId) {
        const membership = await this.memberShipRepository.findById(membershipId);
        const used = await this.usageRepository.findOne({
            where: {
                userId: this.user[security_1.securityId],
                membershipId,
            },
        });
        // if (used) {
        // 	throw new HttpErrors.BadRequest("Already registered");
        // }
        const created = new Date();
        // ScheduleService.notifyExpireMbs(created);
        const newUsage = await this.usageRepository.create({
            userId: this.user[security_1.securityId],
            membershipId,
            status: constants_1.MembershipConstant.UNPAID,
            createdAt: created,
            outdatedAt: created,
        });
        const trans = await this.usageRepository
            .membershipTransactions(newUsage.id)
            .create({ price: membership.price, createdAt: created });
        // console.log(trans);
        const vnpURL = await this.paymentService.getVNPayURL(this.request, trans, this.user[security_1.securityId], newUsage.id);
        // console.log(vnpURL);
        return { newUsage, ...vnpURL };
    }
    async getMembershipOfUser() {
        return this.userRepository
            .membershipUsages(this.user[security_1.securityId])
            .find({ include: [{ relation: "membership" }] });
    }
    async cancelMembership(membershipId) {
        const usage = await this.usageRepository.findOne({
            where: { userId: this.user[security_1.securityId], membershipId },
        });
        if (!usage) {
            throw new rest_1.HttpErrors.BadRequest();
        }
        usage.status = constants_1.MembershipConstant.CANCELED;
        this.usageRepository.update(usage);
        return { message: "Canceled successfully." };
    }
    async renewMembership(membershipId) {
        const membership = await this.memberShipRepository.findById(membershipId);
        const used = await this.usageRepository.findOne({
            where: {
                userId: this.user[security_1.securityId],
                membershipId,
            },
        });
        if (!used) {
            throw new rest_1.HttpErrors.BadRequest(`You haven't registered to this membership`);
        }
        const transaction = await this.usageRepository
            .membershipTransactions(used.id)
            .create({ price: membership.price, createdAt: new Date() });
        // console.log(transaction);
        // console.log(used);
        // console.log(membership);
        const vnpURL = await this.paymentService.getVNPayURL(this.request, transaction, this.user[security_1.securityId], used.id);
        return { ...vnpURL };
    }
    async findBookingOfCW(month) {
        let whereCond = {};
        if (month) {
            month--;
            const start = new Date(new Date(new Date().setMonth(month)).setDate(1));
            const end = new Date(new Date(start).setMonth(start.getMonth() + 1));
            whereCond = {
                and: [
                    {
                        startTime: {
                            gte: start,
                        },
                    },
                    { endTime: { lt: end } },
                ],
            };
        }
        let list = await this.mbsBookingRepository.find({
            where: {
                host: this.user[security_1.securityId],
            },
            include: [
                {
                    relation: "booking",
                    scope: {
                        where: whereCond,
                        include: [
                            { relation: "transaction" },
                            { relation: "room" },
                        ],
                    },
                },
                {
                    relation: "membershipUsage",
                    scope: {
                        include: [
                            {
                                relation: "usage",
                                scope: {
                                    fields: {
                                        id: true,
                                        email: true,
                                        fullname: true,
                                    },
                                },
                            },
                        ],
                    },
                },
            ],
        });
        let sum = 0;
        list = list.filter((item) => {
            if (item.booking) {
                sum += item.booking.transaction.price;
            }
            return item.booking;
        });
        return { list, total: sum };
    }
    async markPayment(month) {
        let whereCond = {};
        if (month) {
            month--;
            const start = new Date(new Date(new Date().setMonth(month)).setDate(1));
            const end = new Date(new Date(start).setMonth(start.getMonth() + 1));
            whereCond = {
                and: [
                    {
                        startTime: {
                            gte: start,
                        },
                    },
                    { endTime: { lt: end } },
                ],
            };
        }
        let list = await this.mbsBookingRepository.find({
            where: {
                host: this.user[security_1.securityId],
            },
            include: [
                {
                    relation: "booking",
                    scope: {
                        where: whereCond,
                        include: [
                            { relation: "transaction" },
                            { relation: "room" },
                        ],
                    },
                },
                {
                    relation: "membershipUsage",
                    scope: {
                        include: [
                            {
                                relation: "usage",
                                scope: {
                                    fields: {
                                        id: true,
                                        email: true,
                                        fullname: true,
                                    },
                                },
                            },
                        ],
                    },
                },
            ],
        });
        list = list.map(async (item) => {
            if (item.booking) {
                item.payment = true;
                delete item.booking;
                delete item.membershipUsage;
                await this.mbsBookingRepository.update(item);
            }
        });
    }
};
tslib_1.__decorate([
    rest_1.get("/membership"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MebershipController.prototype, "getMembership", null);
tslib_1.__decorate([
    rest_1.post("/membership/register/{membershipId}"),
    tslib_1.__param(0, rest_1.param.path.string("membershipId")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MebershipController.prototype, "registerMembership", null);
tslib_1.__decorate([
    rest_1.get("/membership/user"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MebershipController.prototype, "getMembershipOfUser", null);
tslib_1.__decorate([
    rest_1.patch("/membership/cancel/{membershipId}"),
    tslib_1.__param(0, rest_1.param.path.string("membershipId")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MebershipController.prototype, "cancelMembership", null);
tslib_1.__decorate([
    rest_1.patch("/membership/renew/{membershipId}"),
    tslib_1.__param(0, rest_1.param.path.string("membershipId")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MebershipController.prototype, "renewMembership", null);
tslib_1.__decorate([
    authorization_1.authorize({
        allowedRoles: ["host"],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.get("membership/bookings"),
    tslib_1.__param(0, rest_1.param.query.string("month")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], MebershipController.prototype, "findBookingOfCW", null);
tslib_1.__decorate([
    authorization_1.authorize({
        allowedRoles: ["host"],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.patch("/membership/payment"),
    tslib_1.__param(0, rest_1.param.query.string("month")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], MebershipController.prototype, "markPayment", null);
MebershipController = tslib_1.__decorate([
    authentication_1.authenticate("jwt"),
    tslib_1.__param(0, repository_1.repository(repositories_1.MembershipRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.MembershipUsageRepository)),
    tslib_1.__param(2, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(3, repository_1.repository(repositories_1.MembershipBookingRepository)),
    tslib_1.__param(4, core_1.inject(security_1.SecurityBindings.USER, { optional: true })),
    tslib_1.__param(5, core_1.inject(key_1.PAYMENT_SERVICE)),
    tslib_1.__param(6, core_1.inject(rest_1.RestBindings.Http.REQUEST)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MembershipRepository,
        repositories_1.MembershipUsageRepository,
        repositories_1.UserRepository,
        repositories_1.MembershipBookingRepository, Object, services_1.PaymentService, Object])
], MebershipController);
exports.MebershipController = MebershipController;
//# sourceMappingURL=mebership.controller.js.map