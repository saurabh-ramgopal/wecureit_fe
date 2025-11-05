"use client";
import React, { useState } from 'react'
import { Pencil, Trash2 } from "lucide-react";
import { Stethoscope, Building2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import styles from "./AdminDashboard.module.scss";


const DoctorTable = dynamic(() => import('./doctors/DoctorTable').then(m => m.default ?? m), { ssr: false })
const FacilityTable = dynamic(() => import('./facilities/FacilityTable').then(m => m.default ?? m), { ssr: false })

const AdminDashboard = () => {
  const [tab, setTab] = useState<"doctors" | "facilities">("doctors");

  return (
    <div className={`${styles.themeAdmin} ${styles.wrapper}`}>
      <div className={styles.mainContent}>
        <h1 className={styles.title}>Admin Portal</h1>
        <p className={styles.subtitle}>Manage doctors, facilities, and room specialties</p>

        {/* Tabs */}
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

        {/* <div className={styles.tabContent}> */}
          <div className={styles.card}>
            {tab === "doctors" ? <DoctorTable /> : <FacilityTable />}
          </div>
        </div>
      </div>
  );
};
export default AdminDashboard;