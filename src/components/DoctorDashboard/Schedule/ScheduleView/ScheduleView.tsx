import React from 'react';
import DayCard from '../DayCard/DayCard';
import {ScheduleUI } from "../../../../types/doctor"
import styles from './ScheduleView.module.scss';

interface ScheduleViewProps {
  schedule: ScheduleUI;
}

const ScheduleView = ({ schedule }: ScheduleViewProps) => {
  
  if (!schedule || schedule.length === 0) {
    return (
      <p  className={styles['no-appointments']}>
        No appointments booked yet.
      </p>
    );
  }

  return (
    <div className={styles['schedule-view']}>
       {schedule.map((day) => (
        <DayCard key={day.fullDate} schedule={day} />
      ))}
    </div>
  );
};

export default ScheduleView;
