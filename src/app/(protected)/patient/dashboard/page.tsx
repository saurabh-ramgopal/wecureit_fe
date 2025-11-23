"use client";
import React, { useState } from 'react'
import { NextPage } from 'next';
import styles from './patientdashboard.module.scss';
import PatientDashboardHeader from "@/components/PatientDashboard/PatientDashboardHeader/PatientDashboardHeader";
import MyProfile from '@/components/PatientDashboard/MyProfile/MyProfile';



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
        {/* <h1 className={styles.portalTitle}></h1> */}
    </div>
    <PatientDashboardHeader 
      activeTab={activeTab}
      onTabClick={handleTabClick} 
    />
      <div className={styles.contentArea}>
        {activeTab === "Home" }

        {activeTab === "My Profile" && <MyProfile />}

        {activeTab === "Appointment History" }
      </div>
  </div>
  );
};

export default PatientDashboardPage;