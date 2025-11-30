"use client";
import React, { useRef, useState, useEffect } from 'react'
import DoctorDashboardHeader from "@/components/DoctorDashboard/DoctorDashboardHeader/DoctorDashboardHeader";
import { NextPage } from 'next';
import styles from './doctordashboard.module.scss';
import DoctorSchedule from "@/components/DoctorDashboard/Schedule/DoctorSchedule/DoctorSchedule";
import SetDoctorAvailability from '@/components/DoctorDashboard/SetAvailability/SetDoctorAvailabilityView/SetDoctorAvailabilityView';
import AppointmentNotesView from '@/components/DoctorDashboard/AppointmentsNotes/AppointmentNotesView/AppointmentNotesView';
import { useRoleAuth } from "@/hooks/useRoleAuth";
import { getDoctorById, setDoctorAvailability } from '@/lib/api';
import { mapDoctorAPIToDoctor } from '@/utils/mapper';
import { Doctor, FacilitySpeciality } from '@/types/doctor';
import { logoutUser } from '@/lib/auth';
import { LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { calculateDiffHours, convertTo24HourWithSeconds } from '@/utils/utils';
import { DoctorAvailabilityRequest, FacilityAvailabilityUI } from "@/types/doctor";

type Props = {
}

const DoctorDashboardPage: NextPage<Props> = () => {
   const [activeTab, setActiveTab] = useState("My Schedule");
    const { authorized, loading, userId, role } = useRoleAuth({ allowedRoles: ['doctor'] });
    const [doctor, setDoctor] = useState<Doctor>(null as unknown as Doctor);
    const [isDoctorLoading, setIsDoctorLoading] = useState(true);
    const [availabilityList, setAvailabilityList] = useState<FacilityAvailabilityUI[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedFacility, setSelectedFacility] = useState<FacilityAvailabilityUI>({facilityId: "",  availableDate: "", availableStartTime: "", availableEndTime: "", facilityName: "",  speciality: [],  facilityStreet: "",  stateName: ""});


    useEffect(() => {
     if (!userId) return;

    const numericId = Number(userId);
    if (isNaN(numericId)) {
      console.error("Invalid doctorId");
      return;
    }

     const fetchDoctor = async () => {
    try {
      setIsDoctorLoading(true);

      const response = await getDoctorById(numericId); 
      const mappedDoctor = mapDoctorAPIToDoctor(response);
      setDoctor(mappedDoctor);
      console.log("Fetched doctor:", mappedDoctor);

    } catch (error) {
      console.error("Failed to fetch doctor:", error);
    } finally {
      setIsDoctorLoading(false);
    }
  };

  fetchDoctor();
  }, [userId]);

   const onDateChange = (date: string) => {
    console.log("Selected date from child:", date);
    setSelectedDate(date);
  };

  
const handleSelectFacility = (facility: FacilityAvailabilityUI) => {
  console.log("Selected facility from child:", facility);
  setSelectedFacility(facility);
};

  const handleSetAvailabilitySubmit = async (startTime: string, endTime: string) => {
  const hoursDiff = calculateDiffHours(startTime, endTime);
  console.log("Calculated hours difference:", hoursDiff);
  console.log("Start Time:", startTime, "End Time:", endTime);
  if (hoursDiff < 4) {
    toast.error("Working hours must be at least 4 hours.");
    return;
  } 
  setAvailabilityList((prev) => {
    const filtered = prev.filter(
      (item) => !(item.facilityId === selectedFacility.facilityId && item.availableDate === selectedDate)
    );

       // Add new entry with facility name + speciality
  const updated: FacilityAvailabilityUI[] = [
    ...filtered,
    {
      availableDate: selectedDate,
      facilityId: selectedFacility.facilityId,
      availableStartTime: startTime,
      availableEndTime: endTime,
      facilityName: selectedFacility.facilityName,
      speciality: selectedFacility.speciality,
      facilityStreet: selectedFacility.facilityStreet || "",
      stateName: selectedFacility.stateName || "",
    },
  ];

    console.log("Updated availability list (inside setState):", updated); // ✅ log correctly
    return updated;
  });

  toast.success("Availability added to draft list!" );

}
const handleSaveAvailability = async () => {
  const payload: DoctorAvailabilityRequest = {
    doctorId: doctor.doctorId,
    facilityList: availabilityList.map((item) => ({
      facilityId: item.facilityId,
      availableDate: item.availableDate,
      availableStartTime: convertTo24HourWithSeconds(item.availableStartTime),
      availableEndTime: convertTo24HourWithSeconds(item.availableEndTime),
    })),
  };
  console.log("Saving availability with payload:", payload);
  try {
    const response = await setDoctorAvailability(payload);

    toast.success("Availability saved successfully!");
    console.log("Set availability response:", response);
    return response;

  } catch (err) {
    console.error(err);
    toast.error("Failed to save availability.");
  }
};


    const handleDeleteDraft = (index: number) => {
    setAvailabilityList(prev => prev.filter((_, i) => i !== index));
  };


  const handleSignOut = async () => {
   logoutUser("/doctor/login");
  };
  if (loading || isDoctorLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  if (!authorized) return null; 
    const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
    console.log("Active Tab:", tabLabel);
  };
  return (
     <div className={`${styles.doctorDashboard} theme-doctor`} style={{ background: 'var(--bg-page)' }}>
       <div className={styles.dashboardHeaderSection}>
         <div className={styles.doctorInfo}>
        <h1 className={styles.welcomeText}>
        Welcome, Dr. {doctor?.doctorName}
      </h1>
      <p className={styles.specialitiesText}>
        {Array.from(
              new Set(
                doctor?.doctorStateSpeciality
                  ?.flatMap(s => s.specialityList.map(sp => sp.specialityName)) || []
              )
            ).join(", ")}
        </p>
    </div>

    {/* RIGHT SIDE — Logout */}
     <button className={styles.logoutButton} onClick={handleSignOut}>
        <LogOut size={18} className="mr-2" />
      Logout
     </button>
    </div>
    <DoctorDashboardHeader 
      activeTab={activeTab}
      onTabClick={handleTabClick} 
    />
      <div>
        {activeTab === "My Schedule" && <DoctorSchedule/>}
        {activeTab === "Set Availability" && <SetDoctorAvailability onDelete={handleDeleteDraft} selectedDate = {selectedDate} selectedFacilityId = {selectedFacility.facilityId} onDateChange = {onDateChange} doctor={doctor} handleFacilityChange={handleSelectFacility} handleSetAvailabilitySubmit={handleSetAvailabilitySubmit} availabilityList = {availabilityList} handleSaveAvailabilitySubmit={handleSaveAvailability} />}
        {activeTab === "Appointments & Notes" && <AppointmentNotesView/>}
      </div>
  </div>
  );
};

export default DoctorDashboardPage;