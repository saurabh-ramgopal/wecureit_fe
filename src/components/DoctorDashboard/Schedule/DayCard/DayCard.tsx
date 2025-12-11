import React from 'react';
// import AppointmentCard from './AppointmentCard';
import styles from './DayCard.module.scss';
import {ScheduleDayUI} from "../../../../types/doctor"
import { Clock ,MapPin} from 'lucide-react';
interface DayCardProps {
  schedule: ScheduleDayUI; // now expects your UI-friendly schedule object
}

const DayCard = ({ schedule }: DayCardProps) => {
  return (
     <div className={styles['day-card']}>
      <div className={styles['day-card__header']}>
        <h3 className={styles['day-card__short-date']}>{schedule.shortDate}</h3>
        <p className={styles['day-card__full-date']}>{schedule.fullDate}</p>
        </div>
        <div className={styles['day-card__details']}>
              <p className={styles['day-card__location']}>
                <MapPin size={16} style={{ marginRight: '0.5rem', color:'var(--primary)' }} />
                {schedule.location}
              </p>
              <p className={styles['day-card__total-hours']}>
                <Clock size={16} style={{ marginRight: '0.5rem' }} />
                 {/* <span style={{ marginRight: '0.5rem' }}>Schedule:</span> */}
                  <span style={{ 
                   backgroundColor: 'var(--light, #bcf4f9)', 
                     color: 'var(--text-secondary)', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        fontWeight: '500'
                      }}>{schedule.totalHours}</span>     
              </p>
            </div>
      <div className={styles['day-card__appointments']}>
        {schedule.appointments.map((appt) => (
          <div key={appt.id} className={styles['appointment-card']}>
            <div className={styles['appointment-header']}>
              <p className={styles['appointment-name']}>{appt.patientName}</p>
              <span className={styles['appointment-duration']}>{appt.duration}</span>
            </div>
            <p className={styles['appointment-time']}>{appt.time}</p>
     
          </div>
        ))}
      </div>
      </div>
  );
};

export default DayCard;
