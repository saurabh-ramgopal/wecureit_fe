import React, { useState } from 'react'
import styles from './SavedAvailabilitySummary.module.scss';
import { FacilityAvailabilityUIEditable } from '@/types/doctor';
import { Clock, MapPin, Pencil, Trash2 } from 'lucide-react';
import { calculateDiffHours } from '@/utils/utils';
import TimePickerPopup from "../TimePickerPopup/TimePickerPopup"
type SavedAvailabilitySummaryProps = {
    savedlist: FacilityAvailabilityUIEditable[];  
    onEditAvailability: (startTime: string, endTime: string, availabilityId: string) => void;
    onDeleteAvailability: (availabilityId: string, isActive: boolean) => void;
}

const SavedAvailabilitySummary = ({ savedlist, onEditAvailability , onDeleteAvailability}: SavedAvailabilitySummaryProps) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isTimePopupOpen, setIsTimePopupOpen] = useState(false);
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
       {savedlist && savedlist.length > 0 ? (
     <div className={styles['saved-grid']}>
      {savedlist.map((item, index) => (
        <div key={index} className={styles['saved-card']}>
        <div className={styles['saved-dates']}>
          <p className={styles['saved-date']}>{formatShortDate(item.availableDate)}</p>
          <p className={styles['saved-full-date']}>{formatFullDate(item.availableDate)}</p>
        </div>

          {/* Specialities */}
          <div className={styles['saved-specialities']}>
            {item.speciality?.map((s, i) => (
              <span key={i} className={styles['pill']}>{s.specialityName}</span>
            ))}
          </div>

          {/* Facility Name */}
          <p className={styles['saved-facility']}>{item.facilityName}</p>

          {/* Location */}
          {item.facilityStreet && item.stateName && (
            <div className={styles['saved-location']}>
              <MapPin size={16} color="var(--primary)"/>
              <span>{item.facilityStreet}, {item.stateName}</span>
            </div>
          )}

          {/* Time Range */}
          <div className={styles['saved-time']}>
            <Clock size={16} />
            <span>{item.availableStartTime} – {item.availableEndTime}</span>
          </div>

          {/* Duration */}
          <p className={styles['saved-hours']}>
            {calculateDiffHours(item.availableStartTime, item.availableEndTime).toFixed(1)} hours
          </p>
          <div className={styles['saved-actions']}>
                  <button 
                    className={styles['icon-btn']} 
                    disabled={!item.editable}
                      onClick={() => {
                    if (item.editable) {
                      setEditingItemId(item.dfAvailabilityId); 
                      setIsTimePopupOpen(true);
                    }
                  }}
                  >
                    <Pencil size={18}/>
                  </button>
                  <button 
                    className={`${styles['icon-btn']} ${styles['icon-btn-delete']}`} 
                    disabled={!item.editable}
                    onClick={() => item.editable && onDeleteAvailability(item.dfAvailabilityId, item.editable)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
        </div>
      ))}
    </div>
     ) : (
    <p>No saved availability.</p>
     )}
     {isTimePopupOpen && editingItemId !== null && (
     <TimePickerPopup editingItemId={editingItemId} setIsTimePopupOpen={setIsTimePopupOpen}isTimePopupOpen={isTimePopupOpen} handleEditSubmit = {onEditAvailability}/>
     )}
    </div>
);
}


export default SavedAvailabilitySummary;