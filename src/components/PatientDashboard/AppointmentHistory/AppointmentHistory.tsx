import React, { useState, useEffect } from "react";
import styles from "@/components/PatientDashboard/AppointmentHistory/AppointmentHistory.module.scss";
import { Calendar, Clock, MapPin, UserCheck, FileText } from "lucide-react";
import { getPatientById } from "@/lib/api";

type Appointment = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  doctor: string;
  facility: string;
  speciality: string;
  appointmentNotes: string | null;
};
type BackendAppointment = {
  id: number;
  doctorName: string;
  speciality: string;
  appointmentDate: string; // "2025-12-07"
  startTime: string; // "08:30:00"
  endTime: string; // "08:45:00"
  facilityName: string;
  appointmentNotes: string | null;
};
type CancelledAppointment = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  doctor: string;
  facility: string;
  speciality: string;
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
    month: "short", // Oct
    day: "2-digit", // 27
    year: "numeric", // 2025
  });
};

const mapBackendToFrontend = (data: BackendAppointment[]): Appointment[] => {
  return data.map((item) => ({
    id: item.id,
    date: formatDate(item.appointmentDate),
    startTime: formatTime(item.startTime),
    endTime: formatTime(item.endTime),
    doctor: item.doctorName,
    facility: item.facilityName,
    speciality: item.speciality,
    appointmentNotes: item.appointmentNotes ?? null,
  }));
};

type PatientHomeProps = {
  patientId?: string;
};

export default function PatientHome({ patientId }: PatientHomeProps) {
  const [patientData, setPatientData] = useState<unknown>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cancelledAppointments, setCancelledAppointments] = useState<
    CancelledAppointment[]
  >([]);

  const fetchOldAppointments = async () => {
    if (!patientId) return;

    const apiBase = (
      process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"
    ).replace(/\/$/, "");
    const url = `${apiBase}/patient/oldAppointments?patientId=${encodeURIComponent(
      patientId
    )}`;

    const res = await fetch(url, { credentials: "include" });

    if (!res.ok) {
      throw new Error(`Failed to fetch appointments: ${res.status}`);
    }

    const backendData: BackendAppointment[] = await res.json();
    const formatted = mapBackendToFrontend(backendData);

    setAppointments(formatted);
  };

  const fetchCancelledAppointments = async () => {
    if (!patientId) return;

    const apiBase = (
      process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"
    ).replace(/\/$/, "");
    const url = `${apiBase}/patient/cancelledAppointments?patientId=${encodeURIComponent(
      patientId
    )}`;

    const res = await fetch(url, { credentials: "include" });

    if (!res.ok) {
      throw new Error(`Failed to fetch cancelled appointments: ${res.status}`);
    }

    const backendData: BackendAppointment[] = await res.json();
    const formatted = mapBackendToFrontend(backendData);

    setCancelledAppointments(formatted);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Fetch patient data
        if (patientId) {
          const data = await getPatientById(Number(patientId));
          console.log("Patient data:", data);
          if (mounted) setPatientData(data);
        }
        await fetchOldAppointments();
      } catch (e) {
        console.error("Error fetching data", e);
        // if (mounted) setHasCard(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [patientId]);

  // Old Appointments

  return (
    <div className={styles.container}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <h2>Appointment History</h2>
        <p>View your past appointments and medical records</p>
      </div>

      {/* Old Appointments */}
      <div className={styles.upcoming}>
        <div className={styles.upcomingCard}>
          <div className={styles.apptHeader}>
            <div>
              <h4 className={styles.upcomingTitle}>Past Appointments</h4>
              <p className={styles.subtitle}>Your previous visits</p>
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
                          {
                            icon: <Clock size={18} />,
                            label: `${a.startTime} - ${a.endTime}`,
                          },

                          { icon: <UserCheck size={18} />, label: a.doctor },
                          { icon: <MapPin size={18} />, label: a.facility },
                        ].map((item, idx) => (
                          <div key={idx} className={styles.infoRow}>
                            {item.icon}
                            <span className={styles.fontMedium}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className={styles.rightText}>
                        {a.speciality && (
                          <div className={styles.deptBadge}>{a.speciality}</div>
                        )}
                      </div>
                    </div>

                    {a.appointmentNotes && (
                      <div className={styles.clinicalNotes}>
                        <div className={styles.clinicalHeader}>
                          <FileText size={16} />
                          <span>Doctor’s Notes</span>
                        </div>
                        <div className={styles.clinicalText}>
                          {a.appointmentNotes}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancelled Appointments */}
      <div className={styles.upcoming}>
        <div className={styles.upcomingCard}>
          <div className={styles.apptHeader}>
            <div>
              <h4 className={styles.upcomingTitle}>Cancelled Appointments</h4>
              <p className={styles.subtitle}>Your cancelled visits</p>
            </div>
            <div className={styles.countBadge}>
              {cancelledAppointments.length}
            </div>
          </div>

          <div className={styles.upcomingInner}>
            <div className={styles.upcomingCardInner}>
              <div className={styles.stackSpacing}>
                {cancelledAppointments.map((ca) => (
                  <div key={ca.id} className={styles.apptCard}>
                    <div className={styles.apptBody}>
                      <div className={styles.infoCol}>
                        {[
                          { icon: <Calendar size={18} />, label: ca.date },
                          {
                            icon: <Clock size={18} />,
                            label: `${ca.startTime} - ${ca.endTime}`,
                          },

                          { icon: <UserCheck size={18} />, label: ca.doctor },
                          { icon: <MapPin size={18} />, label: ca.facility },
                        ].map((item, idx) => (
                          <div key={idx} className={styles.infoRow}>
                            {item.icon}
                            <span className={styles.fontMedium}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className={styles.rightText}>
                        {ca.speciality && (
                          <div className={styles.deptBadge}>
                            {ca.speciality}
                          </div>
                        )}
                      </div>
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
