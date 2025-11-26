"use client";

import React, { useEffect, useState } from "react";
import styles from "./AddDoctor.module.scss";
import { X, Info, Plus, Trash2 } from "lucide-react";
import {
  getStates,
  getSpecialities,
  addDoctor,
  updateDoctorSpeciality,
  getDoctors,
} from "../../../../../lib/api";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface License {
  stateCode: string;
  specialityIds?: string[];
}

export interface Doctor {
  code?: string;
  name?: string;
  email?: string;
  gender?: string;
  doctorMasterId?: number;
  password?: string;
  licenses?: License[];
}

interface AddDoctorModalProps {
  mode?: "create" | "edit";
  doctor?: Doctor;
  onClose: () => void;
  onSubmit: () => void;
}

const normalizeLicenses = (input: unknown): License[] => {
  if (!Array.isArray(input)) return [{ stateCode: "", specialityIds: [] }];

  return (input as unknown[]).map((raw) => {
    const obj = (raw as Record<string, unknown>) || {};
    const stateCode = String(obj['stateCode'] ?? obj['state_code'] ?? obj['state'] ?? "");

    let specialityIds: string[] = [];
    if (Array.isArray(obj['specialityIds']))
      specialityIds = (obj['specialityIds'] as unknown[]).map(String);
    else if (obj['specialityId']) specialityIds = [String(obj['specialityId'])];

    return { stateCode, specialityIds } as License;
  });
};

const extractId = (item: unknown) => {
  const it = (item as Record<string, unknown>) || {};
  return String(
    it['code'] ?? it['specialityMasterId'] ?? it['speciality_master_id'] ?? it['stateCode'] ?? it['stateMasterId'] ?? it['state_id'] ?? it['id'] ?? ''
  );
};

const extractName = (item: unknown) => {
  const it = (item as Record<string, unknown>) || {};
  return String(it['name'] ?? it['specialityName'] ?? it['speciality_name'] ?? it['stateName'] ?? it['state_name'] ?? item ?? '');
};


const generatePassword = () =>
  Array.from(window.crypto.getRandomValues(new Uint8Array(12)))
    .map((b) => (b % 36).toString(36))
    .join("") + "A1!";


