import React, { useState , useEffect} from 'react';
import AvailabilityDayCard from '../AvailabilityDayCard/AvailabilityDayCard';
import styles from './SelectDayCards.module.scss';

interface Day {
  dayName: string;   // "Wed"
  dateNumber: string; // "17"
  month: string;      // "Nov"
  formattedDate: string; // "Wed, Nov 17"
  isoDate: string;
  
}
type SelectDayCardsProps = {
  onDateSelect: (date: string) => void;
};
const generateCurrentWeek = (): Day[] => {
  const today = new Date();
  const days: Day[] = [];

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i+ 1);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const dateNumber = date.getDate().toString();
    const formattedDate = `${dayName}, ${month} ${dateNumber}`;
    const isoDate = date.toISOString().split("T")[0];

    days.push({ dayName, month, dateNumber, formattedDate, isoDate });
  }

  return days;
};

const SelectDayCards = ({onDateSelect} : SelectDayCardsProps) => {
    const weekDays = generateCurrentWeek();
    const [selectedDate, setSelectedDate] = useState<string>("");
    const handleDateSelect = (isoDate: string) => {
     setSelectedDate(isoDate);
     onDateSelect(isoDate); 
  };

  return (
  <div className={styles['setavailability-grid']}>
      {weekDays.map((day, i) => (
        <AvailabilityDayCard key={i} day={day} onDateSelect={() => handleDateSelect(day.isoDate)} selected={selectedDate === day.isoDate} />
      ))}
    </div>
  );
};

export default SelectDayCards;
