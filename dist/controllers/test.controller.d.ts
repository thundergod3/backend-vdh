/// <reference types="express" />
import { Request, Response } from '@loopback/rest';
import { BookingRepository, MembershipRepository, MembershipUsageRepository, UserRepository } from '../repositories';
export declare class TestController {
    private bookingRepository;
    private userRepository;
    private mbsRepository;
    private mbsUsageRepository;
    constructor(bookingRepository: BookingRepository, userRepository: UserRepository, mbsRepository: MembershipRepository, mbsUsageRepository: MembershipUsageRepository);
    initMembership(): Promise<"added" | "Full">;
    test(): Promise<string>;
    check(userId: string, cwId: string): Promise<boolean>;
    testNoti(): Promise<import("../models").User & import("../models").UserRelations>;
    create(request: Request, response: Response): Promise<any>;
    testMbs(userId: string): Promise<any>;
}
