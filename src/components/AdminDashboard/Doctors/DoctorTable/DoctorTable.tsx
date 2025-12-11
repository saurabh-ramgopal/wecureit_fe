"use client";

import React, { useEffect, useState } from "react";
import styles from "@/app/(protected)/admin/dashboard/AdminDashboard.module.scss";
import localStyles from "./DoctorTable.module.scss";

import AddDoctor, { type Doctor as AddDoctorType } from "../AddDoctor/AddDoctor";
import { Pencil, Trash2, UserPlus } from "lucide-react";

import {
  getDoctors,
  deleteDoctor,
  getStates,
  getSpecialities,
} from "../../../../lib/api";

const normalizeGender = (v: unknown): string => {
  if (!v) return "";
  const g = String(v).trim().toLowerCase();
  if (g.startsWith("m")) return "M";
  if (g.startsWith("f")) return "F";
  return g.charAt(0).toUpperCase();
};

const safeStr = (v: unknown) => String(v ?? "");

const extractStateCode = (rec: Record<string, unknown>) =>
  safeStr(rec["stateCode"] ?? rec["state_code"] ?? rec["state"] ?? "");

const extractSpecialityIds = (rec: Record<string, unknown>) => {
  const possibleKeys = [
    "stateSpecialities",
    "specialityIds",
    "speciality_list",
    "speciality",
    "specialities",
  ];

  for (const key of possibleKeys) {
    if (Array.isArray(rec[key])) {
      return (rec[key] as unknown[]).map((s) => {
        const r = s as Record<string, unknown>;
        return (
          r["specialityId"] ??
          r["speciality_master_id"] ??
          r["specialityMasterId"] ??
          r["id"] ??
          ""
        );
      });
    }
  }

  return [];
};

const mapDoctorToEdit = (doc: unknown): AddDoctorType => {
  const rec = (doc as Record<string, unknown>) || {};
  const genderRaw = rec['doctorGender'] ?? rec['gender'];
  const stateDetails = rec['stateDetails'];
  let licenses: AddDoctorType['licenses'] = [];

  if (Array.isArray(stateDetails) && stateDetails.length > 0) {
    licenses = (stateDetails as unknown[]).map((sd) => ({
      stateCode: extractStateCode(sd as Record<string, unknown>),
      specialityIds: extractSpecialityIds(sd as Record<string, unknown>).map(String),
    }));
  } else {
    const raw = (rec['licenses'] ?? rec['speciality'] ?? []) as unknown[];
    licenses = raw.map((s) => {
      const sRec = (s as Record<string, unknown>) || {};
      const sc = extractStateCode(sRec);
      const ids = extractSpecialityIds(sRec);
      return { stateCode: sc, specialityIds: ids.map(String) };
    });
  }

  return {
    doctorMasterId: (rec['doctorMasterId'] ?? rec['doctor_master_id']) as unknown as number | undefined,
    name: String(rec['doctorName'] ?? rec['name'] ?? ''),
    email: String(rec['doctorEmail'] ?? rec['email'] ?? ''),
    password: String(rec['doctorPassword'] ?? ''),
    gender:
      genderRaw == null
        ? ''
        : String(genderRaw).toLowerCase().startsWith('m')
        ? 'Male'
        : String(genderRaw).toLowerCase().startsWith('f')
        ? 'Female'
        : 'Other',
    licenses,
  };
};

const prettyStateName = (stateRec: unknown, fallback: string) =>
  safeStr(
    (stateRec as Record<string, unknown>)?.['stateName'] ??
      (stateRec as Record<string, unknown>)?.['state_name'] ??
      (stateRec as Record<string, unknown>)?.['name'] ??
      fallback ??
      'No state'
  );

