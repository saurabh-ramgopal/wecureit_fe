import React, { useState } from "react";
import styles from "./AppointmentHistoryCard.module.scss";
import {DoctorPastAppointmentsUI} from '@/types/doctor';
import { User, Calendar, Clock, FileText } from "lucide-react";
import NotePopup from "../NotePopup/NotePopup";
import { on } from "events";
interface AppointmentHistoryCardProps {
  appointmentHistory: DoctorPastAppointmentsUI;
  onSaveNotes: (id: string, notes: string) => void;
}

const AppointmentHistoryCard = ({ appointmentHistory, onSaveNotes }: AppointmentHistoryCardProps) => {
   const [isPopupOpen, setIsPopupOpen] = useState(false);
   
  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);


  return (
    <div className={styles['appointmentHistory-card']}>
      <div className={styles['appointmentHistory-card__header']}>
           <div className={styles['appointmentHistory-card__name-container']}>
            <User className={styles['appointmentHistory-card__icon']} size={15} />
            <h4 >{appointmentHistory.patientName}</h4>
          </div>
        {/* <span className={`appointmentHistory-card__status ${appointmentHistory.status.toLowerCase()}`}>
          {appointmentHistory.status}
        </span> */}
      </div>

      <div className={styles['appointmentHistory-card__details']}>
        <p className={styles['appointmentHistory-card__age-gender']}>
          {appointmentHistory.age && appointmentHistory.gender && `${appointmentHistory.age} years • ${appointmentHistory.gender}`}
        </p>
        <div className={styles['appointmentHistory-card__datetime']}>
         <div className={styles['appointmentHistory-card__linedate']}>
              <Calendar className={styles['appointmentHistory-card__icon']} size={15} />
              <span>{appointmentHistory.date}</span>
            </div>
            <div className={styles['appointmentHistory-card__lineduration']}>
               <div className={styles['appointmentHistory-card__time']}>
              <Clock className={styles['appointmentHistory-card__icon']} size={15} />
              <span>{appointmentHistory.time}</span>
              </div>
                <span className={styles['appointmentHistory-card__duration']}>
                  {appointmentHistory.duration}
                </span>
            </div>
        </div>
       <div className={styles['appointmentHistory-card__complaint']}>
          <p className={styles['complaint-label']}>Chief Complaint:</p>
          <p className={styles['complaint-text']}>{appointmentHistory.complaint}</p>
        </div>
        <p className={styles['appointmentHistory-card__location']}>📍 {appointmentHistory.location}</p>
      </div>
      <button className={styles['appointmentHistory-card__addnote-btn']}
       onClick={handleOpenPopup} >
        <FileText className={styles['appointmentHistory-card__icon']} size={16} />
        Add Note
      </button>
      <NotePopup
        patientDetails={appointmentHistory}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSave={onSaveNotes}
      />
    </div>
  );
};

export default AppointmentHistoryCard;
