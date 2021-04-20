/// <reference types="express" />
import { Request } from "@loopback/rest";
import querystring from "qs";
import { MembershipTransactionRepository, MembershipUsageRepository } from "../repositories";
import { PaymentService } from "../services";
export declare class PaymentController {
    private mbsTransactionRepository;
    private mbsUsageRepository;
    private request;
    private paymentService;
    constructor(mbsTransactionRepository: MembershipTransactionRepository, mbsUsageRepository: MembershipUsageRepository, request: Request, paymentService: PaymentService);
    vnpayIpn(): Promise<any>;
    paymentResult(): Promise<{
        code: string | querystring.ParsedQs | string[] | querystring.ParsedQs[] | undefined;
    } | undefined>;
}
