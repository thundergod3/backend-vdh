/// <reference types="express" />
import { Request } from "@loopback/rest";
import { MembershipTransaction } from "../models";
export declare class PaymentService {
    constructor();
    getVNPayURL(request: Request, transaction: MembershipTransaction, userId: string, mbsUsageId: string): Promise<{
        vnpayUrl: string;
    }>;
    sortObject(o: any): any;
}
