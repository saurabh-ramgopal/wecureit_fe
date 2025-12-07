"use client";
import React, { useRef, useState, useEffect } from 'react'
import DoctorDashboardHeader from "@/components/DoctorDashboard/DoctorDashboardHeader/DoctorDashboardHeader";
import { NextPage } from 'next';
import styles from './doctordashboard.module.scss';
import DoctorSchedule from "@/components/DoctorDashboard/Schedule/DoctorSchedule/DoctorSchedule";
import SetDoctorAvailability from '@/components/DoctorDashboard/SetAvailability/SetDoctorAvailabilityView/SetDoctorAvailabilityView';
import AppointmentNotesView from '@/components/DoctorDashboard/AppointmentsNotes/AppointmentNotesView/AppointmentNotesView';
import { useRoleAuth } from "@/hooks/useRoleAuth";
import { getDoctorById, setDoctorAvailability, getDoctorSchedule, getDoctorPastAppointments,getSavedDoctorAvailability, saveNotes } from '@/lib/api';
import { mapDoctorAPIToDoctor, mapDoctorPastAppointments, mapDoctorSchedule } from '@/utils/mapper';
import { Doctor, DoctorAvailability, DoctorPastAppointmentsUI, ScheduleDayUI,FacilityAvailabilityUI, SaveAvailabilityResponse } from '@/types/doctor';
import { logoutUser } from '@/lib/auth';
import { LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { calculateDiffHours, convertTo24HourWithSeconds } from '@/utils/utils';


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
    const [doctorSchedule, setDoctorSchedule] = useState<ScheduleDayUI[]>([]);
    const [doctorPastAppointments, setDoctorPastAppointments] = useState<DoctorPastAppointmentsUI[]>([]);
    const [savedAvailability, setSavedAvailability] = useState<SaveAvailabilityResponse | null>(null);
    
     const handleTabClick = async (tabLabel: string) => {
      setActiveTab(tabLabel);
      try {
          switch (tabLabel) {
            case "My Schedule":
              await fetchDoctorSchedule(Number(userId));
              break;
            case "Set Availability":
              await fetchSavedAvailability(Number(userId));
              break;
            case "Appointments & Notes":
              await fetchPastAppointments(Number(userId));
              break;
            default:
              break;
          }
        } catch (error) {
          console.error(`Failed to fetch data for tab "${tabLabel}":`, error);
        }

  };
    const fetchDoctor = async (doctorId: number) => {
    try {
      const response = await getDoctorById(doctorId); 
      const mappedDoctor = mapDoctorAPIToDoctor(response);
      setDoctor(mappedDoctor);
      console.log("Fetched doctor:", mappedDoctor);

    } catch (error) {
      console.error("Failed to fetch doctor:", error);
    } 
  }
        
   const fetchDoctorSchedule = async (doctorId: number) =>{
    try{
      const scheduleRes = await getDoctorSchedule(doctorId);
      const mappedSchedule = mapDoctorSchedule(scheduleRes);
      console.log("Fetched doctor schedule", scheduleRes);
      console.log("Mapped doctor schedule:", mappedSchedule);
      setDoctorSchedule(mappedSchedule);
    }
    catch(error){
       console.error("Failed to fetch doctor schedule:", error);
    }
   }
  
   const fetchPastAppointments = async(doctorId : number) =>{
    try{
      const appointmentsRes = await getDoctorPastAppointments(doctorId);
      const mappedAppointments = mapDoctorPastAppointments(appointmentsRes);
      console.log("Fetched past appointments", appointmentsRes);
      console.log("Mapped doctor past appointments:", mappedAppointments);
      setDoctorPastAppointments(mappedAppointments);
    }
    catch(error){
         console.error("Failed to fetch doctor past appointments:", error);
    }
   }
   const fetchSavedAvailability = async(doctorId: number) =>{
    try{
      const savedAvailabilityRes = await getSavedDoctorAvailability(doctorId);
      console.log("Fetched saved availability:", savedAvailabilityRes);
      setSavedAvailability(savedAvailabilityRes);
    }
    catch(error){
     console.error("Failed to fetch doctor saved availability:", error);
    }
   }

  useEffect(() => {
          if (!userId) return;
          const numericId = Number(userId);
          if (isNaN(numericId)) {
            console.error("Invalid doctorId");
            return;
          }
          const fetchData = async () => {
            setIsDoctorLoading(true);
            try {
              await fetchDoctor(numericId);              
              await fetchDoctorSchedule(numericId);      
              await fetchPastAppointments(numericId);    
              await fetchSavedAvailability(numericId);
            } catch (error) {
              console.error("Failed to fetch doctor data:", error);
            } finally {
              setIsDoctorLoading(false); 
            }
          };

          fetchData();
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

    console.log("Updated availability list (inside setState):", updated); 
    return updated;
  });

  toast.success("Availability added to draft list!" );

}

  const handleEditAvailabilitySubmit = async (startTime: string, endTime: string) => {
    console.log("Handle Edit Availability Clicked");
    toast.success("Successfully updated the availability" );
}

const handleDeleteAvailabilitySubmit = async(facilityID: string, isActive: boolean) => {
      console.log("Handle Delete Availability Clicked", facilityID);
}

const handleSaveNotes= async (appointmentID: string,  notes: string ) => {
    const payload = {
    appointmentId: appointmentID,
    appointmentNote: notes,
  };
  try { 
  await saveNotes(payload);
  toast.success("Notes Saved Successfully!");
  await fetchPastAppointments(Number(userId));
} catch (error) {
  console.error("Failed to save notes:", error);
  toast.error("Failed to save notes");
}   
}

const handleSaveAvailability = async () => {
  const payload: DoctorAvailability = {
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
    setAvailabilityList([]);
    fetchSavedAvailability(doctor.doctorId).catch(err => {
    console.error("Failed to refresh saved availability:", err);
  });
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
        {activeTab === "My Schedule" && <DoctorSchedule doctorScheduleList = {doctorSchedule}/>}
        {activeTab === "Set Availability" && <SetDoctorAvailability handleEditAvailabilitySubmit={handleEditAvailabilitySubmit} pastAppointmentsList={doctorSchedule} onDelete={handleDeleteDraft} selectedDate = {selectedDate} selectedFacilityId = {selectedFacility.facilityId} onDateChange = {onDateChange} doctor={doctor} handleFacilityChange={handleSelectFacility} handleSetAvailabilitySubmit={handleSetAvailabilitySubmit} availabilityList = {availabilityList} handleSaveAvailabilitySubmit={handleSaveAvailability} savedAvailabilityList={savedAvailability?.facilityList || []}  handleDeleteAvailabilitySubmit={handleDeleteAvailabilitySubmit}/>}
        {activeTab === "Appointments & Notes" && <AppointmentNotesView doctorPastAppointments={doctorPastAppointments} onSaveNotes={handleSaveNotes} />}
      </div>
  </div>
  );
};

export default DoctorDashboardPage;