"use client";
import React, { useState } from 'react'
import DoctorDashboardHeader from "@/components/DoctorDashboard/DoctorDashboardHeader/DoctorDashboardHeader";
import { NextPage } from 'next';
import styles from './doctordashboard.module.scss';
import DoctorSchedule from "@/components/DoctorDashboard/Schedule/DoctorSchedule/DoctorSchedule";
import SetDoctorAvailability from '@/components/DoctorDashboard/SetAvailability/SetDoctorAvailabilityView/SetDoctorAvailabilityView';
import AppointmentNotesView from '@/components/DoctorDashboard/AppointmentsNotes/AppointmentNotesView/AppointmentNotesView';

type Props = {
}

const DoctorDashboardPage: NextPage<Props> = () => {
   const [activeTab, setActiveTab] = useState("My Schedule");
    const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
    console.log("Active Tab:", tabLabel);
  };
  return (
  <div className={`${styles.doctorDashboard} theme-doctor`} style={{ background: 'var(--bg-page)' }}>
       <div className={styles.dashboardHeaderSection}>
        <h1 className={styles.portalTitle}>Welcome to Doctor Portal</h1>
    </div>
    <DoctorDashboardHeader 
      activeTab={activeTab}
      onTabClick={handleTabClick} 
    />
      <div>
        {activeTab === "My Schedule" && <DoctorSchedule/>}
        {activeTab === "Set Availability" && <SetDoctorAvailability/>}
        {activeTab === "Appointments & Notes" && <AppointmentNotesView/>}
      </div>
  </div>
  );
};

export default DoctorDashboardPage;