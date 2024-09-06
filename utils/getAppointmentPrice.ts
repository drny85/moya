import { Service } from '~/shared/types';

export const getAppointmentPrice = (services: Service[]) =>
   services.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
