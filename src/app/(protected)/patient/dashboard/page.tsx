'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib//firebase"; 
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import toast from "react-hot-toast";
import { NextPage } from 'next';
import styles from './patientdashboard.module.scss';
import PatientDashboardHeader from "@/components/PatientDashboard/PatientDashboardHeader/PatientDashboardHeader";
import AppointmentHistoryCard from '@/components/DoctorDashboard/AppointmentsNotes/AppointmentHistoryCard/AppointmentHistoryCard';

type Props = {
}

const PatientDashboardPage: NextPage<Props> = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [activeTab, setActiveTab] = useState("Home");
     useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = sessionStorage.getItem("idToken");
        if (!token) {
          router.push("/patient/login"); 
          return;
        }

        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            router.push("/patient/login");
            return;
          }
          const tokenResult = await getIdTokenResult(user, true);
          const role = tokenResult.claims.role;
          const patientMasterId = tokenResult.claims.patientMasterId;
          console.log(patientMasterId);
          if (role === "patient") {
            setAuthorized(true); 
          } else {
            toast.error(`You are logged in as ${role}. Only Patients can access this page.`);
            router.push("/patient/login"); 
          }
        });
      } catch (error) {
        console.error("Authorization error:", error);
        router.push("/patient/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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

  <div className={`${styles.patientDashboard} theme-patient`} style={{ background: 'var(--bg-page)' }}>
      {loading || !authorized ? (
      <p>Loading...</p>
    ) : (
      <>
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
      </>
    )}
  </div>
  )
};
