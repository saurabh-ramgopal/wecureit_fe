"use client";
import React from "react";
import styles from "./AddDoctorModal.module.scss";
import { X, Plus, Info } from "lucide-react";

interface AddDoctorModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ onClose, onSubmit }) => {
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

          <label>State Licenses *</label>

          <div className={styles.exampleBox}>
            <Info size={16} />
            <p>
              <strong>Example:</strong> Virginia license for Cardiology
              (License #: VA-CARD-2020-1234)
            </p>
          </div>

          <div className={styles.licenseBox}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>State</label>
                <select>
                  <option>Select state</option>
                  <option>Virginia</option>
                  <option>Maryland</option>
                  <option>Washington DC</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Specialty</label>
                <select>
                  <option>Select specialty</option>
                  <option>Cardiology</option>
                  <option>Orthopedics</option>
                  <option>Pediatrics</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label>License Number *</label>
              <input type="text" placeholder="e.g. VA-CARD-2020-1234" />
            </div>
          </div>

          <div className={styles.infoNote}>
            <Info size={16} />
            <p>
              Doctors will assign their own facilities through the Doctor Portal based on their availability preferences.
            </p>
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" onClick={onSubmit} className={styles.submitBtn}>
              Create Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;
