import React, { useState } from 'react';
import ScheduleHeader from '../ScheduleHeader/ScheduleHeader';
import ScheduleView from '../ScheduleView/ScheduleView';
import styles from './DoctorSchedule.module.scss';
import { ScheduleDayUI } from '@/types/doctor';

type DoctorScheduleProps = {
  doctorScheduleList: ScheduleDayUI[];
}
const MySchedule = ({ doctorScheduleList }: DoctorScheduleProps) => {
  const [currentWeek, setCurrentWeek] = useState(1);


  return (
    <div className={styles['schedule-card']}>
      <ScheduleHeader currentWeek={currentWeek} onWeekChange={setCurrentWeek} />
      <ScheduleView schedule={doctorScheduleList} />
    </div>
  );
};

export default MySchedule;
