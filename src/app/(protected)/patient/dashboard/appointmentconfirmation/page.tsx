"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropdownSelection } from '@/components/PatientDashboard/DropdownSelection/DropdownSelectionContext';
import styles from './page.module.scss';
import{BookAppointmentRequest} from "@/types/patient"
import { useRoleAuth } from "@/hooks/useRoleAuth";
import toast from 'react-hot-toast';
import {BookingSummary} from "@/components/PatientDashboard/BookingSummary/BookingSummary"
import {bookAppointment} from "@/lib/api"
export default function AppointmentConfirmationPage() {
  const ctx = useDropdownSelection();
  const router = useRouter();
   const { authorized, loading, userId, role } = useRoleAuth({ allowedRoles: ['patient'] });
  if (!ctx) {
  throw new Error('BookingSummary must be used within a DropdownSelectionProvider');
}
  const  {
    selectedDoctor,
    selectedFacility,
    selectedSpecialty,
    selectedDate,
    selectedDuration,
    selectedTimeSlot,
  } = ctx;
  useEffect(() => {
    // Verify all required fields exist before showing confirmation
    if (
      !ctx?.selectedDoctor ||
      !ctx?.selectedFacility ||
      !ctx?.selectedSpecialty ||
      !ctx?.selectedDate ||
      !ctx?.selectedDuration ||
      !ctx?.selectedTimeSlot
    ) {
      console.warn('Missing required booking data, redirecting to appointment booking');
      router.push('/patient/dashboard/dropdownselection');
    }
  }, [ctx, router]);

  if (
    !ctx?.selectedDoctor ||
    !ctx?.selectedFacility ||
    !ctx?.selectedSpecialty ||
    !ctx?.selectedDate ||
    !ctx?.selectedDuration ||
    !ctx?.selectedTimeSlot
  ) {
    return <div>Loading...</div>;
  }

  const handleConfirmBooking = async () => {
    try {
      console.log('Confirming appointment booking:', {
       doctorMasterId: ctx?.selectedDoctor?.doctorMasterId ?? null,
            facilityMasterId: ctx?.selectedFacility?.facilityID ?? null,
            specialityMasterId: ctx?.selectedSpecialty?.specialityMasterId ?? null,
            date: ctx?.selectedDate ?? null,
            startTime: ctx?.selectedTimeSlot?.start ?? null,
            endTime: ctx?.selectedTimeSlot?.end ?? null,
            duration: ctx?.selectedDuration ?? null,
      });
       const request: BookAppointmentRequest = {
          date: ctx.selectedDate ?? '',
          duration: String(ctx.selectedDuration ?? ''),
          patientMasterId: String(userId ?? ''),
          dfAvailabilityId: ctx.selectedAvailabilityId ?? '',
          startTime: ctx.selectedTimeSlot?.start ?? '',
          endTime: ctx.selectedTimeSlot?.end ?? '',
          specialityMasterId: ctx.selectedSpecialty?.specialityMasterId ?? '',
        };
         const response = await bookAppointment(request);
        toast.success('Booking confirmed successfully!');

      // Redirect to success or booking list page
      router.push('/patient/dashboard');



    } catch (error) {
      console.error('Error confirming appointment:', error);
    }
  };

  if (!ctx) return <div>Loading...</div>;
  return (
    <div className={`${styles.pageWrapper} theme-patient`}>
      <div className={styles.pageInner}>
         <div className="mb-6">
         <button
                onClick={() => router.back()}
                className={styles.backLink}
              >  ← Back to Date & Time</button>
        </div>
          <div className={styles.titleBlock}>
          <h1 className={styles.pageTitle}>Confirm Appointment</h1>
          <p className={styles.pageSubtitle}>
           Review your appointment details and confirm your booking
          </p>
          </div>
          <BookingSummary   selectedDoctor={selectedDoctor}
          selectedFacility={selectedFacility}
          selectedSpecialty={selectedSpecialty}
          selectedDate={selectedDate}
          selectedDuration={selectedDuration}
          selectedTimeSlot={selectedTimeSlot}
          handleConfirmBooking = {handleConfirmBooking}/>
          </div>
          </div>
  );
}
