 'use client'
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    const toastShownRef = useRef(false);

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/patient/login");
        return;
      }

      try {
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

    return () => unsubscribe();
  }, [router]);

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
