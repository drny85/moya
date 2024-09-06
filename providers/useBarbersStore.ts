import { create } from 'zustand';
import { Barber } from '~/shared/types';

type BarberStoreParams = {
   barbers: Barber[];
   setBarbers: (barbers: Barber[]) => void;
   getBarberById: (id: string) => Barber;
};

export const useBarbersStore = create<BarberStoreParams>((set, get) => ({
   barbers: [],
   setBarbers: (barbers) => set({ barbers }),
   getBarberById: (id) => get().barbers.find((barber) => barber.id === id)!,
}));
