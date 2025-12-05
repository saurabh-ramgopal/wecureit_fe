"use client";
import React, { useEffect, useState } from 'react'
import { useDropdownSelection } from '@/components/PatientDashboard/DropdownSelection/DropdownSelectionContext';
import styles from "./page.module.scss"
import { useRouter } from "next/navigation";
import { MapPin, Stethoscope } from 'lucide-react';
import {fetchDates, fetchTimeSlots} from "@/lib/api"
import {formatTime} from "@/utils/utils"
import { FetchDatesResponse, fetchL1Request, FetchTimeSlotResponse } from '@/types/patient';
import { DateSelectionCardComponent } from '@/components/PatientDashboard/AppointmentBooking/DateSelectionCardComponent/DateSelectionCardComponent';
type Props = {}

type BookingSelection = {
  doctorId: number | string | null;
  facilityId: string | null;
  specialityId: string | null;
  doctorName?: string | null;
  facilityName?: string | null;
  specialityName?: string | null;
};

export default function SelectDateTimePage (props: Props) {
  const ctx = useDropdownSelection();
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  const [availableDates, setAvailableDates] = useState<FetchDatesResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots]= useState<FetchTimeSlotResponse[]>([]);
  // Use context getters/setters for booking summary
  const selectedDate = ctx?.selectedDate ?? null;
  const setSelectedDate = ctx?.setSelectedDate ?? (() => {});
  const selectedDuration = ctx?.selectedDuration ?? null;
  const setSelectedDuration = ctx?.setSelectedDuration ?? (() => {});
  const selectedAvailabilityId = ctx?.selectedAvailabilityId ?? null;
  const setSelectedAvailabilityId = ctx?.setSelectedAvailabilityId ?? (() => {});
  const selectedTimeSlot = ctx?.selectedTimeSlot ?? null;
  const setSelectedTimeSlot = ctx?.setSelectedTimeSlot ?? (() => {});
  const router = useRouter();
  useEffect(() => {
    const sel = {
      doctorId: ctx?.selectedDoctor?.doctorMasterId ?? null,
      facilityId: ctx?.selectedFacility?.facilityID ?? null,
      specialityId: ctx?.selectedSpecialty?.specialityMasterId ?? null,
      doctorName: ctx?.selectedDoctor?.name ?? null,
      facilityName: ctx?.selectedFacility?.facilityName ?? null,
      specialityName: ctx?.selectedSpecialty?.specialityName ?? null,
    };
    setSelection(sel);
    
    console.log('Appointment booking - IDs (from context):', sel.doctorId, sel.facilityId, sel.specialityId);
        if (!sel.doctorId || !sel.facilityId || !sel.specialityId) {
          console.log('Missing required selections, redirecting to dropdown selection...');
          router.push('/patient/dashboard/dropdownselection');
      }
      else{
           handleFetchDates(sel);
      }
  }, [ctx?.selectedDoctor, ctx?.selectedFacility, ctx?.selectedSpecialty]);
  
  const handleFetchDates = async (sel: BookingSelection) => {
  if (!sel.doctorId || !sel.facilityId || !sel.specialityId) {
    console.error('Missing required selection data');
    return;
  }
  setLoading(true);
  try {
    const requestBody: fetchL1Request = {
      doctorMasterId: Number(sel.doctorId),
      facilityMasterId: sel.facilityId,
      specialityMasterId: sel.specialityId,
    };
    
    console.log('Fetching dates with request:', requestBody);
    const response: FetchDatesResponse[] = await fetchDates(requestBody);
    
    console.log('Available dates response:', response);
    setAvailableDates(response);
    
  } catch (error) {
    console.error('Error fetching dates:', error);
  } finally {
    setLoading(false);
  }
};
 const handleFetchTimeSlots = async (dfAvailabilityId: string, duration: number) => {
    setLoadingTimeSlots(true);
    try {
      const requestBody = {
        dfAvailabilityId,
        duration,
      };
      
      console.log('Fetching time slots with request:', requestBody);
      const response: FetchTimeSlotResponse[]= await fetchTimeSlots(requestBody);
      setAvailableTimeSlots(response);
      console.log('Time slots response:', response);
      // Time slots are displayed in DateSelectionCardComponent via the component's internal state
      
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoadingTimeSlots(false);
    }
  };
  return (
     <div className={`${styles.pageWrapper} theme-patient`}>
      <div className={styles.pageInner}>
        <div className="mb-6">
         <button
                onClick={() => router.back()}
                className={styles.backLink}
              >  ← Back to Selection</button>
        </div>

          <div className={styles.titleBlock}>
          <h1 className={styles.pageTitle}>Select Date & Time</h1>
          <p className={styles.pageSubtitle}>
          Choose your preferred appointment date and time
          </p>
        </div>
            <div className={styles.selectionDisplay}>
              <div className={styles.selectionItem}>
                  <Stethoscope className={styles.selectionIcon} />
                <span className={styles.selectionLabel}>Doctor:</span>
                <span className={styles.selectionValue}>{selection?.doctorName ?? selection?.doctorId ?? 'Not selected'}</span>
              </div>
              
              <div className={styles.selectionItem}>
                 <MapPin className={styles.selectionIcon} />
                <span className={styles.selectionLabel}>Facility:</span>
                <span className={styles.selectionValue}>{selection?.facilityName ?? selection?.facilityId ?? 'Not selected'}</span>
              </div>
              
              <div className={styles.selectionItem}>
                <span className={styles.selectionBadge}>{selection?.specialityName ?? selection?.specialityId ?? 'Not selected'}</span>
              </div>
            </div>
            <div className={styles.contentGrid}>
              <div className={styles.dateSelectionSection}>
                 {loading ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Loading available dates...</p>
                  </div>
                ) : (
                      <DateSelectionCardComponent
                        setSelectedDate={setSelectedDate}
                        selectedDate={selectedDate}
                        availableDatesList={availableDates}
                        onFetchTimeSlots={handleFetchTimeSlots}
                        timeSlots={availableTimeSlots}
                        loadingTimeSlots={loadingTimeSlots}
                        selectedDuration={selectedDuration}
                        setSelectedDuration={setSelectedDuration}
                        setSelectedAvailabilityId={(id: string | null) => setSelectedAvailabilityId(id)}
                        selectedAvailabilityId={selectedAvailabilityId ?? ''}
                        setSelectedTimeSlot ={setSelectedTimeSlot}
                        selectedTimeSlot= {selectedTimeSlot}
                      />
                      )}
                  </div>
              <div className={styles.appointmentSummarySection}>
                <div className={styles.summaryCard}>
                  <h3 className={styles.summaryTitle}>Appointment Summary</h3>
                  <div className={styles.summaryContent}>
                    <p>Doctor: {selection?.doctorName}</p>
                    <p>Facility: {selection?.facilityName}</p>
                    <p>Specialty: {selection?.specialityName}</p>
                    {selectedDate && <p>Date: {selectedDate}</p>}
                    {selectedTimeSlot && <p>Time: {formatTime(selectedTimeSlot.start)} - {formatTime(selectedTimeSlot.end)}</p>}
                     <p>
                        Duration: <em>{selectedDuration} minutes</em>
                      </p>
                       {selection?.doctorName &&
                        selection?.facilityName &&
                        selection?.specialityName &&
                        selectedDate &&
                        selectedTimeSlot &&
                        selectedDuration && (
                          <button
                            className={styles.bookButton}
                             onClick={() => router.push('/patient/dashboard/appointmentconfirmation')}
                          >
                            Continue to Confirmation
                          </button>
                        )}
                  </div>
                </div>
              </div>
            </div>
            
      </div>
    </div>
  )
}
