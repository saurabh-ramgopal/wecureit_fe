"use client";
import React, { useState } from "react";
import styles from "../AdminDashboard.module.scss";
import AddDoctor, { type Doctor as AddDoctorType } from "./AddDoctor";
import { Pencil, Trash2, UserPlus } from 'lucide-react';


type DocLicense = { state: string; specialty: string; id: string };
type DoctorSummary = { name: string; email: string; gender: string; licenses: DocLicense[] };

const doctors: DoctorSummary[] = [
  {
    name: "Dr. Sarah Mitchell",
    email: "sarah.mitchell@hospital.com",
    gender: "Female",
    licenses: [
      { state: "Washington DC", specialty: "Cardiology", id: "#DC-CARD-2015-8842" },
      { state: "Maryland", specialty: "Cardiology", id: "#MD-CARD-2016-3391" },
    ],
  },
  {
    name: "Dr. James Rodriguez",
    email: "james.rodriguez@hospital.com",
    gender: "Male",
    licenses: [{ state: "Virginia", specialty: "Orthopedics", id: "#VA-ORTH-2010-5527" }],
  },
  {
    name: "Dr. Emily Chen",
    email: "emily.chen@hospital.com",
    gender: "Female",
    licenses: [
      { state: "Washington DC", specialty: "Pediatrics", id: "#DC-PEDI-2018-6754" },
      { state: "Virginia", specialty: "General Practice", id: "#VA-GENP-2019-2983" },
    ],
  },
];

const DoctorTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<AddDoctorType | null>(null);
  // placeholder refresh handler until full CRUD is wired
  const refreshDoctors = () => {
    // TODO: implement re-fetching doctors from backend
    console.log("refreshDoctors called");
  };
  return (
    <div className="w-full">
      {/* Header */}
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Doctor Management</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Create new doctor accounts and update specialties</div>
        </div>

        <button className={styles.addButton} onClick={() => setShowModal(true)}>
        <UserPlus size={18} strokeWidth={2} />
        <span>Add Doctor</span>
        </button>

      </div>

      {showModal && (
        <AddDoctor
          mode={selectedDoctor ? "edit" : "create"}
          doctor={selectedDoctor ?? undefined}
          onClose={() => {
            setShowModal(false);
            setSelectedDoctor(null);
          }}
          onSubmit={() => {
            refreshDoctors();
            setShowModal(false);
            setSelectedDoctor(null);
          }}
        />
      )}

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className="w-full border-collapse text-[0.95rem]">
          <thead className="bg-[var(--bg-light)]">
            <tr className="text-left border-b border-[var(--border-light)] text-[var(--text-secondary)]">
              <th className="py-3 px-2 font-semibold">Name</th>
              <th className="px-2 font-semibold">Email</th>
              <th className="px-2 font-semibold">State Licenses</th>
              <th className="px-2 font-semibold">Gender</th>
              <th className="px-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc, i) => (
              <tr
                key={i}
                className="border-b border-[var(--border-light)] hover:bg-[var(--bg-hover)] transition"
              >
                <td className="py-3 px-2 font-medium text-[var(--text-primary)]">{doc.name}</td>
                <td className="px-2">{doc.email}</td>
                <td className="px-2">
                  {doc.licenses.map((l, j) => (
                    <div key={j} className="flex items-center gap-2 mb-1">
                      <span className={styles.badge}>
                        {l.state}: {l.specialty}
                      </span>
                      <span className="text-[var(--text-muted)] text-xs">{l.id}</span>
                    </div>
                  ))}
                </td>
                <td className="px-2">{doc.gender}</td>
                <td className="px-2">
              <div className={styles.actions}>
                <button
                  className={styles.iconButton}
                  onClick={() => {
                    // map DoctorSummary -> AddDoctorType shape
                    const mapped = {
                      name: doc.name,
                      email: doc.email,
                      gender: doc.gender,
                      licenses: doc.licenses.map((l) => ({
                        stateId: l.state,
                        specialityId: l.specialty,
                        licenseNumber: l.id,
                      })),
                    } as AddDoctorType;
                    setSelectedDoctor(mapped);
                    setShowModal(true);
                  }}
                >
                  <Pencil size={18} strokeWidth={2} className={styles.iconEdit} />
                </button>
                <button className={styles.iconButton}>
                  <Trash2 size={18} strokeWidth={2} className={styles.iconDelete} />
                </button>
              </div>
        </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorTable;
