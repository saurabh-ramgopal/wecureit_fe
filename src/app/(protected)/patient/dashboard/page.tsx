 'use client'
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib//firebase"; 
import { logoutUser } from "@/lib/auth";
import { onAuthStateChanged, getIdTokenResult, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { NextPage } from 'next';
import styles from './patientdashboard.module.scss';
import PatientDashboardHeader from "@/components/PatientDashboard/PatientDashboardHeader/PatientDashboardHeader";
import MyProfile from "@/components/PatientDashboard/MyProfile/MyProfile";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import PatientHome from '../../../../components/PatientDashboard/PatientHome/PatientHome';


const PatientDashboardPage: NextPage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Home");

     const { authorized, loading, userId, role } = useRoleAuth({ allowedRoles: ['patient'] });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  if (!authorized) return null; 
    const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
    console.log("Active Tab:", tabLabel);
  };

  const handleSignOut = async () => {
   logoutUser("/patient/login");
  };
  return (

  <div className={`${styles.patientDashboard} theme-patient`} style={{ background: 'var(--bg-page)' }}>
       <div className={styles.dashboardHeaderSection}>
        {/* <h1 className={styles.portalTitle}></h1> */}
        <div style={{ marginLeft: 'auto' }}>
          <button
            type="button"
            onClick={handleSignOut}
            className="btn btn-primary"
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </div>
    </div>
    <PatientDashboardHeader 
      activeTab={activeTab}
      onTabClick={handleTabClick} 
    />
      <div className={styles.contentArea}>
        {activeTab === "Home" && <PatientHome />}

        {activeTab === "My Profile" && <MyProfile />}

        {activeTab === "Appointment History" }
      </div>
  </div>
  )
};
export default PatientDashboardPage;