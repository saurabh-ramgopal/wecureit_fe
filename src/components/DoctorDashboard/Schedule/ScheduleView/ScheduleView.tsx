import React from 'react';
import DayCard from '../DayCard/DayCard';
import {ScheduleUI } from "../../../../types/doctor"
import styles from './ScheduleView.module.scss';

interface ScheduleViewProps {
  schedule: ScheduleUI;
}

const ScheduleView = ({ schedule }: ScheduleViewProps) => {
  // Slice the schedule array to get 7 days per week
  const weekDays = schedule || [];

  return (
    <div className={styles['schedule-view']}>
       {schedule.map((day) => (
        <DayCard key={day.fullDate} schedule={day} />
      ))}
    </div>
  );
};

export default ScheduleView;
