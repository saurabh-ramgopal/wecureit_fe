 'use client'
import React, {useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { logoutUser } from "@/lib/auth";
import { LogOut } from 'lucide-react';
import { NextPage } from 'next';
import styles from './patientdashboard.module.scss';
import PatientDashboardHeader from "@/components/PatientDashboard/PatientDashboardHeader/PatientDashboardHeader";
import MyProfile from "@/components/PatientDashboard/MyProfile/MyProfile";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import PatientHome from '../../../../components/PatientDashboard/PatientHome/PatientHome';


const PatientDashboardPage: NextPage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Home");
    const toastShownRef = useRef(false);

  // // Respect `?tab=...` query param so other pages can deep-link into a specific tab
  // const searchParams = useSearchParams();
  // useEffect(() => {
  //   try {
  //     const tab = searchParams?.get('tab');
  //     if (tab) setActiveTab(tab);
  //   } catch (e) {
  //     // ignore
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchParams]);
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
    if (tabLabel === "Logout User") {
    handleSignOut(); 
    return; 
  }
    setActiveTab(tabLabel);
    console.log("Active Tab:", tabLabel);
  };

  const handleSignOut = async () => {
   logoutUser("/patient/login");
  };
  return (

  <div className={`${styles.patientDashboard} theme-patient`} style={{ background: 'var(--bg-page)' }}>
    <PatientDashboardHeader 
      activeTab={activeTab}
      onTabClick={handleTabClick} 
    />
      <div className={styles.contentArea}>
        {activeTab === "Home" && <PatientHome patientId={userId} />}

        {activeTab === "My Profile" && <MyProfile />}

        {activeTab === "Appointment History" }
      </div>
  </div>
  )
};
export default PatientDashboardPage;
