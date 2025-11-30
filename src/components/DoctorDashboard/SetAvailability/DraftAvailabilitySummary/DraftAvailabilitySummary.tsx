"use client";

import { calculateDiffHours } from "@/utils/utils";
import styles from "./DraftAvailabilitySummary.module.scss"
import { FacilityAvailabilityUI } from "@/types/doctor"; 
import { Clock, MapPin } from "lucide-react";

interface DraftAvailabilityProps {
  draftlist: FacilityAvailabilityUI[];       
  onDelete: (index: number) => void; 
  handleSaveAvailabilitySubmit: () => void;
}

export default function DraftAvailability({ draftlist, onDelete, handleSaveAvailabilitySubmit }: DraftAvailabilityProps) {
  // helper to format date nicely

  const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); 
};
  const formatShortDate = (dateStr: string) => {
    const date = parseLocalDate(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

 const formatFullDate = (dateStr: string) => {
  const date = parseLocalDate(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long", // Saturday
    year: "numeric", // 2025
    month: "long",   // November
    day: "numeric",  // 29
  });
};


  return (
    <div>
  <div className={styles['draft-grid']}>
      {draftlist.map((item, index) => (
        <div key={index} className={styles['draft-card']}>
        <div className={styles['draft-dates']}>
          <p className={styles['draft-date']}>{formatShortDate(item.availableDate)}</p>
          <p className={styles['draft-full-date']}>{formatFullDate(item.availableDate)}</p>
        </div>

          {/* Specialities */}
          <div className={styles['draft-specialities']}>
            {item.speciality?.map((s, i) => (
              <span key={i} className={styles['pill']}>{s.specialityName}</span>
            ))}
          </div>

          {/* Facility Name */}
          <p className={styles['draft-facility']}>{item.facilityName}</p>

          {/* Location */}
          {item.facilityStreet && item.stateName && (
            <div className={styles['draft-location']}>
              <MapPin size={16} color="var(--primary)"/>
              <span>{item.facilityStreet}, {item.stateName}</span>
            </div>
          )}

          {/* Time Range */}
          <div className={styles['draft-time']}>
            <Clock size={16} />
            <span>{item.availableStartTime} – {item.availableEndTime}</span>
          </div>

          {/* Duration */}
          <p className={styles['draft-hours']}>
            {calculateDiffHours(item.availableStartTime, item.availableEndTime).toFixed(1)} hours
          </p>

          <button className={styles['delete-btn']} onClick={() => onDelete(index)}>
            Remove
          </button>
          

        </div>
      ))}
      
    </div>
     <div className={styles["submit-button-wrapper"]}>
        <button className={styles["add-availability-button"]} onClick={handleSaveAvailabilitySubmit}  disabled={draftlist.length === 0}>
          Save Availability
        </button>
      </div>
    </div>
);
}
