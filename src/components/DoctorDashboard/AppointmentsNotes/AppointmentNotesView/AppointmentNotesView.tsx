import React from 'react'
import styles from './AppointmentNotesView.module.scss'
import MainCardHeader from '../../MainCardHeader/MainCardHeader';
import AppointmentHistoryCard from '../AppointmentHistoryCard/AppointmentHistoryCard';
type Props = {}

const sampleAppointments = [
  {
    patientName: "Sarah Wilson",
    age: "47",
    gender: "Female",
    status: "Completed",
    date: "Sunday, November 2, 2025",
    time: "13:00 - 13:45",
    duration: "45 min",
    complaint: "Post-surgery follow-up",
    location: "Downtown Medical Center",
  },
  {
    patientName: "Michael Brown",
    age: "52",
    gender: "Male",
    status: "Pending",
    date: "Monday, November 3, 2025",
    time: "10:00 - 10:30",
    duration: "30 min",
    complaint: "Routine cardiac screening",
    location: "Bethesda Health Center",
  },
  {
    patientName: "Emily Johnson",
    age: "34",
    gender: "Female",
    status: "Completed",
    date: "Tuesday, November 4, 2025",
    time: "15:00 - 15:30",
    duration: "30 min",
    complaint: "Allergy review",
    location: "Georgetown Clinic",
  },
  {
    patientName: "Daniel Lee",
    age: "40",
    gender: "Male",
    status: "Completed",
    date: "Wednesday, November 5, 2025",
    time: "09:00 - 09:45",
    duration: "45 min",
    complaint: "Post-therapy check",
    location: "Downtown Medical Center",
  },
  {
    patientName: "Rachel Adams",
    age: "29",
    gender: "Female",
    status: "Pending",
    date: "Thursday, November 6, 2025",
    time: "11:00 - 11:30",
    duration: "30 min",
    complaint: "Follow-up on test results",
    location: "Capitol Health Center",
  },
];
const AppointmentNotesView = (props: Props) => {
  return (
   <div className={styles['appointmentsHistory-card']}>
    <MainCardHeader title='Completed Appointments & Clinical Notes'
    subtitle='Add clinical notes to completed appointments and view patient history'/>
     <div className={styles['appointmentsHistory-card__list']}>
        {sampleAppointments.map((appt, i) => (
          <AppointmentHistoryCard key={i} appointmentHistory={appt}  />
        ))}
      </div>
    </div>
  )
}

export default AppointmentNotesView;