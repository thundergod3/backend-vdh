import { User } from "../models";
import { MembershipUsageRepository, UserRepository } from "../repositories";
import { BookingRepository } from "../repositories/booking.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
export declare class ScheduleService {
    private userRepository;
    private bookingRepository;
    private transactionRepository;
    static agenda: any;
    constructor(userRepository: UserRepository, bookingRepository: BookingRepository, transactionRepository: TransactionRepository);
    static cancelSchedule(name: string): Promise<void>;
    static notifyCheckIn(bookingId: string, bookingRef: string, startTime: Date, user: User, host: User, before?: number): Promise<void>;
    static notifyCheckOut(bookingId: string, bookingRef: string, endTime: Date, user: User, host: User, before?: number): Promise<void>;
    static verifyCheckIn: (id: string, startTime: Date, bookingRef: string, bookingRepository: BookingRepository, before?: number) => Promise<void>;
    static verifyCheckOut(id: string, endTime: Date, bookingRef: string, bookingRepository: BookingRepository, before?: number): Promise<void>;
    static notifyExpireMbs(fbToken: [], expireTime: Date, mbsUsageId: string, mbsId: string): Promise<void>;
    static terminateMbs(fbToken: [], expireTime: Date, mbsUsageId: string, mbsId: string, mbsUsageRepository: MembershipUsageRepository): Promise<void>;
}
