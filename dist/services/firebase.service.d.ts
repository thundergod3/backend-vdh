import * as admin from "firebase-admin";
export declare class Firebase {
    static sendNotification(firebaseToken: string[], noti: {
        title: string;
        body: string;
    }): Promise<admin.messaging.BatchResponse | {
        error: boolean;
        message: any;
    } | undefined>;
    static remindCheckInClient(tokens: string[], bookingId: string, bookingRef: string, before: number): Promise<void>;
    static remindCheckInHost(tokens: string[], bookingId: string, clientName: string, bookingRef: string, before: number): Promise<void>;
    static remindCheckOutClient(tokens: string[], bookingId: string, bookingRef: string, before: number): Promise<void>;
    static remindCheckOutHost(tokens: string[], bookingId: string, clientName: string, bookingRef: string, before: number): Promise<void>;
    static notifyHostNewBooking(tokens: string[], bookingId: string, name: string, bookingRef: string): Promise<void>;
    static notifyHostUpdatedBooking(tokens: string[], bookingId: string, bookingRef: string): Promise<void>;
    static notifyClientCheckInOverTime(tokens: string[], bookingId: string, bookingRef: string): Promise<void>;
    static notifyHostCheckInOverTime(tokens: string[], bookingId: string, bookingRef: string): Promise<void>;
    static notifyClientCheckOutOverTime(tokens: string[], bookingId: string, bookingRef: string): Promise<void>;
    static notifyHostCheckOutOverTime(tokens: string[], bookingId: string, bookingRef: string): Promise<void>;
    static notifyCancelBooking(tokens: string[], bookingId: string, bookingRef: string): Promise<void>;
    static notifyClientCheckIn(tokens: string[], bookingId: string, roomName: any, bookingRef: string): Promise<void>;
    static notifyHostCheckIn(tokens: string[], bookingId: string, clientName: any, roomName: any, bookingRef: string): Promise<void>;
    static notifyPoint(tokens: string[], bookingId: string, point: number, bookingRef: string): Promise<void>;
    static notifyHostCheckOut(tokens: string[], bookingId: string, userName: any, bookingRef: string): Promise<void>;
    static notifyExpiredMembership(tokens: string[], mbsUsage: string, mbsId: string): Promise<void>;
    static terminateMembership(tokens: string[], mbsUsage: string, mbsId: string): Promise<void>;
}
