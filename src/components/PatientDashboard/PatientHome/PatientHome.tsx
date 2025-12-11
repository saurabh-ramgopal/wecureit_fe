"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./PatientHome.module.scss";
import { Calendar, Clock, MapPin, UserCheck, AlertTriangle, X } from "lucide-react";
import { getPatientById } from "@/lib/api";

// UI Appointment Types (same structure for both Upcoming and Cancelled)
type AppointmentUI = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  doctor: string;
  facility: string;
  speciality: string;
  cancellationFeeNote?: string;
};

// Backend type from API
type BackendAppointment = {
  appointmentId: number;
  doctorName: string;
  speciality: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24-hour)
  endTime: string; // HH:MM (24-hour)
  facilityName: string;
  appointmentNotes: string | null;
};

// Formatters
const formatTime = (time24: string): string => {
  const [hour, minute] = time24.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
};

const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};
// Check if appointment is within next 24 hours for warning
const isWithin24Hours = (date: string, startTime: string): boolean => {
  // date = "Sun, Dec 14, 2025"
  // OR date = "Dec 14, 2025" depending on formatter
  const parsedDate = new Date(`${date} ${startTime}`);
  const now = new Date();

  const diffMs = parsedDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60); // convert ms to hours

  return diffHours <= 24; // appointment starts within 24 hours
};


// Mapper (reused for both upcoming + cancelled)
const mapBackendToFrontend = (data: BackendAppointment[]): AppointmentUI[] => {
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

type PatientHomeProps = {
  patientId?: string;
};

export default function PatientHome({ patientId }: PatientHomeProps) {
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Cancelled">("Upcoming");

  // States
  const [hasCard, setHasCard] = useState<boolean | null>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [appointments, setAppointments] = useState<AppointmentUI[]>([]);
  const [cancelledAppointments, setCancelledAppointments] = useState<AppointmentUI[]>([]);

  // Book Navigation
  const handleBook = () => router.push("/patient/dashboard/dropdownselection");

  // Cancel an appointment
  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"}/doctor/appointments/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            appointmentId: id,
            isActive: false,
          }),
        }
      );

      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      // Remove from upcoming appointments
      setAppointments((prev) => prev.filter((a) => a.id !== id));

      // Refresh cancelled list
      await fetchCancelledAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  // Check credit card availability
  const getCardAvailability = async (): Promise<boolean> => {
    if (!patientId) return false;

    const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080").replace(/\/$/, "");
    const cardUrl = `${apiBase}/cards/getcards?patientId=${encodeURIComponent(patientId)}`;

    const cardRes = await fetch(cardUrl, { credentials: "include" });
    if (!cardRes.ok) throw new Error(`Server returned ${cardRes.status}`);

    const cardData = await cardRes.json();
    return cardData.length > 0;
  };

  // Fetch upcoming appointments
  const fetchUpcomingAppointments = async () => {
    if (!patientId) return;

    const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080").replace(/\/$/, "");
    const url = `${apiBase}/patient/upcomingAppointments?patientId=${encodeURIComponent(patientId)}`;

    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch upcoming appointments`);

    const backendData: BackendAppointment[] = await res.json();
    setAppointments(mapBackendToFrontend(backendData));
  };

  // Fetch cancelled appointments
  const fetchCancelledAppointments = async () => {
    if (!patientId) return;

    const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080").replace(/\/$/, "");
    const url = `${apiBase}/patient/cancelledAppointments?patientId=${encodeURIComponent(patientId)}`;

    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch cancelled appointments`);

    const backendData: BackendAppointment[] = await res.json();
    setCancelledAppointments(mapBackendToFrontend(backendData));
  };

  // Load on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (patientId) {
          const data = await getPatientById(Number(patientId));
          if (mounted) setPatientData(data);
        }

        const cardAvailable = await getCardAvailability();
        if (mounted) setHasCard(cardAvailable);

        //refresh appointments
        await fetchUpcomingAppointments();
        await fetchCancelledAppointments();
      } catch (e) {
        console.error("Error fetching data", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [patientId]);

  // Default tab is Upcoming
  const listToDisplay = activeTab === "Upcoming" ? appointments : cancelledAppointments;

  return (
    <div className={styles.container}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <h2>Welcome, {patientData?.patientName || "Patient"}!</h2>
        <p>Manage your appointments and health information</p>
      </div>

      {/* Book Box */}
      <div className={styles.bookBox}>
        <h3>Need to see a doctor?</h3>
        <p>{hasCard ? "Book an appointment with our specialists" : "Please add a card in your profile to book an appointment."}</p>

        {hasCard && (
          <button onClick={handleBook} className={styles.bookBtn}>
            Book New Appointment
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === "Upcoming" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("Upcoming")}
        >
          Upcoming Appointments
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === "Cancelled" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("Cancelled")}
        >
          Cancelled Appointments
        </button>
      </div>

      {/* Appointment List */}
      <div className={styles.upcoming}>
        <div className={styles.upcomingCard}>
          <div className={styles.apptHeader}>
            <div>
              <h4 className={styles.upcomingTitle}>
                {activeTab === "Upcoming" ? "Upcoming Appointments" : "Cancelled Appointments"}
              </h4>
              <p className={styles.subtitle}>
                {activeTab === "Upcoming" ? "Your scheduled visits" : "Appointments you have cancelled"}
              </p>
            </div>

            <div className={styles.countBadge}>{listToDisplay.length}</div>
          </div>

          <div className={styles.upcomingInner}>
            <div className={styles.upcomingCardInner}>
              <div className={styles.stackSpacing}>
                {listToDisplay.map((a) => (
                  <div key={a.id} className={styles.apptCard}>
                    {/* Appointment Body */}
                    <div className={styles.apptBody}>
                      <div className={styles.infoCol}>
                        {[
                          { icon: <Calendar size={18} />, label: a.date },
                          { icon: <Clock size={18} />, label: `${a.startTime} - ${a.endTime}` },
                          { icon: <UserCheck size={18} />, label: a.doctor },
                          // { icon: <Clock size={18} />, label: a.speciality },
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
                    
                    {/* Cancellation Warning only for upcoming within 24 hours */}
                    {activeTab === "Upcoming" && isWithin24Hours(a.date, a.startTime) && (
                      <div className={styles.warning}>
                        <span className={styles.warnIcon}>
                          <AlertTriangle size={16} color="#F59E0B" />
                        </span>
                        <span className={styles.fontMedium}>This appointment is within the next 24 hours and has cancellation fee of $50.</span>
                      </div>
                    )}
                    {/* Cancellation Warning */}
                    {/* {a.cancellationFeeNote && (
                      <div className={styles.warning}>
                        <span className={styles.warnIcon}>
                          <AlertTriangle size={16} color="#F59E0B" />
                        </span>
                        <span className={styles.fontMedium}>{a.cancellationFeeNote}</span>
                      </div>
                    )}

                    {/* Cancel Button Only for upcoming */}
                    {activeTab === "Upcoming" && (
                      <div className={styles.marginTop3}>
                        <button onClick={() => handleCancel(a.id)} className={styles.cancelBtn}>
                          <span className={styles.cancelIcon}>
                            <X size={12} />
                          </span>
                          Cancel Appointment
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {listToDisplay.length === 0 && (
                  <p style={{ textAlign: "center", color: "#888", padding: "1rem" }}>
                    {activeTab === "Upcoming"
                      ? "No upcoming appointments."
                      : "No cancelled appointments."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