const AddDoctor: React.FC<AddDoctorModalProps> = ({
  mode = "create",
  doctor,
  onClose,
  onSubmit,
}) => {
  const [fullName, setFullName] = useState(doctor?.name ?? "");
  const [email, setEmail] = useState(doctor?.email ?? "");
  const [gender, setGender] = useState(doctor?.gender ?? "");

  const [licenses, setLicenses] = useState<License[]>(
    normalizeLicenses(doctor?.licenses)
  );

  const [states, setStates] = useState<Array<Record<string, unknown>>>([]);
  const [specialities, setSpecialities] = useState<Array<Record<string, unknown>>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStates().then((res) => Array.isArray(res) && setStates(res));
    getSpecialities().then(
      (res) => Array.isArray(res) && setSpecialities(res)
    );
  }, []);


  useEffect(() => {
    if (mode === "edit" && doctor) {
      setFullName(doctor.name ?? "");
      setEmail(doctor.email ?? "");
      setGender(doctor.gender ?? "");
      setLicenses(normalizeLicenses(doctor.licenses));
    } else if (mode === "create") {
      setFullName("");
      setEmail("");
      setGender("");
      setLicenses([{ stateCode: "", specialityIds: [] }]);
    }
  }, [mode, doctor]);

  const addLicense = () =>
    setLicenses([...licenses, { stateCode: "", specialityIds: [] }]);

  const removeLicense = (i: number) =>
    setLicenses(licenses.filter((_, idx) => idx !== i));

  const updateLicense = (i: number, field: keyof License, val: string | string[]) => {
    const copy = [...licenses];
    copy[i] = { ...copy[i], [field]: val };
    setLicenses(copy);
  };

  const toggleSpeciality = (i: number, specId: string) => {
    const copy = [...licenses];
    const set = new Set(copy[i].specialityIds ?? []);
    if (set.has(specId)) set.delete(specId);
    else set.add(specId);
    copy[i].specialityIds = [...set];
    setLicenses(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) return setError("Full name is required.");
    if (!email.trim()) return setError("Email is required.");

    const validLicense = licenses.some(
      (l) =>
        l.stateCode.trim() !== "" &&
        Array.isArray(l.specialityIds) &&
        l.specialityIds.length > 0
    );
    if (!validLicense)
      return setError(
        "Please add at least one state license with at least one specialty."
      );

    const allSpecialities = new Set<string>();
    licenses.forEach((l) => l.specialityIds?.forEach((s) => allSpecialities.add(s)));

    const doctorStateSpeciality = licenses.map((l) => ({
      stateCode: l.stateCode,
      specialityList: l.specialityIds ?? [],
    }));

    setIsSaving(true);

    try {
      if (mode === "create") {
        const allDoctors = await getDoctors();
        if (
          Array.isArray(allDoctors) &&
          allDoctors.some((d: unknown) => {
            const rec = (d as Record<string, unknown>) || {};
            return String(rec['doctorEmail'] ?? rec['email'] ?? rec['doctor_email'] ?? '').toLowerCase() === email.toLowerCase();
          })
        ) {
          setIsSaving(false);
          return setError(
            "A doctor with this email already exists. Use Edit mode instead."
          );
        }

        let firebaseUid: string;
        try {
          const userCred = await createUserWithEmailAndPassword(
            auth,
            email,
            generatePassword()
          );
          firebaseUid = userCred.user.uid;
        } catch (err: unknown) {
          const code = ((err as { code?: string })?.code) ?? '';
          if (typeof code === 'string' && code.includes('email-already-in-use')) {
            setIsSaving(false);
            return setError('This email is already registered in Firebase. Please use Edit mode.');
          }
          throw err;
        }

        await addDoctor({
          doctorName: fullName,
          doctorEmail: email,
          doctorGender: gender,
          specialityList: [...allSpecialities],
          doctorStateSpeciality,
          firebaseUid,
        });
      } else {
        await updateDoctorSpeciality({
          doctorMasterId: doctor?.doctorMasterId,
          doctorStateSpeciality,
        });
      }

      onSubmit();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setError(((err as Error)?.message) ?? String(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{mode === "edit" ? "Edit Doctor" : "Add New Doctor"}</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <p className={styles.subtext}>
          {mode === "edit"
            ? "Update doctor details and licenses."
            : "Create a new doctor account with state licenses."}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Full Name *</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. John Smith"
              />
            </div>

            <div className={styles.field}>
              <label>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.smith@hospital.com"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Gender *</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select gender</option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </div>

          
          <div className={styles.licenseHeader}>
            <label>State Licenses *</label>
            <button type="button" onClick={addLicense} className={styles.addLicenseBtn}>
              <Plus size={16} /> Add License
            </button>
          </div>

          <div className={styles.exampleBox}>
            <Info size={16} />
            <p>
              <strong>Example:</strong> Virginia license for Cardiology
            </p>
          </div>

          {licenses.map((lic, i) => (
            <div key={i} className={styles.licenseBox}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>State</label>
                  <select
                    value={lic.stateCode}
                    onChange={(e) =>
                      updateLicense(i, "stateCode", e.target.value)
                    }
                  >
                    <option value="">Select state</option>
                    {states.map((s) => (
                      <option key={extractId(s)} value={extractId(s)}>
                        {extractName(s)}
                      </option>
                    ))}
                  </select>
                </div>

                {licenses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLicense(i)}
                    className={styles.removeLicenseBtn}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className={styles.field}>
                <label>Specialties</label>
                <div className={styles.checkboxList}>
                  {specialities.map((sp) => {
                    const sid = extractId(sp);
                    return (
                      <label key={sid} className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          checked={lic.specialityIds?.includes(sid)}
                          onChange={() => toggleSpeciality(i, sid)}
                        />
                        {extractName(sp)}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          <div className={styles.infoNote}>
            <Info size={16} />
            <p>
              Doctors will later assign their own facilities from the Doctor
              Portal.
            </p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSaving}>
              {isSaving
                ? mode === "edit"
                  ? "Saving..."
                  : "Creating..."
                : mode === "edit"
                ? "Save Changes"
                : "Create Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
