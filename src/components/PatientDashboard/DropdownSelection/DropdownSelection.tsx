"use client";
import React from "react";
import { FiUser, FiMapPin } from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa";
import styles from "./DropdownSelection.module.scss";
import { AllDoctorUI, AllFacilityUI,AllSpecialitiesRespUI } from "@/types/patient";
import { useDropdownSelection } from "./DropdownSelectionContext";
type DropDownSelectionProps = {
  allDoctors?: AllDoctorUI[];
  selectedDoctor?: AllDoctorUI | null;
  setSelectedDoctor?: (doctor: AllDoctorUI | null) => void;
  allFacilities?: AllFacilityUI[];
  setSelectedFacility?: (facility: AllFacilityUI | null) => void;
  selectedFacility?: AllFacilityUI | null;
  selectedSpecialty?: AllSpecialitiesRespUI | null;
  allSpecialities?: AllSpecialitiesRespUI[];
  setSelectedSpecialty?: (speciality: AllSpecialitiesRespUI | null) => void;
  fetchCascadingOptions?: (body: {
    doctorMasterId: number | null;
    specialityMasterId: string | null;
    facilityMasterId: string | null;
  }) => Promise<void>;
  handleClearSelection?: () => void;
};

export default function DropDownSelectionProps(props: DropDownSelectionProps) {
  const ctx = useDropdownSelection();
  const allFacilities = ctx?.allFacilities ?? props.allFacilities ?? [];
  const setAllFacilities = ctx?.setAllFacilities ?? (() => {});
  const allDoctors = ctx?.allDoctors ?? props.allDoctors ?? [];
  const setAllDoctors = ctx?.setAllDoctors ?? (() =>{});
  const allSpecialities = ctx?.allSpecialities ?? props.allSpecialities ?? [];
  const setAllSpecialities = ctx?.setAllSpecialities ?? (() => {})
  const selectedDoctor = ctx?.selectedDoctor ?? props.selectedDoctor ?? null;
  const setSelectedDoctor = ctx?.setSelectedDoctor ?? props.setSelectedDoctor ?? (() => {});
  const selectedFacility = ctx?.selectedFacility ?? props.selectedFacility ?? null;
  const setSelectedFacility = ctx?.setSelectedFacility ?? props.setSelectedFacility ?? (() => {});
  const selectedSpecialty = ctx?.selectedSpecialty ?? props.selectedSpecialty ?? null;
  const setSelectedSpecialty = ctx?.setSelectedSpecialty ?? props.setSelectedSpecialty ?? (() => {});
  const fetchCascadingOptions = ctx?.fetchCascadingOptions ?? props.fetchCascadingOptions ?? (async () => {}); 

   const handleDoctorChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
      const doctor = allDoctors.find((d) => d.doctorMasterId.toString() === value);
      if (doctor) {
        setSelectedDoctor(doctor);
        await fetchCascadingOptions({
        doctorMasterId: doctor.doctorMasterId,
        specialityMasterId: selectedSpecialty?.specialityMasterId ?? null,
        facilityMasterId: selectedFacility?.facilityID ?? null,
      });
      }
    }


  const handleFacilityChange = async (e: React.ChangeEvent<HTMLSelectElement>)=> {
    const value = e.target.value;
      const facility = allFacilities.find((f) => f.facilityID.toString() === value);
      if (facility) {
        setSelectedFacility(facility);
         await fetchCascadingOptions({
          doctorMasterId: selectedDoctor?.doctorMasterId ?? null,
          specialityMasterId: selectedSpecialty?.specialityMasterId ?? null,
          facilityMasterId: facility.facilityID
      });
      }
    }

    const handleSpecialtyChange = async(e: React.ChangeEvent<HTMLSelectElement>)=> {
    const value = e.target.value;

      const specialty = allSpecialities.find((s) => s.specialityMasterId.toString() === value);
      if (specialty) {
        setSelectedSpecialty(specialty);
          await fetchCascadingOptions({
          doctorMasterId: selectedDoctor?.doctorMasterId ?? null,
          specialityMasterId: specialty.specialityMasterId,
          facilityMasterId: selectedFacility?.facilityID ?? null,
      });
      }
    }

  return (
      <div className={styles.selectionGrid}>
  <div className={styles.field}>
    <label className={styles.labelWithIcon}>
      <FiUser />
      <span>Select Doctor</span>
    </label>
    <select
       value={selectedDoctor?.doctorMasterId.toString() ?? ""}
        onChange={handleDoctorChange}
       className={styles.selectInput}
    >
      <option value="" disabled hidden>Choose a doctor</option>
        {allDoctors.map((doctor) => (
            <option key={doctor.doctorMasterId} value={doctor.doctorMasterId} hidden={!!selectedDoctor && doctor.doctorMasterId !== selectedDoctor.doctorMasterId}>
              {doctor.name}
            </option>
          ))}
    </select>
    <div className={styles.countText}>  {allDoctors && allDoctors.length > 0
    ? `${allDoctors.length} doctor${allDoctors.length > 1 ? "s" : ""} available`
    : "No doctors available"} </div>
  </div>

  <div className={styles.field}>
    <label className={styles.labelWithIcon}>
      <FiMapPin />
      <span>Select Facility</span>
    </label>
    <select
     value={selectedFacility?.facilityID.toString() ?? ""}
      onChange={handleFacilityChange}
      className={styles.selectInput}
    >
     <option value="" disabled hidden>Choose a facility</option>
        {allFacilities.map((facility) => (
            <option key={facility.facilityID} value={facility.facilityID} hidden={!!selectedFacility && facility.facilityID !== selectedFacility.facilityID} >
              {facility.facilityName}
            </option>
          ))}
    </select>
    <div className={styles.countText}>    {allFacilities && allFacilities.length > 0
    ? `${allFacilities.length} Facilit${allFacilities.length > 1 ? "ies" : "y"} available`
    : "No Facilities available"}</div>
  </div>

  <div className={styles.field}>
    <label className={styles.labelWithIcon}>
      <FaStethoscope  />
      <span>Select Specialty</span>
    </label>
    <select
       value={selectedSpecialty?.specialityMasterId.toString() ?? ""}
      onChange={handleSpecialtyChange}
      className={styles.selectInput}
    >
    <option value="" disabled hidden>Choose a specialty</option>
        {allSpecialities.map((speciality) => (
            <option key={speciality.specialityMasterId} value={speciality.specialityMasterId}  hidden={!!selectedSpecialty && speciality.specialityMasterId !== selectedSpecialty.specialityMasterId} >
              {speciality.specialityName}
            </option>
          ))}
    </select>
    <div className={styles.countText}> {allSpecialities && allSpecialities.length > 0
    ? `${allSpecialities.length} Specialit${allSpecialities.length > 1 ? "ies" : "y"} available`
    : "No Specialities available"}</div>
  </div>
           <div className={styles.clearButtonWrapper}>
            <button
              type="button"
              className={styles.clearButton}
               disabled={
                  !selectedDoctor?.doctorMasterId &&
                  !selectedFacility?.facilityID &&
                  !selectedSpecialty?.specialityMasterId
                }
               onClick={async () => {
                    setSelectedDoctor?.(null);
                    setSelectedFacility?.(null);
                    setSelectedSpecialty?.(null);
                    await props.handleClearSelection?.();
                  }}
            >
              Clear Selection
            </button>
          </div>
</div>

  );
}
