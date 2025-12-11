import React, { useEffect, useState } from 'react';
import DayCard from '../DayCard/DayCard';
import {PatientHistiryDetailsAPIResponse, ScheduleUI } from "../../../../types/doctor"
import styles from './ScheduleView.module.scss';
import PatientNotesModal from '../PatientNotesModal/PatientNotesModal';
import { getPatientHistoryDetails } from '@/lib/api';
interface ScheduleViewProps {
  schedule: ScheduleUI;
}

const ScheduleView = ({ schedule }: ScheduleViewProps) => {

const [selectedPatient, setSelectedPatient] = useState(Number);
const [isModalOpen, setIsModalOpen] = useState(false);
const [patientDetails, setPatientDetails] = useState<PatientHistiryDetailsAPIResponse | null>(null);

  const handleAppointmentCardClick = async  (patientMasterId: number) => {
    setSelectedPatient(patientMasterId);
    setIsModalOpen(true);
    await fetchPatientHistory(patientMasterId); 
  };

   const fetchPatientHistory = async (patientId: number) => {
      try {
        const response: PatientHistiryDetailsAPIResponse = await getPatientHistoryDetails(patientId); 
        setPatientDetails(response);
        console.log("Fetched PatientHistory:", response);
  
      } catch (error) {
        console.error("Failed to fetch PatientHistory:", error);
      } 
    }
  
  if (!schedule || schedule.length === 0) {
    return (
      <p  className={styles['no-appointments']}>
        No appointments booked yet.
      </p>
    );
  }
console.log("SelectedPatient",selectedPatient);
  return (
    <div className={styles['schedule-view']}>
       {schedule.map((day) => (
        <DayCard key={day.fullDate} schedule={day}
          onPatientApptCardClick={handleAppointmentCardClick} />
      ))}
     {isModalOpen && selectedPatient && (
        <PatientNotesModal
          patientData={patientDetails}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ScheduleView;
