import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./PatientHome.module.scss";
import { Calendar, Clock, MapPin, UserCheck,AlertTriangle, X } from "lucide-react";
import { getPatientById } from "@/lib/api";

type Appointment = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  doctor: string;
  facility: string;
  speciality: string;
  cancellationFeeNote?: string;
};
type BackendAppointment = {
  appointmentId : number;
  doctorName: string;
  speciality: string;
  appointmentDate: string; // "2025-12-07"
  startTime: string;        // "08:30:00"
  endTime: string;          // "08:45:00"
  facilityName: string;
  appointmentNotes: string | null;
};
const formatTime = (time24: string): string => {
  const [hour, minute] = time24.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
};

const formatDate = (dateStr: string): string => {
  // Parsing "YYYY-MM-DD" as local date to avoid UTC offset issues
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    weekday: "short", // Mon
    month: "short",   // Oct
    day: "2-digit",   // 27
    year: "numeric",  // 2025
  });
};



const mapBackendToFrontend = (
  data: BackendAppointment[]
): Appointment[] => {
  return data.map((item) => ({
    id: item.appointmentId,
    date: formatDate(item.appointmentDate),
    startTime: formatTime(item.startTime),
    endTime: formatTime(item.endTime),
    doctor: item.doctorName,
    facility: item.facilityName,
    speciality: item.speciality,
    cancellationFeeNote: item.appointmentNotes ?? undefined,
  }));
};




type PatientHomeProps ={
  patientId?: string;
}


export default function PatientHome({ patientId }: PatientHomeProps)  {
  const router = useRouter();
  const handleBook = () => router.push("/patient/dashboard/dropdownselection");
  const handleCancel = async (id: number) => {
    //Implement cancellation logic here
    alert(`Cancel appointment with ID: ${id}`);
    try{
      const response  = await fetch (`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080'}/doctor/appointments/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          appointmentId: id,
          isActive: false}),
      });
  
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
  
      // Refresh appointments after cancellation
      // await fetchUpcomingAppointments();    
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  }
    

  const getCardAvailability = async () : Promise<boolean> => {
    if (!patientId) {
      return false;
    }
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080').replace(/\/$/, '');
    
    const cardUrl = `${apiBase}/cards/getcards?patientId=${encodeURIComponent(patientId)}`;
    const cardRes =  await fetch (cardUrl, { credentials: 'include'});

    if (!cardRes.ok) {
        throw new Error(`Server returned ${cardRes.status}`);
    }
    const cardData = await cardRes.json();
    console.log('Fetched card data:', cardData);
    if (cardData.length > 0) {
      return true;
    }
    return false;
  };

  const [hasCard, setHasCard] = useState<boolean | null>(null);
  const [patientData, setPatientData] = useState<unknown>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchUpcomingAppointments = async () => {
      if (!patientId) return;

      const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080").replace(/\/$/, "");
      const url = `${apiBase}/patient/upcomingAppointments?patientId=${encodeURIComponent(patientId)}`;

      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) {
        throw new Error(`Failed to fetch appointments: ${res.status}`);
      }

      const backendData: BackendAppointment[] = await res.json();
      const formatted = mapBackendToFrontend(backendData);

      setAppointments(formatted);
  };


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Fetch patient data
        if (patientId) {
          const data = await getPatientById(Number(patientId));
          console.log('Patient data:', data);
          if (mounted) setPatientData(data);
        }

        // Check card availability
        const available = await getCardAvailability();
        if (mounted) setHasCard(available);
        await fetchUpcomingAppointments();
      } catch (e) {
        console.error('Error fetching data', e);
        if (mounted) setHasCard(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [patientId]);


  // Upcoming Appointments

  return (


    <div className={styles.container}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <h2>Welcome, {patientData?.patientName || 'Patient'}!</h2>
        <p>Manage your appointments and health information</p>
      </div>

      {/* Debug: Display Patient Attributes */}
      {/* {patientData && (
        <div style={{ 
          background: '#f0f0f0', 
          padding: '1rem', 
          margin: '1rem 0', 
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontFamily: 'monospace'
        }}>
          <h4 style={{ marginTop: 0 }}>Patient Data (Debug):</h4>
          <pre style={{ overflow: 'auto' }}>
            {JSON.stringify(patientData, null, 2)}
          </pre>
        </div>
      )} */}

      {/* Book Appointment Box */}
      <div className={styles.bookBox}>
        <h3>Need to see a doctor?</h3>
        <p>
          {hasCard
            ? "Book an appointment with our specialists"
            : "Please add a card in your profile to book an appointment."}
        </p>

        {hasCard && (
          <button onClick={handleBook} className={styles.bookBtn}>
            Book New Appointment
          </button>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div className={styles.upcoming}>
        <div className={styles.upcomingCard}>
          <div className={styles.apptHeader}>
            <div>
              <h4 className={styles.upcomingTitle}>Upcoming Appointments</h4>
              <p className={styles.subtitle}>Your scheduled visits</p>
            </div>
            <div className={styles.countBadge}>{appointments.length}</div>
          </div>

          <div className={styles.upcomingInner}>
            <div className={styles.upcomingCardInner}>
              <div className={styles.stackSpacing}>
                {appointments.map((a) => (
                  <div key={a.id} className={styles.apptCard}>
                    <div className={styles.apptBody}>
                      <div className={styles.infoCol}>
                        {[
                          { icon: <Calendar size={18} />, label: a.date },
                          { icon: <Clock size={18} />, label: `${a.startTime} - ${a.endTime}` },
                          
                          { icon: <UserCheck size={18} />, label: a.doctor },
                          { icon: <MapPin size={18} />, label: a.facility },
                        ].map((item, idx) => (
                          <div key={idx} className={styles.infoRow}>
                            {item.icon}
                            <span className={styles.fontMedium}>{item.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className={styles.rightText}>
                        {a.speciality && <div className={styles.deptBadge}>{a.speciality}</div>}
                      </div>
                    </div>

                    {a.cancellationFeeNote && (
                      <div className={styles.warning}>
                        <span className={styles.warnIcon} aria-hidden>
                          <AlertTriangle size={16} color="#F59E0B" strokeWidth={1.5} />
                        </span>
                        <span className={styles.fontMedium}>{a.cancellationFeeNote}</span>
                      </div>
                    )}

                    <div className={styles.marginTop3}>
                      <button onClick={() => handleCancel(a.id)} className={styles.cancelBtn}>
                        <span className={styles.cancelIcon} aria-hidden>
                          <X size={12} />
                        </span>
                        Cancel Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
