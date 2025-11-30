import React from "react";
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

  return (
    <div className={styles.container}>
      <div className={styles.welcomeBanner}>
        <h2>Welcome back, John!</h2>
        <p>Manage your appointments and health information</p>
      </div>

      <div className={styles.bookBox}>
        <svg
          aria-hidden
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        <h3>Need to see a doctor?</h3>
        <p>Book an appointment with our specialists</p>

        <button onClick={handleBook} className={styles.bookBtn}>
          Book New Appointment
        </button>
      </div>

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
