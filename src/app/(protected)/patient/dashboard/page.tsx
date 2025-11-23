"use client";
import React, { useState } from 'react'
// import PatientDashboardHeader from "@/components/PatientDashboard/PatientDashboardHeader/DoctorDashboardHeader";
import { NextPage } from 'next';
import styles from './patientdashboard.module.scss';
import PatientDashboardHeader from "@/components/PatientDashboard/PatientDashboardHeader/PatientDashboardHeader";
// import Home from '@/components/PatientDashboard/Home/Home';
// import MyProfile from '@/components/PatientDashboard/MyProfile/MyProfile';
// import AppointmentHistory from '@/components/PatientDashboard/AppointmentHistory/AppointmentHistory';


import AppointmentHistoryCard from '@/components/DoctorDashboard/AppointmentsNotes/AppointmentHistoryCard/AppointmentHistoryCard';
// import DoctorSchedule from "@/components/DoctorDashboard/Schedule/DoctorSchedule/DoctorSchedule";
// import SetDoctorAvailability from '@/components/DoctorDashboard/SetAvailability/SetDoctorAvailabilityView/SetDoctorAvailabilityView';
// import AppointmentNotesView from '@/components/DoctorDashboard/AppointmentsNotes/AppointmentNotesView/AppointmentNotesView';
// import PatientDashboard from './page';



type Props = {
}

const PatientDashboardPage: NextPage<Props> = () => {
   const [activeTab, setActiveTab] = useState("Home");
    const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
    console.log("Active Tab:", tabLabel);
  };
  return (
  <div className={`${styles.patientDashboard} theme-patient`} style={{ background: 'var(--bg-page)' }}>
       <div className={styles.dashboardHeaderSection}>
        <h1 className={styles.portalTitle}>Welcome to Patient Portal</h1>
    </div>
    <PatientDashboardHeader 
      activeTab={activeTab}
      onTabClick={handleTabClick} 
    />
      <div>
        {activeTab === "Home"}
        {activeTab === "My Profile"}
        {activeTab === "Appointment History"}
      </div>
  </div>
  );
};

export default PatientDashboardPage;