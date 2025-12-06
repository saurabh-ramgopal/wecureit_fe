import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./PatientHome.module.scss";
import { Calendar, Clock, MapPin, UserCheck,AlertTriangle, X } from "lucide-react";
import { getPatientById } from "@/lib/api";

type Appointment = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  location: string;
  department?: string;
  cancellationFeeNote?: string;
};

const sampleAppointments: Appointment[] = [
  {
    id: "1",
    date: "Mon, Oct 27, 2025",
    time: "10:00 AM - 10:30 AM",
    doctor: "Dr. Sarah Johnson",
    location: "Downtown Medical Center",
    department: "Cardiology",
    cancellationFeeNote: "Cancellation fee: $50 (within 24 hours of appointment)",
  },
];

type PatientHomeProps ={
  patientId?: string;
}


export default function PatientHome({ patientId }: PatientHomeProps)  {
  const router = useRouter();
  const handleBook = () => router.push("/patient/dashboard/dropdownselection");
  const handleCancel = (id: string) => console.log("Cancel appointment", id);

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
      } catch (e) {
        console.error('Error fetching data', e);
        if (mounted) setHasCard(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [patientId]);

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
            <div className={styles.countBadge}>{sampleAppointments.length}</div>
          </div>

          <div className={styles.upcomingInner}>
            <div className={styles.upcomingCardInner}>
              <div className={styles.stackSpacing}>
                {sampleAppointments.map((a) => (
                  <div key={a.id} className={styles.apptCard}>
                    <div className={styles.apptBody}>
                      <div className={styles.infoCol}>
                        {[
                          { icon: <Calendar size={18} />, label: a.date },
                          { icon: <Clock size={18} />, label: a.time },
                          { icon: <UserCheck size={18} />, label: a.doctor },
                          { icon: <MapPin size={18} />, label: a.location },
                        ].map((item, idx) => (
                          <div key={idx} className={styles.infoRow}>
                            {item.icon}
                            <span className={styles.fontMedium}>{item.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className={styles.rightText}>
                        {a.department && <div className={styles.deptBadge}>{a.department}</div>}
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
