"use client";
import React, { useState } from 'react'
import DoctorDashboardHeader from "../../../../components/DoctorDashboard/DoctorDashboardHeader/DoctorDashboardHeader";
import { NextPage } from 'next';
import styles from './doctordashboard.module.scss';
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
        {activeTab === "My Schedule" && <p>Here is your schedule for today.</p>}
        {activeTab === "Set Availability" && <p>Set your available hours here.</p>}
        {activeTab === "Appointments & Notes" && <p>View and manage your appointments and notes.</p>}
      </div>
  </div>
  );
};

export default DoctorDashboardPage;