import { Entity } from '@loopback/repository';
import { MembershipUsage } from './membership-usage.model';
export declare class Membership extends Entity {
    id?: string;
    price: number;
    name: string;
    description: string;
    usage: MembershipUsage[];
    constructor(data?: Partial<Membership>);
}
export interface MembershipRelations {
}
export declare type MembershipWithRelations = Membership & MembershipRelations;
