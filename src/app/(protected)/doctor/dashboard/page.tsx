"use client";
import React, { useRef, useState, useEffect } from 'react'
import DoctorDashboardHeader from "@/components/DoctorDashboard/DoctorDashboardHeader/DoctorDashboardHeader";
import { NextPage } from 'next';
import styles from './doctordashboard.module.scss';
import DoctorSchedule from "@/components/DoctorDashboard/Schedule/DoctorSchedule/DoctorSchedule";
import SetDoctorAvailability from '@/components/DoctorDashboard/SetAvailability/SetDoctorAvailabilityView/SetDoctorAvailabilityView';
import AppointmentNotesView from '@/components/DoctorDashboard/AppointmentsNotes/AppointmentNotesView/AppointmentNotesView';
import { useRouter } from "next/navigation";
import { auth } from "@/lib//firebase"; 
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import toast from "react-hot-toast";
type Props = {
}

const DoctorDashboardPage: NextPage<Props> = () => {
   const [activeTab, setActiveTab] = useState("My Schedule");
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
     const toastShownRef = useRef(false);
     useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/doctor/login");
        return;
      }

      try {
        // Get fresh token with claims
        const tokenResult = await user.getIdTokenResult(true);
        const role = tokenResult.claims.role;

        if (role === "doctor") {
          setAuthorized(true);
        } else {
          if (!toastShownRef.current) {
            toast.error(`You are logged in as ${role}. Only Doctor can access this page.`);
            toastShownRef.current = true;
          }
          router.push("/doctor/login");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        router.push("/doctor/login");
      } finally {
        setLoading(false);
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [router]);


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