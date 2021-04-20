import {Entity, hasMany, model, property} from '@loopback/repository';
import {MembershipUsage} from './membership-usage.model';

@model()
export class Membership extends Entity {
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
        required: true,
    })
    name: string;

    @property({
        type: 'string',
        required: true,
    })
    description: string;

    @hasMany(() => MembershipUsage)
    usage: MembershipUsage[];

    constructor(data?: Partial<Membership>) {
        super(data);
    }
}

export interface MembershipRelations {
    // describe navigational properties here
}

export type MembershipWithRelations = Membership & MembershipRelations;
