export type Barber = {
   id: string; // Unique identifier for the barber
   name: string; // Barber's name
   email: string;
   phone: string;
   image: string | null; // URL of the barber's profile image
   isAvailable: boolean; // Optional rating for the barber
   isActive: boolean;
   isOwner?: boolean;
   bio?: string;
   gallery: Photo[];
   pushToken: string | null;
   minutesInterval: number;
   schedule: Schedule; // Optional biography or description of the barber
};
export type Photo = {
   id: string;
   uri: string;
   date: string;
};

export type Review = {
   customerId?: string;
   id?: string;
   barberId?: string;
   profileImage: string;
   name: string;
   date: string;
   rating: number;
   reviewTitle: string;
   reviewText: string;
};

export type AppUser = {
   id?: string;
   email: string;
   name?: string;
   phone?: string;
   gallery?: Photo[];
   isOwner?: boolean;
   image: string | null;
   pushToken: string | null;
   isBarber?: boolean;
} & (
   | {
        isBarber: false;
        favoriteBarber: string | null;
     }
   | (Barber & { isBarber: true })
);

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type Appointment = {
   id?: string;
   customer: Pick<AppUser, 'id' | 'name' | 'image' | 'phone' | 'pushToken'>;
   date: string;
   startTime: string;
   barber: Pick<Barber, 'id' | 'phone' | 'name' | 'image' | 'pushToken'>;
   services: Service[];
   updatedCount: number;
   status: AppointmentStatus;
   changesMadeBy: 'customer' | 'barber';
};

export type Response = {
   success: boolean;
   result: string | null;
};
export type IconNames =
   | 'haircut'
   | 'shave'
   | 'beardTrimming'
   | 'kids'
   | 'lotion'
   | 'towel'
   | 'razor';
export type IconImageType = {
   [key in IconNames]: any;
};

export type Service = {
   id?: string;
   name: string;
   barberId: string;
   price: number;
   duration: number;
   description?: string;
   quantity: number;
   icon: IconNames;
};

export type Days = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
export const dayOrder: Days[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export type DayAvailability = {
   date: string; // e.g., '2024-08-06'
   timeSlots: TimeSlot[];
};
export type LunchBreak = {
   start: string;
   end: string;
};

export type ScheduleDay = {
   isOff: boolean;
   lunchBreak: LunchBreak;
   startTime: string;
   endTime: string;
};

export type Schedule = {
   [key in Days]: ScheduleDay;
};

export type WeekDay = { date: Date; label: string; isPast: boolean };
export type TimeSlot = {
   time: string;
   isBooked: boolean;
};

export type NOTIFICATION_TYPE = 'new-appointment' | 'appointment-updates' | 'reminder';

export type NotificationData = {
   id: string;
   notificationType: NOTIFICATION_TYPE;
};
