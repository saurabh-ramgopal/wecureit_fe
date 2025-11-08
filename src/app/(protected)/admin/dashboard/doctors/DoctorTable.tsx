"use client";
import React, { useEffect, useState } from "react";
import styles from "../AdminDashboard.module.scss";
import localStyles from "./DoctorTable.module.scss";
import AddDoctor, { type Doctor as AddDoctorType } from "./AddDoctor";
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { getDoctors, deleteDoctor } from "../../../../../lib/api";


// Backend types
type SpecialityItem = { specialityMasterId?: string; specialityName?: string; speciality_master_id?: string; name?: string } & Record<string, string|number|undefined>;
type BackendDoctor = {
  doctorMasterId?: number;
  doctorName?: string;
  doctorEmail?: string;
  doctorGender?: string;
  speciality?: SpecialityItem[];
  licenses?: SpecialityItem[];
  [k: string]: unknown;
};
type DoctorSummary = BackendDoctor;

const DoctorTable = () => {
  const [doctorsList, setDoctorsList] = useState<DoctorSummary[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<AddDoctorType | null>(null);

  const refreshDoctors = async () => {
    try {
      const res = await getDoctors();
      if (Array.isArray(res)) setDoctorsList(res as DoctorSummary[]);
      else setDoctorsList([]);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
      setDoctorsList([]);
    }
  };

  useEffect(() => {
    void refreshDoctors();
  }, []);

  const handleDelete = async (doc: DoctorSummary) => {
    const id = (doc?.doctorMasterId ?? doc?.doctorId ?? doc?.id) as number | undefined;
    const displayName = doc?.doctorName ?? doc?.name ?? doc?.email ?? 'doctor';
    if (!confirm(`Delete doctor ${displayName}?`)) return;
    if (!id) {
      alert('Cannot delete: missing doctor id');
      return;
    }
    try {
      await deleteDoctor({ doctorMasterId: id, isActive: false });
      await refreshDoctors();
    } catch (err) {
      console.error('deleteDoctor failed', err);
      alert('Failed to delete doctor');
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Doctor Management</div>
          <div className={localStyles.headerSubtitle}>Create new doctor accounts and update specialties</div>
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
          onSubmit={async () => {
            await refreshDoctors();
            setShowModal(false);
            setSelectedDoctor(null);
          }}
        />
      )}

      {/* Card grid for doctors */}
      <div className={localStyles.grid}>
        {doctorsList.map((doc: BackendDoctor, i: number) => (
          <div key={i} className={localStyles.card}>
            <div className={localStyles.cardTop}>
              <div>
                <div className={localStyles.doctorName}>{String(doc?.doctorName ?? doc?.name ?? '')}</div>
              </div>

              <div className={localStyles.actions}>
                <button
                  className={styles.iconButton}
                  onClick={() => {
                    const mapped = {
                      name: doc?.doctorName ?? doc?.name,
                      email: doc?.doctorEmail ?? doc?.email,
                      gender: doc?.doctorGender ?? doc?.gender,
                      licenses: (doc?.speciality ?? []).map((s: SpecialityItem) => ({
                        stateCode: '',
                        specialityId: s?.specialityMasterId ?? s?.speciality_master_id ?? String(s?.['id'] ?? ''),
                      })),
                    } as AddDoctorType;
                    setSelectedDoctor(mapped);
                    setShowModal(true);
                  }}
                >
                  <Pencil size={18} strokeWidth={2} className={styles.iconEdit} />
                </button>
                <button className={styles.iconButton} onClick={() => void handleDelete(doc)}>
                  <Trash2 size={18} strokeWidth={2} className={styles.iconDelete} />
                </button>
              </div>
            </div>

            <div className={localStyles.info}>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${String(doc?.doctorEmail ?? doc?.email ?? '')}`}>
                {String(doc?.doctorEmail ?? doc?.email ?? '')}
              </a>
            </div>

            <div className={localStyles.info}>
              <strong>Gender:</strong> {String(doc?.doctorGender ?? doc?.gender ?? '')}
            </div>

            <div>
              <div className={localStyles.sectionTitle}><strong>Specialties:</strong></div>
              <div className={localStyles.badgesWrap}>
                {((doc?.speciality ?? doc?.licenses) as SpecialityItem[] ?? []).map((l: SpecialityItem, j: number) => (
                  <span key={j} className={styles.badge}>
                    {String(l?.specialityName ?? l?.speciality ?? l?.speciality_master_id ?? l?.name ?? '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorTable;
