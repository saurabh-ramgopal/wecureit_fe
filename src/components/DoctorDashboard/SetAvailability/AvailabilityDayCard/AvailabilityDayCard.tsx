import React from 'react';
import styles from './AvailabilityDayCard.module.scss';

interface Day {
  dayName: string;
  dateNumber: string;
  month: string;
  formattedDate: string;
 
}
type SetAvailabilityDayCardProps = {
  day: Day;
  onDateSelect: (date: string) => void;
  selected?: boolean; 
  disabled?: boolean;
};

const AvailabilityDayCard = ({ day, onDateSelect, selected, disabled} : SetAvailabilityDayCardProps) => {

  return (
    <div className={`${styles['setavailability-day-card']} ${selected ? styles['selected'] : ''} ${disabled ? styles.disabled : ''}`}  onClick={() => !disabled && onDateSelect(day.formattedDate)}>
      <div className={styles['setavailability-day-card__header']}>
        <h4>{day.dayName}</h4>
        <p className={styles['setavailability-day-card__date']}>
          <span className={styles['date-number']}>{day.dateNumber}</span>
          <span className={styles['month']}>{day.month}</span>
        </p>
      </div>
    </div>
  );
};

export default AvailabilityDayCard;
