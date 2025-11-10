"use client";
import React, { useEffect, useState } from "react";
import styles from "../AdminDashboard.module.scss";
import localStyles from "./DoctorTable.module.scss";
import AddDoctor, { type Doctor as AddDoctorType } from "./AddDoctor";
import { Pencil, Trash2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { getDoctors, deleteDoctor, getStates, getSpecialities } from "../../../../../lib/api";


// Backend types
type SpecialityItem = { specialityMasterId?: string; specialityName?: string; speciality_master_id?: string; name?: string } & Record<string, string|number|undefined>;
type BackendDoctor = {
  doctorMasterId?: number;
  doctorName?: string;
  doctorEmail?: string;
  doctorPassword?: string;
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
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [statesList, setStatesList] = useState<Array<Record<string, unknown>>>([]);
  const [specialitiesList, setSpecialitiesList] = useState<Array<Record<string, unknown>>>([]);

  const togglePasswordVisibility = (key: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatGender = (g: unknown) => {
    if (g === undefined || g === null) return '';
    const s = String(g).trim().toLowerCase();
    if (s.length === 0) return '';
    if (s.startsWith('m')) return 'M';
    if (s.startsWith('f')) return 'F';
    // fallback: first letter uppercase
    return s.charAt(0).toUpperCase();
  };

  const refreshDoctors = async () => {
    try {
      const res = await getDoctors();
      if (Array.isArray(res)) {
        const arr = res as DoctorSummary[];
        arr.sort((a, b) => String(a?.doctorName ?? a?.name ?? '').localeCompare(String(b?.doctorName ?? b?.name ?? ''), undefined, { sensitivity: 'base' }));
        setDoctorsList(arr);
      }
      else setDoctorsList([]);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
      setDoctorsList([]);
    }
  };

  useEffect(() => {
    void refreshDoctors();
  }, []);

  // Load states and specialities for display
  useEffect(() => {
    let mounted = true;
    getStates()
      .then((res: unknown) => {
        if (mounted && Array.isArray(res)) setStatesList(res as Array<Record<string, unknown>>);
      })
      .catch((err: unknown) => console.error('getStates failed', err));

    getSpecialities()
      .then((res: unknown) => {
        if (mounted && Array.isArray(res)) setSpecialitiesList(res as Array<Record<string, unknown>>);
      })
      .catch((err: unknown) => console.error('getSpecialities failed', err));

    return () => { mounted = false; };
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

      {/* EditDoctorSpeciality modal removed per request */}

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
                      doctorMasterId: doc?.doctorMasterId as number | undefined,
                      name: doc?.doctorName ?? doc?.name,
                      email: doc?.doctorEmail ?? doc?.email,
                        password: doc?.doctorPassword ?? '',
                        gender: ((): string => {
                          const raw = doc?.doctorGender ?? doc?.gender;
                          if (raw === undefined || raw === null) return '';
                          const s = String(raw).trim().toLowerCase();
                          if (s.startsWith('m')) return 'Male';
                          if (s.startsWith('f')) return 'Female';
                          return 'Other';
                        })(),
                        // Prefer server-provided licenses (which include stateCode); fall back to flat speciality list
                        licenses: (() => {
                          const typed = doc as BackendDoctor;
                          const raw = (typed.licenses ?? typed.speciality ?? []) as unknown[];
                          const mapped = raw.map((s: unknown) => {
                            const item = s as Record<string, unknown>;
                            if (item && (item['stateCode'] !== undefined || item['state_code'] !== undefined)) {
                              const stateCode = String(item['stateCode'] ?? item['state_code'] ?? '');
                              const specialityIds = (item['specialityIds'] ?? item['speciality_list'] ?? item['speciality_master_id'] ?? item['specialityId']) as unknown;
                              if (Array.isArray(specialityIds)) {
                                return { stateCode, specialityIds: specialityIds.map(String) };
                              }
                              return { stateCode, specialityIds: specialityIds ? [String(specialityIds)] : [] };
                            }
                            const sid = item['specialityMasterId'] ?? item['speciality_master_id'] ?? item['id'] ?? item['specialityId'];
                            return { stateCode: '', specialityIds: [String(sid ?? '')] };
                          });
                          return mapped as unknown as AddDoctorType['licenses'];
                        })(),
                    } as AddDoctorType;
                    setSelectedDoctor(mapped);
                    setShowModal(true);
                  }}
                >
                  <Pencil size={18} strokeWidth={2} className={styles.iconEdit} />
                </button>
                {/* Edit Specialties removed per request */}
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
              <strong>Gender:</strong> {formatGender(doc?.doctorGender ?? doc?.gender)}
            </div>

            <div className={`${localStyles.info} ${localStyles.passwordRow}`}>
              <strong>Password:</strong>
              {(() => {
                const idKey = String(doc?.doctorMasterId ?? i);
                const visible = !!visiblePasswords[idKey];
                const display = visible ? String(doc?.doctorPassword ?? '') : '••••••';
                return (
                  <>
                    <span className={localStyles.passwordValue}>{display}</span>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(idKey)}
                      className={styles.iconButton}
                      aria-label={visible ? 'Hide password' : 'Show password'}
                    >
                      {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </>
                );
              })()}
            </div>

            <div>
              {/* compute total licenses (sum of speciality ids across licenses or fallback to flat list) */}
              {(() => {
                const licensesRaw = ((doc as BackendDoctor).licenses ?? []) as unknown[];
                let totalLicenses = 0;
                const statesSet = new Set<string>();
                if (licensesRaw.length > 0) {
                  for (const licObj of licensesRaw) {
                    const lic = licObj as Record<string, unknown>;
                    const stateCode = String(lic['stateCode'] ?? lic['state_code'] ?? '').trim();
                    if (stateCode) statesSet.add(stateCode);
                    const specIds = Array.isArray(lic['specialityIds']) ? (lic['specialityIds'] as unknown[]) : (Array.isArray(lic['speciality_list']) ? (lic['speciality_list'] as unknown[]) : []);
                    totalLicenses += specIds.length;
                  }
                } else {
                  totalLicenses = ((doc?.speciality ?? []) as SpecialityItem[]).length;
                }
                const statesCount = statesSet.size;
                return (
                  <div className={localStyles.sectionTitle}>
                    <strong>Licenses :</strong>
                    <span className={localStyles.countLabel} style={{ marginLeft: 8 }}>States</span>
                    <span style={{ marginLeft: 6 }} className={styles.badge}>{statesCount}</span>
                    <span className={localStyles.countLabel} style={{ marginLeft: 10 }}>Licenses</span>
                    <span style={{ marginLeft: 6 }} className={styles.badge}>{totalLicenses}</span>
                  </div>
                );
              })()}
              <div>
                {(((doc as BackendDoctor).licenses ?? []) as unknown[]).length > 0 ? (
                  (((doc as BackendDoctor).licenses ?? []) as unknown[]).map((licObj: unknown, idx: number) => {
                    const lic = licObj as Record<string, unknown>;
                    const stateCode = String(lic['stateCode'] ?? lic['state_code'] ?? '');
                    const stateRec = statesList.find(s => String(s['stateCode'] ?? s['state_code'] ?? '') === stateCode);
                    const stateName = stateRec ? String(stateRec['stateName'] ?? stateRec['state_name'] ?? stateRec['name'] ?? stateCode) : (stateCode || 'No state');
                    const specIds = Array.isArray(lic['specialityIds']) ? lic['specialityIds'] as unknown[] : (Array.isArray(lic['speciality_list']) ? lic['speciality_list'] as unknown[] : []);
                    const specNames = specIds.map((sid: unknown) => {
                      const sidStr = String(sid ?? '');
                      const specRec = specialitiesList.find(sp => String(sp['specialityMasterId'] ?? sp['speciality_master_id'] ?? sp['id'] ?? sp['code'] ?? '') === sidStr);
                      return specRec ? String(specRec['specialityName'] ?? specRec['speciality_name'] ?? specRec['name'] ?? sidStr) : sidStr;
                    });
                    return (
                      <div key={String(idx) + '-' + stateCode} className={localStyles.licenseLine}>
                        <span className={localStyles.licenseState}>{stateName} :</span>
                        <div className={localStyles.badgesWrap}>
                          {specNames.map((sname, si) => (
                            <span key={si} className={styles.badge}>{sname}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={localStyles.licenseLine}>
                    <span className={localStyles.licenseState}>Specialties :</span>
                    <div className={localStyles.badgesWrap}>
                      {(((doc?.speciality ?? []) as SpecialityItem[]).map(l => String(l?.specialityName ?? l?.speciality ?? l?.name ?? ''))).length > 0 ? (
                        (((doc?.speciality ?? []) as SpecialityItem[]).map(l => String(l?.specialityName ?? l?.speciality ?? l?.name ?? ''))).map((n, ni) => (
                          <span key={ni} className={styles.badge}>{n}</span>
                        ))
                      ) : (
                        <span className={localStyles.licenseSpecs}>None</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorTable;
