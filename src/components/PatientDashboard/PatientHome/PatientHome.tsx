import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./PatientHome.module.scss";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa";

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


export default function PatientHome() {
  const router = useRouter();
  const handleBook = () => router.push("/patient/dashboard/dropdownselection");
  const handleCancel = (id: string) => console.log("Cancel appointment", id);


  // Function to get patient ID from localStorage or Firebase token claims
  const getPatientId = async (): Promise<string | null> => {
        // 1) quick-local check (set this at login)
        const fromStorage = window.localStorage.getItem('patientId');
        if (fromStorage) return fromStorage;
        try {
          const { getAuth } = await import('firebase/auth');
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            const token = await user.getIdTokenResult();
            // assuming backend set `patientMasterId` as a custom claim
            const claimId = token.claims.patientMasterId;
            if (claimId) return String(claimId);
          }
        } catch (e) {
          // ignore if firebase isn't configured here; fallback remains localStorage
          console.warn('Failed to get patientId from Firebase token claims', e);
        }

        return null;
    };

  const getCardAvailability = async () : Promise<boolean> => {

    // Simulate an API call to check card availability
    const patientId = await getPatientId();
    if (!patientId) {
      // no patient id available; treat as no card available
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const available = await getCardAvailability();
        if (mounted) setHasCard(available);
      } catch (e) {
        console.error('Error checking card availability', e);
        if (mounted) setHasCard(false);
      }
    })();
    return () => {
      mounted = false;
    };
  },);

  return (
    <div className={styles.container}>
      <div className={styles.welcomeBanner}>
        <h2>Welcome back, John!</h2>
        <p>Manage your appointments and health information</p>
      </div>


      {hasCard ? (
          <>
            <div className={styles.bookBox}>
        
              <h3>Need to see a doctor?</h3>
              <p>Book an appointment with our specialists</p>

              <button onClick={handleBook} className={styles.bookBtn}>
                Book New Appointment
              </button>
            </div>
          </>
        ): (
          <>
            <div className={styles.bookBox}>
        

              <h3>Need to see a doctor?</h3>
              <p>Please add a card in your profile to book an appointment.</p>

              {/* <button onClick={() => router.push('/patient/dashboard?tab=MyProfile')} className={styles.bookBtn}>
                Add Card
              </button> */}
            </div>
          </>
        )}
      

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
                        <div className={styles.infoRow}>
                          <FiCalendar size={18} aria-hidden />
                          <span className={styles.fontMedium}>{a.date}</span>
                        </div>

                        <div className={styles.infoRow}>
                          <FiClock size={18} aria-hidden />
                          <span>{a.time}</span>
                        </div>

                        <div className={styles.infoRow}>
                          <FaStethoscope size={18} aria-hidden />
                          <span>{a.doctor}</span>
                        </div>

                        <div className={styles.infoRow}>
                          <FiMapPin size={18} aria-hidden />
                          <span>{a.location}</span>
                        </div>
                      </div>

                      <div className={styles.rightText}>
                        {a.department && <div className={styles.deptBadge}>{a.department}</div>}
                      </div>
                    </div>

                    {a.cancellationFeeNote && (
                      <div className={styles.warning}>
                        <span className={styles.warnIcon} aria-hidden>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10.29 3.86L1.82 18a1.5 1.5 0 001.29 2.25h17.78a1.5 1.5 0 001.29-2.25L13.71 3.86a1.5 1.5 0 00-2.42 0z" fill="#F59E0B" />
                            <path d="M12 9v4" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="17" r="1" fill="#92400E" />
                          </svg>
                        </span>
                        <span className={styles.fontMedium}>{a.cancellationFeeNote}</span>
                      </div>
                    )}

                    <div className={styles.marginTop3}>
                      <button onClick={() => handleCancel(a.id)} className={styles.cancelBtn}>
                        <span className={styles.cancelIcon} aria-hidden>
                          ✖
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
