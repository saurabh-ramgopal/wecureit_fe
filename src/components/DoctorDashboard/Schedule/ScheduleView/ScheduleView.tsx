import React from 'react';
import DayCard from '../DayCard/DayCard';
import {Day } from "../../../../types/doctor"
import styles from './ScheduleView.module.scss';

interface ScheduleViewProps {
  schedule: Day[];
  currentWeek: number;
}

const ScheduleView = ({ schedule, currentWeek }: ScheduleViewProps) => {
  // Slice the schedule array to get 7 days per week
  const startIndex = (currentWeek - 1) * 7;
  const endIndex = startIndex + 7;
  const weekDays = schedule.slice(startIndex, endIndex);

  return (
    <div className={styles['schedule-view']}>
      {weekDays.map((day) => (
        <DayCard key={day.shortDate} day={day} />
      ))}
    </div>
  );
};

export default ScheduleView;
