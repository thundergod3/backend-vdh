"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
// Uncomment these imports to begin using these cool features!
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
// import {inject} from '@loopback/core';
const membership_1 = tslib_1.__importDefault(require("../config/membership"));
const repositories_1 = require("../repositories");
const services_1 = require("../services");
let TestController = class TestController {
    constructor(bookingRepository, userRepository, mbsRepository, mbsUsageRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.mbsRepository = mbsRepository;
        this.mbsUsageRepository = mbsUsageRepository;
    }
    async initMembership() {
        const list = await this.mbsRepository.find();
        console.log(list);
        if (list.length === 0) {
            membership_1.default.forEach(async (item) => {
                await this.mbsRepository.create(item);
            });
            return 'added';
        }
        else {
            return 'Full';
        }
    }
    async test() {
        return 'Jebaited';
    }
    async check(userId, cwId) {
        return await this.bookingRepository.checkUserRentCw(userId, cwId);
    }
    async testNoti() {
        const user = await this.userRepository.findById('5f51f6fa7fb4e46e69d60009', {
            fields: {
                id: true,
                fullname: true,
                avatar: true,
            },
        });
        return user;
    }
    async create(request, response) {
        const req = await services_1.parseRequest(request, response);
        console.log(req);
        const uploadFile = await services_1.saveFiles(req.files);
        return uploadFile;
    }
    async testMbs(userId) {
        const r = await this.mbsUsageRepository.checkUserMembership(userId);
        // r.cash = 1;
        // delete r.membership;
        // this.mbsUsageRepository.update(r);
        return r;
    }
};
tslib_1.__decorate([
    rest_1.post('/membership'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "initMembership", null);
tslib_1.__decorate([
    rest_1.get('/test/message'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "test", null);
tslib_1.__decorate([
    rest_1.get('/test/check/{userId}/{cwId}'),
    tslib_1.__param(0, rest_1.param.path.string('userId')),
    tslib_1.__param(1, rest_1.param.path.string('cwId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "check", null);
tslib_1.__decorate([
    rest_1.get('/test/noti'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "testNoti", null);
tslib_1.__decorate([
    rest_1.post('/test/upload'),
    tslib_1.__param(0, rest_1.requestBody({
        description: 'Create coworking',
        required: true,
        content: {
            'multipart/form-data': {
                'x-parser': 'stream',
                schema: {
                    type: 'object',
                    properties: {
                        coworking: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    })),
    tslib_1.__param(1, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "create", null);
tslib_1.__decorate([
    rest_1.get('/test/membership/{userId}'),
    tslib_1.__param(0, rest_1.param.path.string('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "testMbs", null);
TestController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.BookingRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(2, repository_1.repository(repositories_1.MembershipRepository)),
    tslib_1.__param(3, repository_1.repository(repositories_1.MembershipUsageRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.BookingRepository,
        repositories_1.UserRepository,
        repositories_1.MembershipRepository,
        repositories_1.MembershipUsageRepository])
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=test.controller.js.map