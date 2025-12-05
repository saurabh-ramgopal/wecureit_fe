import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import styles from './DateSelectionCardComponent.module.scss';
import {FetchDatesResponse, FetchTimeSlotResponse} from "@/types/patient"
import {formatPlainDate, formatTime} from "@/utils/utils"
interface DateSelectionCardProps {
   setSelectedDate: (date: string | null) => void;
   selectedDate?: string | null;
   availableDatesList: FetchDatesResponse[];
   onFetchTimeSlots: (dateId: string, duration: number) => Promise<void>;
   timeSlots?: any[];
   loadingTimeSlots?: boolean;
   selectedDuration: number | null;
   setSelectedDuration: (duration: number | null) => void;
   setSelectedAvailabilityId: (availabilityId: string | null) => void;
   selectedAvailabilityId: string;
   setSelectedTimeSlot: (timeSlot: FetchTimeSlotResponse | null) => void;
   selectedTimeSlot?: FetchTimeSlotResponse | null
                        
}

export const DateSelectionCardComponent =({setSelectedDate, selectedDate,  availableDatesList, onFetchTimeSlots,selectedDuration,
  setSelectedDuration,
  setSelectedAvailabilityId,
  selectedAvailabilityId,
  setSelectedTimeSlot,
  selectedTimeSlot,
  timeSlots = [],
  loadingTimeSlots = false}: DateSelectionCardProps) => {

  const durations = [15, 30, 60]; // Duration options in minutes

  const handleDateClick = (dateItem: FetchDatesResponse) => {
    setSelectedDate(dateItem.availableDate);
    setSelectedAvailabilityId(dateItem.dfAvailabilityId);
    setSelectedDuration(null); 
  };

  const handleDurationClick = async (duration: number) => {
    setSelectedDuration(duration);
    if (selectedDate) {
      await onFetchTimeSlots(selectedAvailabilityId, duration);
    }
  };

  const handleTimeSlotClick = async (timeSlot: FetchTimeSlotResponse) =>{
    setSelectedTimeSlot(timeSlot);
    console.log("Selected time slot", timeSlot);
  }
  return (
  <div className={styles.dateCard}>
    <div className={styles.dateCardHeader}>
      <Calendar className={styles.headerIcon} />
      <h2 className={styles.dateCardTitle}>Select Date</h2>
    </div>
    
    {availableDatesList.length === 0 ? (
      <p className={styles.dateCardDescription}>
        No available dates found for this selection. Please change your doctor, facility, or specialty selection.
      </p>
    ) : (
      <>
        <p className={styles.dateCardDescription}>
          Select your preferred appointment date from the available options
        </p>

        <div className={styles.datesGrid}>
           {availableDatesList.map((dateItem) => {
              const { shortDate } = formatPlainDate(dateItem.availableDate);
              return (
                <div
                  key={dateItem.dfAvailabilityId}
                  className={`${styles.dateItem} ${selectedDate === dateItem.availableDate ? styles.selected : ''}`}
                  onClick={() => handleDateClick(dateItem)}
                >
                  <div className={styles.dateContent}>
                    {shortDate}
                  </div>
                </div>
              );
            })}
        </div>
      </>
    )}
      {selectedDate && (
        <>
          <div className={styles.divider} />
          
          <div className={styles.durationSection}>
            <div className={styles.dateCardHeader}>
              <Clock className={styles.headerIcon} />
              <h2 className={styles.dateCardTitle}>Select Appointment Duration</h2>
            </div>
            
            <p className={styles.dateCardDescription}>
              Choose your preferred appointment duration
            </p>

            <div className={styles.durationsGrid}>
              {durations.map((duration) => (
                <div
                  key={duration}
                  className={`${styles.durationItem} ${selectedDuration === duration ? styles.selected : ''}`}
                  onClick={() => handleDurationClick(duration)}
                >
                  <div className={styles.durationContent}>
                    {duration} min
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {selectedDuration && (
        <>
          <div className={styles.divider} />
          
          <div className={styles.timeSlotsSection}>
            <h3 className={styles.sectionTitle}>Available Time Slots</h3>
            
            {loadingTimeSlots ? (
              <p className={styles.loadingText}>Loading time slots...</p>
            ) : timeSlots.length === 0 ? (
              <p className={styles.noSlotsText}>No available time slots for this duration</p>
            ) : (
              <div className={styles.timeSlotsGrid}>
                  {timeSlots.map((slot, index) => {
                  

                  // slot is always { start, end }
                  const start = slot.start;
                  const end = slot.end;
                  const label = `${formatTime(start)} - ${formatTime(end)}`;
                  const key = `${start}-${end}-${index}`;
                  const isSelected =
                    selectedTimeSlot &&
                    selectedTimeSlot.start === start &&
                    selectedTimeSlot.end === end;
                  return (
                    <div key={key} className={`${styles.timeSlotItem} ${isSelected ? styles.timeSlotSelected : ''}`}
                     onClick={() => handleTimeSlotClick(slot)}>
                      {label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
  </div>
);
};