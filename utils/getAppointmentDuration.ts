import { Service } from '~/shared/types';

export const getAppointmentDuration = (services: Service[]) =>
   services.reduce((acc, curr) => acc + curr.duration * curr.quantity, 0);
