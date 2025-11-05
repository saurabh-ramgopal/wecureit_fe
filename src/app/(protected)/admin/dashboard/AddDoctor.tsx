"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddDoctor.module.scss";
import { X, Info, Plus, Trash2 } from "lucide-react";
import { getStates, getSpecialities } from "../../../../lib/api";

interface AddDoctorModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

const AddDoctor: React.FC<AddDoctorModalProps> = ({ onClose, onSubmit }) => {
  const [states, setStates] = useState<Array<Record<string, unknown>>>([]);
  const [specialities, setSpecialities] = useState<Array<Record<string, unknown>>>([]);
  const [licenses, setLicenses] = useState([
    { stateId: "", specialityId: "", licenseNumber: "" },
  ]);

  // Helpers for backend shape differences
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

  // Fetch state + speciality lists
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

  // 🧩 Add / Remove license functionality
  const handleAddLicense = () => {
    setLicenses([...licenses, { stateId: "", specialityId: "", licenseNumber: "" }]);
  };

  const handleRemoveLicense = (index: number) => {
    const updated = licenses.filter((_, i) => i !== index);
    setLicenses(updated);
  };

  const handleLicenseChange = (index: number, field: string, value: string) => {
    const updated = [...licenses];
    (updated[index] as any)[field] = value;
    setLicenses(updated);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add New Doctor</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <p className={styles.subtext}>
          Create a new doctor account with state licenses (doctors assign their own facilities).
        </p>

        <form className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Full Name *</label>
              <input type="text" placeholder="Dr. John Smith" />
            </div>
            <div className={styles.field}>
              <label>Email *</label>
              <input type="email" placeholder="john.smith@hospital.com" />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Password *</label>
              <input type="password" placeholder="Create secure password" />
            </div>
            <div className={styles.field}>
              <label>Gender *</label>
              <select>
                <option>Select gender</option>
                <option>Female</option>
                <option>Male</option>
              </select>
            </div>
          </div>

          {/* ===== State License Section with Add Button ===== */}
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

          {/* 🧩 Render Dynamic License Blocks */}
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
                    {states.length === 0 ? (
                      <option value="" disabled>
                        No states available
                      </option>
                    ) : (
                      states.map((s) => (
                        <option key={extractId(s)} value={extractId(s)}>
                          {extractName(s)}
                        </option>
                      ))
                    )}
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
                    {specialities.length === 0 ? (
                      <option value="" disabled>
                        No specialities available
                      </option>
                    ) : (
                      specialities.map((sp) => (
                        <option key={extractId(sp)} value={extractId(sp)}>
                          {extractName(sp)}
                        </option>
                      ))
                    )}
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
                  value={lic.licenseNumber}
                  onChange={(e) =>
                    handleLicenseChange(index, "licenseNumber", e.target.value)
                  }
                  placeholder="e.g. VA-CARD-2020-1234"
                />
              </div>
            </div>
          ))}

          <div className={styles.infoNote}>
            <Info size={16} />
            <p>
              Doctors will assign their own facilities through the Doctor Portal
              based on their availability preferences.
            </p>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={onSubmit}
              className={styles.submitBtn}
            >
              Create Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
