import React from 'react'
import styles from './BookingSummary.module.scss'
import type { AllDoctorUI, AllFacilityUI, AllSpecialitiesRespUI, FetchTimeSlotResponse } from '@/types/patient';

type BookingSummaryProps = {
  selectedDoctor: AllDoctorUI | null;
  selectedFacility: AllFacilityUI | null;
  selectedSpecialty: AllSpecialitiesRespUI | null;
  selectedDate: string | null;
  selectedDuration: number | null;
  selectedTimeSlot: FetchTimeSlotResponse | null;
    handleConfirmBooking: () => void;
};
export const BookingSummary=({  selectedDoctor,
  selectedFacility,
  selectedSpecialty,
  selectedDate,
  selectedDuration,
  selectedTimeSlot,

  handleConfirmBooking}: BookingSummaryProps)=> {
  return (
    <div className={styles.confirmWrap}>
  <div className={styles.contentRow}>
    <div className={styles.leftCol}>
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Appointment Details</h3>
        <p className={styles.cardNote}>Please review your appointment information</p>

        <div className={styles.detailBox}>
          <div className={styles.detailLabel}>Doctor</div>
          <div className={styles.detailValue}>
              <strong>{selectedDoctor?.name || 'Not selected'}</strong>
          </div>
        </div>

        <div className={styles.detailBox}>
          <div className={styles.detailLabel}>Facility</div>
          <div className={styles.detailValue}>
            <strong>{selectedFacility?.facilityName || 'Not selected'}</strong>
            <div className={styles.address}>  {selectedFacility?.street}, {selectedFacility?.state}</div>
          </div>
        </div>

        <div className={styles.rowTwoUp}>
          <div className={styles.smallBox}>
            <div className={styles.detailLabel}>Date</div>
            <div className={styles.smallValue}>{selectedDate || 'Not selected'}</div>
          </div>
          <div className={styles.smallBox}>
            <div className={styles.detailLabel}>Time</div>
            <div className={styles.smallValue}>
                {selectedTimeSlot
                ? `${selectedTimeSlot.start} - ${selectedTimeSlot.end}`
                : 'Not selected'}
              <br />
              <span className={styles.muted}>{selectedDuration ?? '0'} minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Book Appointment button placed below the card */}
        <button
          className={styles.bookBtn}
          onClick={handleConfirmBooking}
          disabled={
            !selectedDoctor ||
            !selectedFacility ||
            !selectedSpecialty ||
            !selectedDate ||
            !selectedDuration ||
            !selectedTimeSlot
          }
        >
          Book Appointment
        </button>
    </div>
  </div>
</div>

  )
}


