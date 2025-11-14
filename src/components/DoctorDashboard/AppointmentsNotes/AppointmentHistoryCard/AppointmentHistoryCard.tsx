import React from "react";
import "./AppointmentHistoryCard.scss";
import {AppointmentHistory} from '../../../../types/schedule';
import { User, Calendar, Clock, FileText } from "lucide-react";

interface AppointmentHistoryCardProps {
  appointmentHistory: AppointmentHistory;
}

const AppointmentHistoryCard: React.FC<AppointmentHistoryCardProps> = ({ appointmentHistory }) => {
  return (
    <div className="appointmentHistory-card">
      <div className="appointmentHistory-card__header">
           <div className="appointmentHistory-card__name-container">
            <User className="appointmentHistory-card__icon" size={15} />
            <h4 >{appointmentHistory.patientName}</h4>
          </div>
        <span className={`appointmentHistory-card__status ${appointmentHistory.status.toLowerCase()}`}>
          {appointmentHistory.status}
        </span>
      </div>

      <div className="appointmentHistory-card__details">
        <p className="appointmentHistory-card__age-gender">
          {appointmentHistory.age && appointmentHistory.gender && `${appointmentHistory.age} years • ${appointmentHistory.gender}`}
        </p>
        <div className="appointmentHistory-card__datetime">
         <div className="appointmentHistory-card__linedate">
              <Calendar className="appointmentHistory-card__icon" size={15} />
              <span>{appointmentHistory.date}</span>
            </div>
            <div className="appointmentHistory-card__lineduration">
               <div className="appointmentHistory-card__time">
              <Clock className="appointmentHistory-card__icon" size={15} />
              <span>{appointmentHistory.time}</span>
              </div>
                <span className="appointmentHistory-card__duration">
                  {appointmentHistory.duration}
                </span>
            </div>
        </div>
       <div className="appointmentHistory-card__complaint">
          <p className="complaint-label">Chief Complaint:</p>
          <p className="complaint-text">{appointmentHistory.complaint}</p>
        </div>
        <p className="appointmentHistory-card__location">📍 {appointmentHistory.location}</p>
      </div>
      <button className="appointmentHistory-card__addnote-btn">
        <FileText className="appointmentHistory-card__icon" size={16} />
        Add Note
      </button>
    </div>
  );
};

export default AppointmentHistoryCard;
