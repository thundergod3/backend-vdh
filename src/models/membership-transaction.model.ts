import {belongsTo, Entity, model, property} from '@loopback/repository';
import {MembershipUsage} from './membership-usage.model';

@model()
export class MembershipTransaction extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @property({
        type: 'number',
        required: true,
    })
    price: number;

    @property({
        type: 'string',
        default: 'UNPROCESSED',
    })
    type?: string;

    @property({
        type: 'date',
        required: true,
    })
    createdAt: Date;

    @property({
        type: 'boolean',
        default: false,
    })
    payment?: boolean;

    @belongsTo(() => MembershipUsage, {name: 'membershipUsage'})
    membershipUsageId: string;

    constructor(data?: Partial<MembershipTransaction>) {
        super(data);
    }
}

export interface MembershipTransactionRelations {
    // describe navigational properties here
}

export type MembershipTransactionWithRelations = MembershipTransaction &
    MembershipTransactionRelations;
