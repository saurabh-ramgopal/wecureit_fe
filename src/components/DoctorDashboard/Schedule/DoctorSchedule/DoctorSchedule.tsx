import React, { useState } from 'react';
import ScheduleHeader from '../ScheduleHeader/ScheduleHeader';
import ScheduleView from '../ScheduleView/ScheduleView';
import './DoctorSchedule.scss';

const MySchedule: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(1);

  // Temporary mock schedule data
  const schedule = [
    {
      shortDate: 'Thu, Nov 13',
      fullDate: 'November 13, 2025',
      location: 'Bethesda Health Center',
      totalHours: '1.0 hours',
      appointments: [
        {
          id: 1,
          patientName: 'Jennifer Davis',
          duration: '30 min',
          time: '09:00 - 09:30',
          reason: 'Palpitations and dizziness',
        },
        {
          id: 2,
          patientName: 'Michael Brown',
          duration: '30 min',
          time: '10:00 - 10:30',
          reason: 'Routine cardiac screening',
        },
      ],
    },
    // Add 6 more DayCards for Week 1
    { shortDate: 'Fri, Nov 14', fullDate: 'November 14, 2025', location: 'Bethesda Health Center', totalHours: '0.8 hours', appointments: [] },
    { shortDate: 'Sat, Nov 15', fullDate: 'November 15, 2025', location: 'Bethesda Health Center', totalHours: '0.5 hours', appointments: [] },
    { shortDate: 'Sun, Nov 16', fullDate: 'November 16, 2025', location: 'Bethesda Health Center', totalHours: '0 hours', appointments: [] },
    { shortDate: 'Mon, Nov 17', fullDate: 'November 17, 2025', location: 'Bethesda Health Center', totalHours: '1.2 hours', appointments: [] },
    { shortDate: 'Tue, Nov 18', fullDate: 'November 18, 2025', location: 'Bethesda Health Center', totalHours: '0.8 hours', appointments: [] },
    { shortDate: 'Wed, Nov 19', fullDate: 'November 19, 2025', location: 'Bethesda Health Center', totalHours: '1.0 hours', appointments: [] },

    // Week 2 (next 7 days)
    { shortDate: 'Thu, Nov 20', fullDate: 'November 20, 2025', location: 'Bethesda Health Center', totalHours: '1.0 hours', appointments: [] },
    { shortDate: 'Fri, Nov 21', fullDate: 'November 21, 2025', location: 'Bethesda Health Center', totalHours: '0.5 hours', appointments: [] },
    { shortDate: 'Sat, Nov 22', fullDate: 'November 22, 2025', location: 'Bethesda Health Center', totalHours: '0 hours', appointments: [] },
    { shortDate: 'Sun, Nov 23', fullDate: 'November 23, 2025', location: 'Bethesda Health Center', totalHours: '0.8 hours', appointments: [] },
    { shortDate: 'Mon, Nov 24', fullDate: 'November 24, 2025', location: 'Bethesda Health Center', totalHours: '1.2 hours', appointments: [] },
    { shortDate: 'Tue, Nov 25', fullDate: 'November 25, 2025', location: 'Bethesda Health Center', totalHours: '0.5 hours', appointments: [] },
    { shortDate: 'Wed, Nov 26', fullDate: 'November 26, 2025', location: 'Bethesda Health Center', totalHours: '0 hours', appointments: [] },
  ];


  return (
    <div className="schedule-card">
      <ScheduleHeader currentWeek={currentWeek} onWeekChange={setCurrentWeek} />
      <ScheduleView schedule={schedule} currentWeek={currentWeek} />
    </div>
  );
};

export default MySchedule;
