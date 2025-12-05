"use client";
import React from "react";
import { AllDoctorUI, AllFacilityUI, AllSpecialitiesRespUI } from "@/types/patient";
import styles from "./SelectionSummary.module.scss";
import { useDropdownSelection } from "./DropdownSelectionContext";
import { useRouter } from 'next/navigation';

export default function SelectionSummary(props: {
  selectedDoctor?: AllDoctorUI | null;
  selectedFacility?: AllFacilityUI | null;
  selectedSpecialty?: AllSpecialitiesRespUI | null;
}) {
  const ctx = useDropdownSelection();
  const router = useRouter();
  const selectedDoctor = ctx?.selectedDoctor ?? props.selectedDoctor ?? null;
  const selectedFacility = ctx?.selectedFacility ?? props.selectedFacility ?? null;
  const selectedSpecialty = ctx?.selectedSpecialty ?? props.selectedSpecialty ?? null;
  const doctorName = selectedDoctor?.name || "No doctor selected";
  const facilityName = selectedFacility?.facilityName || "No facility selected";
  const specialtyName = selectedSpecialty?.specialityName || "No specialty selected";

  return (
    <div className={styles.summaryWrapper}>
      <div className={styles.summaryCard}>
        <h3 className={styles.summaryTitle}>Selection Summary</h3>
        <p className={styles.cardSubtext}>Review your choices</p>

        <div className="space-y-4">
          <div className={styles.selectionBox}>
            <div className={styles.detailLabel}>Doctor</div>
            <div className={styles.detailName}>{doctorName}</div>
            {/* doctor meta badges removed per design */}
          </div>

          <div className={styles.selectionBox}>
            <div className={styles.detailLabel}>Facility</div>
            <div className={styles.detailName}>{facilityName}</div>
          </div>

          <div className={styles.selectionBox}>
            <div className={styles.detailLabel}>Specialty</div>
            <div className={styles.detailName}>{specialtyName}</div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          {(() => {
            const doctorId = selectedDoctor?.doctorMasterId ?? null;
            const facilityId = selectedFacility?.facilityID ?? null;
            const specialityId = selectedSpecialty?.specialityMasterId ?? null;
            // require all three selections before enabling continue
            const enabled = doctorId !== null && facilityId !== null && specialityId !== null;

            const handleClick = () => {
              if (!enabled) return;
              const payload = {
                doctorId,
                facilityId,
                specialityId,
                doctorName: selectedDoctor?.name ?? null,
                facilityName: selectedFacility?.facilityName ?? null,
                specialityName: selectedSpecialty?.specialityName ?? null,
              };
              console.log('Booking selection IDs:', payload.doctorId, payload.facilityId, payload.specialityId);
              router.push('/patient/dashboard/appointmentbooking');
            };

            return (
              <button
                className={styles.ctaBtn}
                onClick={handleClick}
                disabled={!enabled}
                aria-disabled={!enabled}
                title={!enabled ? 'Select doctor, facility and specialty to continue' : undefined}
              >
                Continue to Date &amp; Time Selection
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
