import { Booking, Room, Transaction, User } from "../models";
import { BookingRepository, MembershipUsageRepository } from "../repositories";
export declare class NotificationService {
    static notifyAfterCreate(newTransaction: Transaction, newBooking: Booking, room: any, user: User, host: User, bookingRepository: BookingRepository): Promise<void>;
    static notifyAfterUpdate(newTransaction: Transaction, newBooking: Booking, room: any, user: User, host: User, bookingRepository: BookingRepository): Promise<void>;
    static notifyAfterCancel(bookingId: string, newTransaction: Transaction, host: User): Promise<void>;
    static notifyAfterCheckin(client: User, host: User, room: Room, bookingId: string, bookingRef: string): Promise<void>;
    static notifyAfterCheckout(user: User, host: User, point: number, bookingId: string, bookingRef: string): Promise<void>;
    static notifyExpireMbs(userId: string, mbsUsageId: string, mbsUsageRepository: MembershipUsageRepository): Promise<void>;
    static terminateMbs(mbsUsageId: string, mbsUsageRepository: MembershipUsageRepository): Promise<void>;
}
