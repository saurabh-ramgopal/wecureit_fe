import React from 'react';
import './AvailabilityDayCard.scss';

interface Day {
  dayName: string;
  dateNumber: string;
  month: string;
}

interface SetAvailabilityDayCardProps {
  day: Day;
}

const AvailabilityDayCard: React.FC<SetAvailabilityDayCardProps> = ({ day }) => {
  return (
    <div className="setavailability-day-card">
      <div className="setavailability-day-card__header">
        <h4>{day.dayName}</h4>
        <p className="setavailability-day-card__date">
          <span className="date-number">{day.dateNumber}</span>
          <span className="month">{day.month}</span>
        </p>
      </div>
    </div>
  );
};

export default AvailabilityDayCard;
