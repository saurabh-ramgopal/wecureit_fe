import React from 'react'
import styles from './AppointmentNotesView.module.scss'
import MainCardHeader from '../../MainCardHeader/MainCardHeader';
import { DoctorPastAppointmentsUI } from '@/types/doctor';
import AppointmentHistoryCard from '../AppointmentHistoryCard/AppointmentHistoryCard';

type AppointmentNotesViewProps = {
  doctorPastAppointments: DoctorPastAppointmentsUI[];
  onSaveNotes: (id: string, s: string) => void;
}

const AppointmentNotesView = ({ doctorPastAppointments, onSaveNotes }: AppointmentNotesViewProps) => {
  return (
   <div className={styles['appointmentsHistory-card']}>
    <MainCardHeader title='Completed Appointments & Clinical Notes'
    subtitle='Add clinical notes to completed appointments and view patient history'/>
     <div className={styles['appointmentsHistory-card__list']}>
        {doctorPastAppointments.map((appt, i) => (
          <AppointmentHistoryCard key={i} appointmentHistory={appt} onSaveNotes={onSaveNotes} />
        ))}
      </div>
    </div>
  )
}

export default AppointmentNotesView;