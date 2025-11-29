"use client";
import React, { useState } from "react";
import Link from "next/link";
import BookingForm from "@/components/PatientDashboard/DropdownSelection/DropdownSelection";
import SelectionSummary from "@/components/PatientDashboard/DropdownSelection/SelectionSummary";
import styles from "@/components/PatientDashboard/DropdownSelection/DropdownSelection.module.scss";

export default function BookAppointmentPage() {
  // placeholder counts (could be wired to API later)
  const doctorsCount = 18;
  const facilitiesCount = 6;
  const specialtiesCount = 7;

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageInner}>
        <div className="mb-6">
          <Link href="/" className={styles.backLink}>← Back to Home</Link>
        </div>

        <h1 className={styles.pageTitle}>Book an Appointment</h1>
        <p className={styles.pageSubtitle}>Select your doctor, facility, and specialty to continue</p>

        <div className={styles.gridWrapper}>
          <div className={styles.leftCard}>
            <div className={styles.cardHeading}>
              <h3>Appointment Details</h3>
              <p>Choose your preferences below</p>
              <p className="text-sm text-gray-400 mb-6">Selecting any option (doctor, facility, or specialty) will automatically filter the other dropdowns to show only compatible choices.</p>
            </div>
            <BookingForm
              doctorsCount={doctorsCount}
              facilitiesCount={facilitiesCount}
              specialtiesCount={specialtiesCount}
              selectedDoctor={selectedDoctor}
              setSelectedDoctor={setSelectedDoctor}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              selectedSpecialty={selectedSpecialty}
              setSelectedSpecialty={setSelectedSpecialty}
            />
          </div>

          <div className="md:col-span-1">
            <SelectionSummary
              selectedDoctor={selectedDoctor}
              selectedFacility={selectedFacility}
              selectedSpecialty={selectedSpecialty}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
