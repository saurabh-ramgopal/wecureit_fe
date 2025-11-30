"use client";
import React, { useState, useEffect, useRef } from 'react'
import { Pencil, Trash2 } from "lucide-react";
import { Stethoscope, Building2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import styles from "./AdminDashboard.module.scss";
import { useRouter } from "next/navigation";
import { auth } from "@/lib//firebase"; 
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import toast from "react-hot-toast";

const DoctorTable = dynamic(() => import('../../../../components/AdminDashboard/Doctors/DoctorTable/DoctorTable').then(m => m.default ?? m), { ssr: false })
const FacilityTable = dynamic(() => import('../../../../components/AdminDashboard/Facilities/FacilityTable/FacilityTable').then(m => m.default ?? m), { ssr: false })

const AdminDashboard = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"doctors" | "facilities">("doctors");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const toastShownRef = useRef(false);
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult(true);
        const role = tokenResult.claims.role;

        if (role === "admin") {
          setAuthorized(true);
        } else {
          if (!toastShownRef.current) {
            toast.error(`You are logged in as ${role}. Only Admin can access this page.`);
            toastShownRef.current = true;
          }
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    });

   
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
  return (
    <div className={`${styles.themeAdmin} ${styles.wrapper}`}>
      <div className={styles.mainContent}>
        <h1 className={styles.title}>Admin Portal</h1>
        <p className={styles.subtitle}>Manage doctors, facilities, and room specialties</p>

        
        <div className={styles.tabGroup}>
        <button onClick={() => setTab("doctors")} className={`${styles.tabButton} ${tab === "doctors" ? styles.tabActive : ""}`} >
        <Stethoscope size={18} />
      <span>Doctors</span>
      </button>

      <button onClick={() => setTab("facilities")} className={`${styles.tabButton} ${tab === "facilities" ? styles.tabActive : ""}`} >
      <Building2 size={18} />
      <span>Facilities</span>
    </button>
    </div>

          <div className={styles.card}>
            {tab === "doctors" ? <DoctorTable /> : <FacilityTable />}
          </div>
        </div>
      </div>
  );
};
export default AdminDashboard;