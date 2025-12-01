import React from 'react';
import styles from './ScheduleHeader.module.scss'

interface ScheduleHeaderProps {
  currentWeek: number;
  onWeekChange: (week: number) => void;
}

const ScheduleHeader = ({ currentWeek, onWeekChange }: ScheduleHeaderProps) => {
  return (
    <div className={styles['schedule-header']}>
      <div className={styles['schedule-header__text']}>
        <h2 className={styles['schedule-header__title']}>My Schedule - Next 2 Weeks</h2>
        <p className={styles['schedule-header__subtitle']}>
          View your upcoming appointments with location and time details
        </p>
      </div>
     
    </div>
  );
};

export default ScheduleHeader;
