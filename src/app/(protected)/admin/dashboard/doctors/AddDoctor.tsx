"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddDoctor.module.scss";
import { X, Info, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { getStates, getSpecialities, addDoctor } from "../../../../../lib/api";

export interface License {
  stateCode: string;
  // allow multiple specialties per state
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

const AddDoctor: React.FC<AddDoctorModalProps> = ({
  mode = "create",
  doctor,
  onClose,
  onSubmit,
}) => {
  
  const [fullName, setFullName] = useState<string>(doctor?.name ?? "");
  const [email, setEmail] = useState<string>(doctor?.email ?? "");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [gender, setGender] = useState<string>(doctor?.gender ?? "");
  // Normalize incoming license structures into our License[] shape without using `any`.
  const normalizeLicenses = (input: unknown): License[] => {
    if (!Array.isArray(input)) return [{ stateCode: "", specialityIds: [] }];
    return (input as unknown[]).map((item) => {
      const l = item as Record<string, unknown>;
      const stateCode = String(l["stateCode"] ?? l["state_code"] ?? l["state"] ?? "");
      let specialityIds: string[] = [];
      if (Array.isArray(l["specialityIds"])) {
        specialityIds = (l["specialityIds"] as unknown[]).map((s) => String(s));
      } else if (l["specialityId"]) {
        specialityIds = [String(l["specialityId"])];
      }
      return { stateCode, specialityIds } as License;
    });
  };

  const [licenses, setLicenses] = useState<License[]>(
    normalizeLicenses(doctor?.licenses ?? undefined)
  );
  const [states, setStates] = useState<Array<Record<string, unknown>>>([]);
  const [specialities, setSpecialities] = useState<Array<Record<string, unknown>>>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // --- Load states & specialities from backend ---
  useEffect(() => {
    let mounted = true;
    getStates()
      .then((res: unknown) => {
        if (mounted && Array.isArray(res))
          setStates(res as Array<Record<string, unknown>>);
      })
      .catch((err: unknown) => console.error("getStates error", err));

    getSpecialities()
      .then((res: unknown) => {
        if (mounted && Array.isArray(res))
          setSpecialities(res as Array<Record<string, unknown>>);
      })
      .catch((err: unknown) => console.error("getSpecialities error", err));

    return () => {
      mounted = false;
    };
  }, []);

  // --- Extract ID & name from backend objects ---
  const extractId = (item: unknown) => {
    const it = item as Record<string, unknown>;
    const candidate =
      it["code"] ??
      it["specialityMasterId"] ??
      it["speciality_master_id"] ??
      it["stateCode"] ??
      it["state_code"] ??
      it["stateMasterId"] ??
      it["state_master_id"] ??
      it["state_id"] ??
      it["code"];
    if (candidate === undefined || candidate === null) return JSON.stringify(it);
    if (typeof candidate === "object") return JSON.stringify(candidate);
    return String(candidate);
  };

  const extractName = (item: unknown) => {
    const it = item as Record<string, unknown>;
    const candidate =
      it["name"] ??
      it["specialityName"] ??
      it["speciality_name"] ??
      it["stateName"] ??
      it["state_name"];
    if (candidate === undefined || candidate === null) return String(item);
    if (typeof candidate === "object") return JSON.stringify(candidate);
    return String(candidate);
  };

  // --- Prefill form when editing ---
  useEffect(() => {
    if (doctor && mode === "edit") {
      setFullName(doctor.name || "");
      setEmail(doctor.email || "");
      setGender(doctor.gender || "");
      setLicenses(normalizeLicenses(doctor.licenses));
  // populate password if backend provided it (allow empty string)
  setPassword(doctor.password ?? "");
    } else if (mode === "create") {
      setFullName("");
      setEmail("");
      setPassword("");
      setGender("");
      setLicenses([{ stateCode: "", specialityIds: [] }]);
    }
  }, [doctor, mode]);

  // --- Add / remove / change license blocks ---
  const handleAddLicense = () => {
    setLicenses([...licenses, { stateCode: "", specialityIds: [] }]);
  };

  const handleRemoveLicense = (index: number) => {
    const updated = licenses.filter((_, i) => i !== index);
    setLicenses(updated);
  };

  const handleLicenseChange = (index: number, field: keyof License, value: string | string[]) => {
    const updated = [...licenses];
    updated[index] = { ...updated[index], [field]: value } as License;
    setLicenses(updated);
  };

  const toggleLicenseSpeciality = (licenseIndex: number, specialityId: string) => {
    const updated = [...licenses];
    const current = new Set(updated[licenseIndex].specialityIds ?? []);
    if (current.has(specialityId)) current.delete(specialityId);
    else current.add(specialityId);
    updated[licenseIndex].specialityIds = Array.from(current);
    setLicenses(updated);
  };

  // --- Handle Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Basic client-side validation to avoid sending nulls to the backend
    if (!fullName || !fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email || !email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password || !password.trim()) {
      setError("Password is required.");
      return;
    }
    // Validate licenses: require at least one license with stateCode and at least one speciality
    const hasValidLicense = licenses.some((l) => (l.stateCode ?? "").trim() !== "" && Array.isArray(l.specialityIds) && (l.specialityIds ?? []).length > 0);
    if (!hasValidLicense) {
      setError('Please add at least one state license with one or more specialties.');
      return;
    }

    // Map to backend AddDoctorRequest shape
    const allSpecs = new Set<string>();
    licenses.forEach((l) => {
      (l.specialityIds ?? []).forEach((s) => allSpecs.add(s));
    });

    const doctorStateSpeciality = licenses.map((l) => ({
      stateCode: l.stateCode ?? "",
      specialityList: l.specialityIds ?? [],
    }));

    const payload = {
      doctorName: fullName,
      doctorEmail: email,
      doctorPassword: password,
      doctorMasterId: doctor?.doctorMasterId ?? undefined,
      doctorGender: gender,
      // include both representations for backend compatibility
      specialityList: Array.from(allSpecs),
      doctorStateSpeciality,
    } as Record<string, unknown>;

    setIsSaving(true);
    try {
      if (mode === "create") {
        await addDoctor(payload);
      } else {
        // For edit mode we still call addDoctor (backend will upsert) —
        // if your backend exposes a separate update endpoint, swap this call.
        await addDoctor(payload);
      }

      // Notify parent to refresh list and close modal
      onSubmit();
      onClose();
    } catch (err) {
      console.error('addDoctor error', err);
      setError(String((err as Error)?.message ?? err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
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

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Dr. John Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Email *</label>
              <input
                type="email"
                placeholder="john.smith@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Password *</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "create" ? "Create secure password" : "Set new password for doctor"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className={styles.passwordToggle}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className={styles.field}>
              <label>Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* --- Licenses --- */}
          <div className={styles.licenseHeader}>
            <label>State Licenses *</label>
            <button
              type="button"
              onClick={handleAddLicense}
              className={styles.addLicenseBtn}
            >
              <Plus size={16} /> Add License
            </button>
          </div>

          <div className={styles.exampleBox}>
            <Info size={16} />
            <p>
              <strong>Example:</strong> Virginia license for Cardiology
            </p>
          </div>

          {licenses.map((lic, index) => (
            <div key={index} className={styles.licenseBox}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>State</label>
                  <select
                    value={lic.stateCode}
                    onChange={(e) =>
                      handleLicenseChange(index, "stateCode", e.target.value)
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

                {/* Remove license button aligned to the row end */}
                {licenses.length > 1 && (
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveLicense(index)}
                      className={styles.removeLicenseBtn}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Render specialties table below the state select to reduce congestion */}
              <div className={styles.field}>
                <label>Specialties</label>
                <div className={styles.checkboxList}>
                  {specialities.map((sp) => {
                    const sid = extractId(sp);
                    const checked = (lic.specialityIds ?? []).includes(sid);
                    return (
                      <label key={sid} className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleLicenseSpeciality(index, sid)}
                        />
                        <span>{extractName(sp)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* License number removed per request */}
            </div>
          ))}

          <div className={styles.infoNote}>
            <Info size={16} />
            <p>
              Doctors will assign their own facilities through the Doctor Portal based on their availability preferences.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSaving}>
              {isSaving ? (mode === "edit" ? "Saving..." : "Creating...") : mode === "edit" ? "Save Changes" : "Create Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
