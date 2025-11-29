"use client";
import React from "react";

type Props = {
  selectedDoctor: string;
  selectedFacility: string;
  selectedSpecialty: string;
};

import styles from "./SelectionSummary.module.scss";

export default function SelectionSummary({ selectedDoctor, selectedFacility, selectedSpecialty }: Props) {
  // For demo purposes show richer details when a simple string is provided.
  // In a real app these would be objects from API (doctor object, facility object, etc.)
  const doctorName = selectedDoctor || "No doctor selected";
  const facilityName = selectedFacility || "No facility selected";
  const specialtyName = selectedSpecialty || "No specialty selected";

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
          <button className={styles.ctaBtn}>Continue to Date &amp; Time Selection</button>
        </div>
      </div>
    </div>
  );
}
