'use client'
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib//firebase"; 
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import toast from "react-hot-toast";
import { NextPage } from 'next';
import styles from './patientdashboard.module.scss';
import PatientDashboardHeader from "@/components/PatientDashboard/PatientDashboardHeader/PatientDashboardHeader";
import MyProfile from '@/components/PatientDashboard/MyProfile/MyProfile';



type Props = {
}

const PatientDashboardPage: NextPage<Props> = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [activeTab, setActiveTab] = useState("Home");
    const toastShownRef = useRef(false);
      useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/patient/login");
        return;
      }

      try {
        // Get fresh token with claims
        const tokenResult = await user.getIdTokenResult(true);
        const role = tokenResult.claims.role;

        if (role === "patient") {
          setAuthorized(true);
        } else {
         if (!toastShownRef.current) {
            toast.error(`You are logged in as ${role}. Only Patient can access this page.`);
            toastShownRef.current = true;
          }
          router.push("/patient/login");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        router.push("/patient/login");
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
  )
};
export default PatientDashboardPage;