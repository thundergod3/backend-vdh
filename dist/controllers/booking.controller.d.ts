import { UserProfile } from "@loopback/security";
import { Booking } from "../models";
import { BookingRepository, ExchangePointRepository, MembershipBookingRepository, MembershipUsageRepository, RoomRepository, TransactionRepository, UserRepository } from "../repositories";
export declare class BookingController {
    private bookingRepository;
    private userRepository;
    private roomRepository;
    private transactionRepository;
    private pointRepository;
    private mbsUsageRepository;
    private mbsBookingRepository;
    private user;
    constructor(bookingRepository: BookingRepository, userRepository: UserRepository, roomRepository: RoomRepository, transactionRepository: TransactionRepository, pointRepository: ExchangePointRepository, mbsUsageRepository: MembershipUsageRepository, mbsBookingRepository: MembershipBookingRepository, user: UserProfile);
    getPrice(bookingInfo: any): Promise<{
        price: number;
    }>;
    create(bookingInfo: any): Promise<Booking>;
    find(date: string, roomId: string): Promise<Booking[]>;
    findById(id: string): Promise<Booking>;
    updateById(id: string, updatedBooking: any): Promise<void>;
    cancelBooking(id: string): Promise<void>;
    checkIn(id: string): Promise<void>;
    checkOut(id: string): Promise<void>;
}
