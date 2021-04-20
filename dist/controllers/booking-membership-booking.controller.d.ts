import { Count, Filter, Where } from '@loopback/repository';
import { Booking, MembershipBooking } from '../models';
import { BookingRepository } from '../repositories';
export declare class BookingMembershipBookingController {
    protected bookingRepository: BookingRepository;
    constructor(bookingRepository: BookingRepository);
    find(id: string, filter?: Filter<MembershipBooking>): Promise<MembershipBooking[]>;
    create(id: typeof Booking.prototype.id, membershipBooking: Omit<MembershipBooking, 'id'>): Promise<MembershipBooking>;
    patch(id: string, membershipBooking: Partial<MembershipBooking>, where?: Where<MembershipBooking>): Promise<Count>;
    delete(id: string, where?: Where<MembershipBooking>): Promise<Count>;
}
