import { Entity } from '@loopback/repository';
export declare class MembershipTransaction extends Entity {
    id?: string;
    price: number;
    type?: string;
    createdAt: Date;
    payment?: boolean;
    membershipUsageId: string;
    constructor(data?: Partial<MembershipTransaction>);
}
export interface MembershipTransactionRelations {
}
export declare type MembershipTransactionWithRelations = MembershipTransaction & MembershipTransactionRelations;
