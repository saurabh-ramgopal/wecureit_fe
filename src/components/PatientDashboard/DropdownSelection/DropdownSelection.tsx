"use client";
import React from "react";
import { FiUser, FiMapPin } from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa";
import styles from "./DropdownSelection.module.scss";

type Props = {
  doctorsCount: number;
  facilitiesCount: number;
  specialtiesCount: number;
  selectedDoctor: string;
  setSelectedDoctor: (s: string) => void;
  selectedFacility: string;
  setSelectedFacility: (s: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (s: string) => void;
};

export default function BookingForm({
  doctorsCount,
  facilitiesCount,
  specialtiesCount,
  selectedDoctor,
  setSelectedDoctor,
  selectedFacility,
  setSelectedFacility,
  selectedSpecialty,
  setSelectedSpecialty,
}: Props) {
  return (
      <div className={styles.selectionGrid}>
  <div className={styles.field}>
    <label className={styles.labelWithIcon}>
      <FiUser className="text-red-600" />
      <span>Select Doctor</span>
    </label>
    <select
      value={selectedDoctor}
      onChange={(e) => setSelectedDoctor(e.target.value)}
      className={styles.selectInput}
    >
      <option value="">Choose a doctor</option>
      <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
      <option value="Dr. Amit Patel">Dr. Amit Patel</option>
    </select>
    <div className={styles.countText}>{doctorsCount} doctors available</div>
  </div>

  <div className={styles.field}>
    <label className={styles.labelWithIcon}>
      <FiMapPin className="text-red-600" />
      <span>Select Facility</span>
    </label>
    <select
      value={selectedFacility}
      onChange={(e) => setSelectedFacility(e.target.value)}
      className={styles.selectInput}
    >
      <option value="">Choose a facility</option>
      <option value="Downtown Medical Center">Downtown Medical Center</option>
      <option value="Westside Clinic">Westside Clinic</option>
    </select>
    <div className={styles.countText}>{facilitiesCount} facilities available</div>
  </div>

  <div className={styles.field}>
    <label className={styles.labelWithIcon}>
      <FaStethoscope className="text-red-600" />
      <span>Select Specialty</span>
    </label>
    <select
      value={selectedSpecialty}
      onChange={(e) => setSelectedSpecialty(e.target.value)}
      className={styles.selectInput}
    >
      <option value="">Choose a specialty</option>
      <option value="General Practice">General Practice</option>
      <option value="Cardiology">Cardiology</option>
    </select>
    <div className={styles.countText}>{specialtiesCount} specialties available</div>
  </div>
</div>

  );
}
