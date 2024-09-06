import { create } from 'zustand';
import { Service, TimeSlot } from '~/shared/types';

type AppointmentFlowStoreParams = {
   timeSlots: TimeSlot[];
   selectedTimeSlot: TimeSlot | null;
   setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void;
   selectedDate: Date;
   setSelectedDate: (date: Date) => void;
   index: number;
   setIndex: (index: number) => void;
   services: Service[];
   selectedServices: Service[];
   onServiceQuantityUpdates: (service: Service, quantity: number) => void;
   setSelectedServiceOrRemoveService: (service: Service) => Service[];
   setServices: (services: Service[]) => void;
};
export const useAppointmentFlowStore = create<AppointmentFlowStoreParams>((set, get) => ({
   timeSlots: [],
   services: [],
   index: 0,
   selectedServices: [],
   onServiceQuantityUpdates: (service: Service, quantity: number) => {
      const { selectedServices } = get();
      const updatedServices = selectedServices.map((s) => {
         if (s.id === service.id) {
            return { ...s, quantity };
         }
         return s;
      });
      set({ selectedServices: updatedServices });
   },
   setSelectedServiceOrRemoveService: (service: Service) => {
      const { selectedServices } = get();
      const isSelected = selectedServices.find((s) => s.id === service.id);
      if (isSelected) {
         set({ selectedServices: selectedServices.filter((s) => s.id !== service.id) });
         return selectedServices.filter((s) => s.id !== service.id);
      } else {
         set({ selectedServices: [...selectedServices, service] });
         return [...selectedServices, service];
      }
   },

   setIndex: (index: number) => set({ index }),

   setServices: (services: Service[]) => set({ selectedServices: services }),
   // selectedTimeSlot: null,
   selectedTimeSlot: null,
   selectedDate: new Date(),
   setSelectedTimeSlot: (timeSlot: TimeSlot | null) => set({ selectedTimeSlot: timeSlot }),
   setSelectedDate: (date: Date) => set({ selectedDate: date }),
}));
