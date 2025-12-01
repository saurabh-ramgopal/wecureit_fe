"use client";
import React, { useState, useEffect, useRef } from 'react'
import { Pencil, Trash2 } from "lucide-react";
import { Stethoscope, Building2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import styles from "./AdminDashboard.module.scss";
import { useRouter } from "next/navigation";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import { auth } from "@/lib//firebase"; 
import { onAuthStateChanged, getIdTokenResult, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { logoutUser } from '@/lib/auth';
const DoctorTable = dynamic(() => import('../../../../components/AdminDashboard/Doctors/DoctorTable/DoctorTable').then(m => m.default ?? m), { ssr: false })
const FacilityTable = dynamic(() => import('../../../../components/AdminDashboard/Facilities/FacilityTable/FacilityTable').then(m => m.default ?? m), { ssr: false })

const AdminDashboard = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"doctors" | "facilities">("doctors");
  const { authorized, loading, userId, role } = useRoleAuth({ allowedRoles: ['admin'] });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  if (!authorized) return null; 
    const handleSignOut = async () => {
     logoutUser("/admin/login");
    };
  return (
    <div className={`${styles.themeAdmin} ${styles.wrapper}`}>
      <div className={styles.mainContent}>
        <div className={styles.pageTop}>
          <div>
            <h1 className={styles.title}>Admin Portal</h1>
            <p className={styles.subtitle}>Manage doctors, facilities, and room specialties</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button type="button" onClick={handleSignOut} className={styles.signOutBtn} aria-label="Sign out">
              Sign Out
            </button>
          </div>
        </div>

        
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