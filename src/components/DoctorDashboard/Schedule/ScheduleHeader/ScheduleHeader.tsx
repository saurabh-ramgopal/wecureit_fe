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
      <div className={styles['schedule-header__buttons']}>
        <button
          className={`${styles['week-button']} ${currentWeek === 1 ? 'active' : ''}`}
          onClick={() => onWeekChange(1)}
           disabled={currentWeek === 1}
        >
            <span className={styles['arrow']}>&lt;</span>
            <span className={styles['week-text']}>Week 1</span>
        </button>
        <button
          className={`${styles['week-button']} ${currentWeek === 2 ? 'active' : ''}`}
          onClick={() => onWeekChange(2)}
             disabled={currentWeek === 2}
        >
                 <span className={styles['week-text']}>Week 2</span>
                 <span className={styles['arrow']}>&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default ScheduleHeader;
