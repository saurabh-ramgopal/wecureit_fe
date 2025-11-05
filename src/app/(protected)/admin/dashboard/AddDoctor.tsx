"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddDoctor.module.scss";
import { X, Info, Plus, Trash2 } from "lucide-react";
import { getStates, getSpecialities } from "../../../../lib/api";

export interface License {
  stateId: string;
  specialityId: string;
  licenseNumber: string;
}

export interface Doctor {
  id?: string;
  name?: string;
  email?: string;
  gender?: string;
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
  const [gender, setGender] = useState<string>(doctor?.gender ?? "");
  const [licenses, setLicenses] = useState<License[]>(
    doctor?.licenses?.length
      ? (doctor.licenses as License[])
      : [{ stateId: "", specialityId: "", licenseNumber: "" }]
  );
  const [states, setStates] = useState<Array<Record<string, unknown>>>([]);
  const [specialities, setSpecialities] = useState<Array<Record<string, unknown>>>([]);
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
      it["id"] ??
      it["specialityMasterId"] ??
      it["speciality_master_id"] ??
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
      setLicenses(
        doctor.licenses?.length
          ? doctor.licenses.map((l) => ({
              stateId: l.stateId,
              specialityId: l.specialityId,
              licenseNumber: l.licenseNumber,
            }))
          : [{ stateId: "", specialityId: "", licenseNumber: "" }]
      );
    } else if (mode === "create") {
      setFullName("");
      setEmail("");
      setPassword("");
      setGender("");
      setLicenses([{ stateId: "", specialityId: "", licenseNumber: "" }]);
    }
  }, [doctor, mode]);

  // --- Add / remove / change license blocks ---
  const handleAddLicense = () => {
    setLicenses([...licenses, { stateId: "", specialityId: "", licenseNumber: "" }]);
  };

  const handleRemoveLicense = (index: number) => {
    const updated = licenses.filter((_, i) => i !== index);
    setLicenses(updated);
  };

  const handleLicenseChange = (index: number, field: keyof License, value: string) => {
    const updated = [...licenses];
    updated[index][field] = value;
    setLicenses(updated);
  };

  // --- Handle Submit ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: fullName,
      email,
      password: mode === "create" ? password : undefined,
      gender,
      licenses: licenses.filter(
        (l) => l.stateId && l.specialityId && l.licenseNumber
      ),
    };

    console.log(mode === "edit" ? "Editing doctor..." : "Creating doctor...", payload);

    // You can call API here: addDoctor() or updateDoctor()
    onSubmit();
    onClose();
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
            {mode === "create" && (
              <div className={styles.field}>
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="Create secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
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
              <strong>Example:</strong> Virginia license for Cardiology (License #: VA-CARD-2020-1234)
            </p>
          </div>

          {licenses.map((lic, index) => (
            <div key={index} className={styles.licenseBox}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>State</label>
                  <select
                    value={lic.stateId}
                    onChange={(e) =>
                      handleLicenseChange(index, "stateId", e.target.value)
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

                <div className={styles.field}>
                  <label>Specialty</label>
                  <select
                    value={lic.specialityId}
                    onChange={(e) =>
                      handleLicenseChange(index, "specialityId", e.target.value)
                    }
                  >
                    <option value="">Select specialty</option>
                    {specialities.map((sp) => (
                      <option key={extractId(sp)} value={extractId(sp)}>
                        {extractName(sp)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remove license button */}
                {licenses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLicense(index)}
                    className={styles.removeLicenseBtn}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className={styles.field}>
                <label>License Number *</label>
                <input
                  type="text"
                  placeholder="e.g. VA-CARD-2020-1234"
                  value={lic.licenseNumber}
                  onChange={(e) =>
                    handleLicenseChange(index, "licenseNumber", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          <div className={styles.infoNote}>
            <Info size={16} />
            <p>
              Doctors will assign their own facilities through the Doctor Portal based on their availability preferences.
            </p>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {mode === "edit" ? "Save Changes" : "Create Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
