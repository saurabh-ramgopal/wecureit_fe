import React from 'react';
import AvailabilityDayCard from '../AvailabilityDayCard/AvailabilityDayCard';
import './SelectDayCards.scss';

interface Day {
  dayName: string;   // "Wed"
  dateNumber: string; // "17"
  month: string;      // "Nov"
}

const generateCurrentWeek = (): Day[] => {
  const today = new Date();
  const days: Day[] = [];

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const dateNumber = date.getDate().toString();
    days.push({ dayName, month, dateNumber });
  }

  return days;
};

const SelectDayCards: React.FC = () => {
  const weekDays = generateCurrentWeek();

  return (
  <div className="setavailability-grid">
      {weekDays.map((day, i) => (
        <AvailabilityDayCard key={i} day={day} />
      ))}
    </div>
  );
};

export default SelectDayCards;
