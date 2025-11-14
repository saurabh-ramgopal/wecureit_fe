import React from 'react';
// import AppointmentCard from './AppointmentCard';
import './DayCard.scss';
import {Day} from "../../../../types/schedule"
import { Clock } from 'lucide-react';
interface DayCardProps {
  day: Day;
}

const DayCard: React.FC<DayCardProps> = ({ day }) => {
    const hasAppointments = day.appointments.length > 0;
  return (
    <div className="day-card">
      <div className="day-card__header">
        <h3 className="day-card__short-date">{day.shortDate}</h3>
        <p className="day-card__full-date">{day.fullDate}</p>
     {hasAppointments && (
    <div className="day-card__details">
      <p className="day-card__location">{day.location}</p>
      <p className="day-card__total-hours">{day.totalHours} total</p>
    </div>
  )}
      </div> 

      {hasAppointments ? (
        
        <div className="day-card__appointments">
          {day.appointments.map((appt) => (
            <div key={appt.id} className="appointment-card">
              <p className="appointment-name">{appt.patientName}</p>
              <p className="appointment-time">{appt.time}</p>
              <p className="appointment-duration">{appt.duration}</p>
              {appt.reason && <p className="appointment-reason">{appt.reason}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="day-card__no-appointments-center">
          <Clock size={40} className="day-card__clock-icon" />
          <p>No appointments</p>
        </div>
      )}
    </div>

  );
};

export default DayCard;
