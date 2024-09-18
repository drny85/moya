import { create } from 'zustand';
import { Barber } from '~/shared/types';

type BarberStoreParams = {
   barbers: Barber[];
   loading: boolean;
   setLoading: (loading: boolean) => void;
   setBarbers: (barbers: Barber[]) => void;
   getBarberById: (id: string) => Barber;
};

export const useBarbersStore = create<BarberStoreParams>((set, get) => ({
   barbers: [],
   loading: false,
   setLoading: (loading) => set({ loading }),
   setBarbers: (barbers) => set({ barbers }),
   getBarberById: (id) => get().barbers.find((barber) => barber.id === id)!,
}));
