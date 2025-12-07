import React, { useState , useEffect} from 'react';
import AvailabilityDayCard from '../AvailabilityDayCard/AvailabilityDayCard';
import styles from './SelectDayCards.module.scss';
import { ScheduleDayUI } from '@/types/doctor';

interface Day {
  dayName: string;   
  dateNumber: string; 
  month: string;      
  formattedDate: string; 
  isoDate: string;
  
}
type SelectDayCardsProps = {
  onDateSelect: (date: string) => void;
  pastAppointmentsList: ScheduleDayUI[];
};
const generateTwoWeeks = (): Day[] => {
  const today = new Date();
  const days: Day[] = [];


  const dayOfWeek = today.getDay();
   const thisWeekSunday = new Date(today);
  thisWeekSunday.setDate(today.getDate() - dayOfWeek);
  
  const startDate = new Date(thisWeekSunday);
  startDate.setDate(thisWeekSunday.getDate() + 7);


  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const dateNumber = date.getDate().toString();
    const formattedDate = `${dayName}, ${month} ${dateNumber}`;
    const isoDate = date.toISOString().split("T")[0];

    days.push({ dayName, month, dateNumber, formattedDate, isoDate });
  }

  return days;
};


const SelectDayCards = ({onDateSelect, pastAppointmentsList} : SelectDayCardsProps) => {
    const weekDays = generateTwoWeeks();
    const [selectedDate, setSelectedDate] = useState<string>("");
    const handleDateSelect = (isoDate: string) => {
     setSelectedDate(isoDate);
     onDateSelect(isoDate); 
  };

  return (
        <div className={styles['setavailability-grid']}>
          {weekDays.map((day, i) => {
          const isDisabled = pastAppointmentsList.some
            (item => {
        const itemIso = new Date(item.fullDate).toISOString().split('T')[0]; 
        return itemIso === day.isoDate; 
      });

    return (
      <AvailabilityDayCard
        key={i}
        day={day}
        onDateSelect={() => handleDateSelect(day.isoDate)}
        selected={selectedDate === day.isoDate}
        disabled={isDisabled} 
      />
    );
  })}
    </div>
  );
};

export default SelectDayCards;
