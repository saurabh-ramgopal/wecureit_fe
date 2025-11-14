import React from 'react';
import DayCard from '../DayCard/DayCard';
import {Day } from "../../../../types/schedule"
import "./ScheduleView.scss"

interface ScheduleViewProps {
  schedule: Day[];
  currentWeek: number;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, currentWeek }) => {
  // Slice the schedule array to get 7 days per week
  const startIndex = (currentWeek - 1) * 7;
  const endIndex = startIndex + 7;
  const weekDays = schedule.slice(startIndex, endIndex);

  return (
    <div className="schedule-view">
      {weekDays.map((day) => (
        <DayCard key={day.shortDate} day={day} />
      ))}
    </div>
  );
};

export default ScheduleView;
