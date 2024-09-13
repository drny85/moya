/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import { format } from 'date-fns';
//import {onRequest} from "firebase-functions/v2/https";
import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import { onCall } from 'firebase-functions/v2/https';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { Appointment, AppUser, Barber, Response } from '@shared/types';
import { getFirestore } from 'firebase-admin/firestore';
import { sendPushNotification } from './common';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

getApps().length === 0 ? initializeApp() : getApp();
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.notifyOnAppointmentCreation = onDocumentCreated(
   '/appointments/{appointmentId}',
   async (event) => {
      logger.info(`New document with ID ${event.id} was created.`);
      try {
         const data = event.data?.data() as Appointment;
         const barberDoc = getFirestore().collection('users').doc(data.barber.id);
         const barberData = (await barberDoc.get()).data() as Barber;
         const appointmentDate = format(data.date, 'E, PPP');
         if (!barberData.pushToken) return;
         logger.log('Notification Sent!');
         return await sendPushNotification(
            event.params.appointmentId,
            'new-appointment',
            barberData.pushToken,
            'New Appointment',
            `${data.customer.name} has scheduled an appointment with you for ${appointmentDate} at ${data.startTime}.`
         );
      } catch (error) {
         logger.error(error);
      }
   }
);

exports.onAppointmentUpdates = onDocumentUpdated('/appointments/{appointmentId}', async (event) => {
   logger.info(`New document with ID ${event.id} was created.`);
   try {
      const data = event.data?.after.data() as Appointment;
      const dataBefore = event.data?.before.data() as Appointment;
      const isBarber = data.changesMadeBy === 'barber';
      const appointmentDate = format(data.date, 'E, PPP');
      const prevDate = dataBefore && format(dataBefore.date, 'E, PPP');
      if (isBarber) {
         const customerDoc = getFirestore().collection('users').doc(data.customer.id!);
         const customerData = (await customerDoc.get()).data() as AppUser;
         if (!customerData.pushToken) return;

         if (data.status === 'confirmed') {
            await sendPushNotification(
               event.params.appointmentId,
               'appointment-updates',
               customerData.pushToken,
               'Appointment Update',
               `${data.barber.name} has confirmed your appointment for ${appointmentDate} at ${data.startTime}.`
            );
         }
         if (data.status === 'cancelled') {
            await sendPushNotification(
               event.params.appointmentId,
               'appointment-updates',
               customerData.pushToken,
               'Appointment Update',
               `${data.barber.name} has cancelled your appointment for ${appointmentDate}.`
            );
         }
      } else if (data.changesMadeBy === 'customer') {
         const barberDoc = getFirestore().collection('users').doc(data.barber.id);
         const barberData = (await barberDoc.get()).data() as AppUser;
         if (!barberData.pushToken) return;
         if (data.status === 'cancelled') {
            await sendPushNotification(
               event.params.appointmentId,
               'appointment-updates',
               barberData.pushToken,
               'Appointment Update',
               `${data.customer.name} has cancelled the appointment for ${appointmentDate} at ${data.startTime}.`
            );
         }

         if (
            data.status === 'pending' &&
            dataBefore
            //dataBefore.service.name !== data.service.name
         ) {
            await sendPushNotification(
               event.params.appointmentId,
               'appointment-updates',
               barberData.pushToken,
               'Appointment Update',
               `${data.customer.name} has changed the service.`
            );
         }
         if (
            (data.status === 'pending' && data.date !== dataBefore.date) ||
            (data.status === 'pending' && data.startTime !== dataBefore.startTime)
         ) {
            await sendPushNotification(
               event.params.appointmentId,
               'appointment-updates',
               barberData.pushToken,
               'Appointment Update',
               `${data.customer.name} has rescheduled the appointment from ${prevDate} at ${dataBefore.startTime} to ${appointmentDate} at ${data.startTime}.`
            );
         }
      }
   } catch (error) {
      logger.error(error);
   }
});

exports.deleteUser = onCall({ secrets: [] }, async ({ auth }): Promise<Response> => {
   if (!auth) return { result: 'No authorized', success: false };
   try {
      await getFirestore().collection('users').doc(auth.uid).delete();

      await getAuth().deleteUser(auth.uid);
      logger.log('User deleted');
      return { result: 'User deleted', success: true };
   } catch (error) {
      console.log(error);
      const err = error as any;
      logger.error(err.message);

      return { result: err.message, success: false };
   }
});

exports.sendAppointmentReminder = functions.pubsub
   .schedule('*/5 * * * *')
   .onRun(async (context) => {
      try {
         logger.log('Reminder started', format(context.timestamp, 'PPpp'));
         checkIfThereIsAnUpcomingAppointmentWithTheNextHour();
      } catch (error) {
         logger.error(error);
      }
   });

const checkIfThereIsAnUpcomingAppointmentWithTheNextHour = () => {
   const now = new Date();
   const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

   logger.log('Next hour', format(nextHour, 'PPpp'));
   const appointments = getFirestore()
      .collection('appointments')
      .where('reminderSent', '==', false)
      .where('date', '>=', nextHour)
      .where('date', '<', nextHour);

   appointments
      .get()
      .then((querySnapshot) => {
         querySnapshot.forEach((doc) => {
            const appointment = doc.data() as Appointment;

            if (appointment.status === 'confirmed') {
               const usersDoc = getFirestore().collection('users').doc(appointment.customer.id!);
               usersDoc.get().then(async (userSnapshot) => {
                  const user = userSnapshot.data() as AppUser;
                  if (user.pushToken) {
                     await sendPushNotification(
                        doc.id,
                        'reminder',
                        user.pushToken,
                        'Upcoming Appointment',
                        `You have an upcoming appointment with ${appointment.barber.name.split(' ')[0]} at ${appointment.startTime}.`
                     );
                     doc.ref.update({ reminderSent: true });
                     logger.log('Reminder sent');
                  }
               });
            }
         });
      })
      .catch((error) => {
         logger.error(error);
      });
};
