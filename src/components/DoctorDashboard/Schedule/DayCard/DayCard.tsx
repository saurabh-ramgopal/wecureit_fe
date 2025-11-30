import React from 'react';
// import AppointmentCard from './AppointmentCard';
import styles from './DayCard.module.scss';
import {Day} from "../../../../types/doctor"
import { Clock } from 'lucide-react';
interface DayCardProps {
  day: Day;
}

const DayCard = ({ day }: DayCardProps) => {
    const hasAppointments = day.appointments.length > 0;
  return (
    <div className={styles['day-card']}>
      <div className={styles['day-card__header']}>
        <h3 className={styles['day-card__short-date']}>{day.shortDate}</h3>
        <p className={styles['day-card__full-date']}>{day.fullDate}</p>
     {hasAppointments && (
    <div className={styles['day-card__details']}>
      <p className={styles['day-card__location']}>{day.location}</p>
      <p className={styles['day-card__total-hours']}>{day.totalHours} total</p>
    </div>
  )}
      </div> 

      {hasAppointments ? (
        
        <div className={styles['day-card__appointments']}>
          {day.appointments.map((appt) => (
            <div key={appt.id} className={styles['appointment-card']}>
              <p className={styles['appointment-name']}>{appt.patientName}</p>
              <p className={styles['appointment-time']}>{appt.time}</p>
              <p className={styles['appointment-duration']}>{appt.duration}</p>
              {appt.reason && <p className={styles['appointment-reason']}>{appt.reason}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles['day-card__no-appointments-center']}>
          <Clock size={40} className={styles['day-card__clock-icon']} />
          <p>No appointments</p>
        </div>
      )}
    </div>

  );
};

export default DayCard;
