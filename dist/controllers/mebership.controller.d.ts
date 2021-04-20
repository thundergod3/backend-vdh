/// <reference types="express" />
import { Request } from "@loopback/rest";
import { UserProfile } from "@loopback/security";
import { MembershipBookingRepository, MembershipRepository, MembershipUsageRepository, UserRepository } from "../repositories";
import { PaymentService } from "../services";
export declare class MebershipController {
    private memberShipRepository;
    private usageRepository;
    private userRepository;
    private mbsBookingRepository;
    private user;
    private paymentService;
    private request;
    constructor(memberShipRepository: MembershipRepository, usageRepository: MembershipUsageRepository, userRepository: UserRepository, mbsBookingRepository: MembershipBookingRepository, user: UserProfile, paymentService: PaymentService, request: Request);
    getMembership(): Promise<(import("../models").Membership & import("../models").MembershipRelations)[]>;
    registerMembership(membershipId: string): Promise<{
        vnpayUrl: string;
        newUsage: any;
    }>;
    getMembershipOfUser(): Promise<import("../models").MembershipUsage[]>;
    cancelMembership(membershipId: string): Promise<{
        message: string;
    }>;
    renewMembership(membershipId: string): Promise<{
        vnpayUrl: string;
    }>;
    findBookingOfCW(month: number): Promise<any>;
    markPayment(month: number): Promise<void>;
}
