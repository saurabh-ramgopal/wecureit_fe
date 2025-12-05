"use client";
import React, { createContext, useContext, useState } from "react";
import { AllDoctorUI, AllFacilityUI, AllSpecialitiesRespUI, FacilityDocL1, FetchL1Response, FetchTimeSlotResponse } from "@/types/patient";
import { fetchL1APICall , fetchL2APICall} from "@/lib/api";
import {mapAllDoctorResponse, mapAllFacilityResponse} from "@/utils/mapper";

type DropdownContextType = {
  allDoctors: AllDoctorUI[];
  allFacilities: AllFacilityUI[];
  allSpecialities: AllSpecialitiesRespUI[];
  selectedDoctor: AllDoctorUI | null;
  selectedFacility: AllFacilityUI | null;
  selectedSpecialty: AllSpecialitiesRespUI | null;
  setAllDoctors: (d: AllDoctorUI[]) => void;
  setAllFacilities: (f: AllFacilityUI[]) => void;
  setAllSpecialities: (s: AllSpecialitiesRespUI[]) => void;
  setSelectedDoctor: (d: AllDoctorUI | null) => void;
  setSelectedFacility: (f: AllFacilityUI | null) => void;
  setSelectedSpecialty: (s: AllSpecialitiesRespUI | null) => void;
  fetchCascadingOptions: (body: {
    doctorMasterId: number | null;
    specialityMasterId: string | null;
    facilityMasterId: string | null;
  }) => Promise<void>;
  // Booking summary
  selectedDate: string | null;
  selectedDuration: number | null;
  selectedTimeSlot: FetchTimeSlotResponse | null;
  selectedAvailabilityId: string | null;
  setSelectedDate: (date: string | null) => void;
  setSelectedDuration: (duration: number | null) => void;
  setSelectedTimeSlot: (slot: FetchTimeSlotResponse | null) => void;
  setSelectedAvailabilityId: (id: string | null) => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const DropdownSelectionProvider = ({
  children,
  initialDoctors = [],
  initialFacilities = [],
  initialSpecialities = [],
}: {
  children: React.ReactNode;
  initialDoctors?: AllDoctorUI[];
  initialFacilities?: AllFacilityUI[];
  initialSpecialities?: AllSpecialitiesRespUI[];
}) => {
  const [allDoctors, setAllDoctors] = useState<AllDoctorUI[]>(initialDoctors);
  const [allFacilities, setAllFacilities] = useState<AllFacilityUI[]>(initialFacilities);
  const [allSpecialities, setAllSpecialities] = useState<AllSpecialitiesRespUI[]>(initialSpecialities);

  const [selectedDoctor, setSelectedDoctor] = useState<AllDoctorUI | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<AllFacilityUI | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<AllSpecialitiesRespUI | null>(null);
  
  // Booking summary state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<FetchTimeSlotResponse | null>(null);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string | null>(null);


  const fetchCascadingOptions = async (body: {
    doctorMasterId: number | null;
    specialityMasterId: string | null;
    facilityMasterId: string | null;
  }) => {
    console.log('fetchL1 cascading selections:', body);

    try {
        const nonNullCount = [body.doctorMasterId, body.specialityMasterId, body.facilityMasterId]
      .filter((v) => v !== null).length;

    let response: any;

    if (nonNullCount === 1) {
      // Only 1 selection -> fetch L1
      response = await fetchL1APICall(body);
      console.log('L1 Response:', response);
    } else if (nonNullCount === 2) {
      // 2 selections -> fetch L2
      response = await fetchL2APICall(body);
      console.log('L2 Response:', response);
    } else {
      // No selection or all 3 selected
      console.warn('No valid fetch API for this combination', body);
      return;
    }

    // Optionally log/update dropdowns
    if (response.doctorMasterList) console.log('Doctors list:', response.doctorMasterList);
    if (response.facilityMasterList) console.log('Facilities list:', response.facilityMasterList);
    if (response.specialityMasterList) console.log('Specialities list:', response.specialityMasterList);

        // Update dropdowns only if the user has NOT selected them
    if (!selectedDoctor && Array.isArray(response.doctorMasterList)) {
      const activeDoctors = response.doctorMasterList.filter((d: any) => d.isActive !== false);
      const mappedDoctors:AllDoctorUI[] = mapAllDoctorResponse(activeDoctors);
      setAllDoctors(mappedDoctors);
    }

    if (!selectedFacility && Array.isArray(response.facilityMasterList)) {
      const activeFacilities = response.facilityMasterList.filter((f: any) => f.isActive !== false);
       const mappedFacilities: AllFacilityUI[] = mapAllFacilityResponse(activeFacilities);
      setAllFacilities(mappedFacilities);
      console.log(mappedFacilities);
    }

    if (!selectedSpecialty && Array.isArray(response.specialityMasterList)) {
      const activeSpecialities = response.specialityMasterList.filter((s: any) => s.isActive !== false);
      setAllSpecialities(activeSpecialities);
    }

  } catch (error) {
    console.error('API error:', error);
  }
};

  const value: DropdownContextType = {
    allDoctors,
    allFacilities,
    allSpecialities,
    selectedDoctor,
    selectedFacility,
    selectedSpecialty,
    setAllDoctors,
    setAllFacilities,
    setAllSpecialities,
    setSelectedDoctor,
    setSelectedFacility,
    setSelectedSpecialty,
    fetchCascadingOptions,
    // Booking summary
    selectedDate,
    selectedDuration,
    selectedTimeSlot,
    selectedAvailabilityId,
    setSelectedDate,
    setSelectedDuration,
    setSelectedTimeSlot,
    setSelectedAvailabilityId,
  };

  return <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>;
};

export const useDropdownSelection = () => {
  const ctx = useContext(DropdownContext);
  return ctx;
};

export default DropdownContext;