const DoctorTable = () => {
  const [doctorsList, setDoctorsList] = useState<Array<Record<string, unknown>>>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<AddDoctorType | null>(
    null
  );

  const [statesList, setStatesList] = useState<Array<Record<string, unknown>>>([]);
  const [specialitiesList, setSpecialitiesList] = useState<Array<Record<string, unknown>>>([]);

  const refreshDoctors = async () => {
    try {
      const res = await getDoctors();
      if (Array.isArray(res)) {
        const active = res.filter((d: unknown) => {
          const r = (d as Record<string, unknown>) || {};
          return r['isActive'] !== false;
        });
        active.sort((a, b) =>
          safeStr(a?.doctorName ?? a?.name).localeCompare(
            safeStr(b?.doctorName ?? b?.name),
            undefined,
            { sensitivity: "base" }
          )
        );
        setDoctorsList(active);
      } else {
        setDoctorsList([]);
      }
    } catch (err) {
      console.error("Failed to fetch doctors", err);
      setDoctorsList([]);
    }
  };

  useEffect(() => {
    refreshDoctors();
  }, []);

  useEffect(() => {
    let mounted = true;

    getStates()
      .then((res) => mounted && Array.isArray(res) && setStatesList(res))
      .catch((err) => console.error("getStates failed", err));

    getSpecialities()
      .then((res) => mounted && Array.isArray(res) && setSpecialitiesList(res))
      .catch((err) => console.error("getSpecialities failed", err));

    return () => {
      mounted = false;
    };
  }, []);

  // Debug: Log doctorsList whenever it changes
  useEffect(() => {
    console.log("=== DOCTORS LIST DEBUG ===");
    console.log("doctorsList:", doctorsList);
    console.log("Total doctors:", doctorsList.length);
    if (doctorsList.length > 0) {
      console.log("First doctor:", doctorsList[0]);
      console.log("First doctor keys:", Object.keys(doctorsList[0]));
    }
  }, [doctorsList]);


  const handleDelete = async (doc: unknown) => {
    const rec = (doc as Record<string, unknown>) || {};
    const id = rec['doctorMasterId'] ?? rec['doctorId'] ?? rec['id'];
    const displayName = safeStr(rec['doctorName'] ?? rec['name'] ?? rec['email']);

    if (!confirm(`Delete doctor ${displayName}?`)) return;
    if (!id) return alert("Cannot delete: missing doctor id");

    try {
      console.debug("deleteDoctor payload", {
        doctorMasterId: id,
        isActive: false,
      });

      await deleteDoctor({ doctorMasterId: id, isActive: false });

      
      setDoctorsList((prev) =>
        prev.filter((d) => {
          const r = (d as Record<string, unknown>) || {};
          const did = r['doctorMasterId'] ?? r['doctorId'] ?? r['id'];
          return String(did ?? '') !== String(id ?? '');
        })
      );

      await refreshDoctors();
    } catch (err) {
      console.error("deleteDoctor failed", err);
      alert("Failed to delete doctor");
    }
  };


  return (
    <div className="w-full">
     
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Doctor Management</div>
          <div className={localStyles.headerSubtitle}>
            Create new doctor accounts and update specialties
          </div>
        </div>

        <button
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          <UserPlus size={18} /> <span>Add Doctor</span>
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

      
      <div className={localStyles.grid}>
        {doctorsList.map((doc, i) => {
          const displayName = safeStr(doc?.doctorName ?? doc?.name);
          const displayEmail = safeStr(doc?.doctorEmail ?? doc?.email);
          const isDeletable = doc?.isDeletable;

          return (
            <div key={i} className={localStyles.card}>
              <div className={localStyles.cardTop}>
                <div className={localStyles.doctorName}>{displayName}</div>

                <div className={localStyles.actions}>
                  
                  <button
                    className={styles.iconButton}
                    onClick={() => {
                      setSelectedDoctor(mapDoctorToEdit(doc));
                      setShowModal(true);
                    }}
                  >
                    <Pencil size={18} className={styles.iconEdit} />
                  </button>

                  {isDeletable !== false && (
                  <button
                    className={styles.iconButton}
                    onClick={() => handleDelete(doc)}
                  >
                    <Trash2 size={18} className={styles.iconDelete} />
                  </button>
                  )}
                </div>
              </div>

              
              <div className={localStyles.info}>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${displayEmail}`}>{displayEmail}</a>
              </div>

             
              <div className={localStyles.info}>
                <strong>Gender:</strong>{" "}
                {normalizeGender(doc?.doctorGender ?? doc?.gender)}
              </div>

              
              <div>
                {(() => {
                  const recDoc = (doc as Record<string, unknown>) || {};
                  const raw =
                    Array.isArray(recDoc['stateDetails']) && (recDoc['stateDetails'] as unknown[]).length > 0
                      ? (recDoc['stateDetails'] as unknown[])
                      : (recDoc['licenses'] as unknown[]) ?? (recDoc['speciality'] as unknown[]) ?? [];

                  if (!Array.isArray(raw) || raw.length === 0)
                    return (
                      <div className={localStyles.licenseLine}>
                        <span className={localStyles.licenseState}>
                          Specialties:
                        </span>
                        <span className={localStyles.licenseSpecs}>None</span>
                      </div>
                    );

                  return (raw as unknown[]).map((lic, idx: number) => {
                    const licRec = (lic as Record<string, unknown>) || {};
                    const stateCode = extractStateCode(licRec);
                    const stateRec = statesList.find((s) =>
                      safeStr(s['stateCode'] ?? s['state_code']) === stateCode
                    );

                    const stateName = prettyStateName(stateRec, stateCode);

                    const specIds = extractSpecialityIds(licRec);
                    const specNames = specIds.map((sid) => {
                      const s = specialitiesList.find((sp) =>
                        safeStr(
                          sp['specialityMasterId'] ?? sp['speciality_master_id'] ?? sp['id'] ?? sp['code']
                        ) === safeStr(sid)
                      );
                      return (
                        (s && (s['specialityName'] ?? s['speciality_name'] ?? s['name'])) ?? sid
                      );
                    });

                    return (
                      <div key={stateCode + '-' + idx} className={localStyles.licenseLine}>
                        <span className={localStyles.licenseState}>{stateName}:</span>
                        <div className={localStyles.badgesWrap}>
                          {specNames.length > 0 ? (
                            specNames.map((nm, i) => (
                              <span key={i} className={styles.badge}>{String(nm)}</span>
                            ))
                          ) : (
                            <span className={localStyles.licenseSpecs}>None</span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorTable;
