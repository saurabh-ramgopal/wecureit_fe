import { X, User, FileText, Calendar, Building2, Stethoscope } from 'lucide-react';
import styles from './PatientNotesModal.module.scss';

interface Appointment {
  doctorName: string;
  specialityName: string;
  appointmentDate: string;
  facilityName: string;
  appointmentNote?: string;
}

interface PatientData {
  patientName: string;
  patientAge: string | number;
  patientGender: string;
  history?: Appointment[];
}

interface PatientNotesModalProps {
  patientData: PatientData | null;
  onClose: () => void;
}

export default function PatientNotesModal({ patientData, onClose }: PatientNotesModalProps) {
  if (!patientData) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
                <div className={styles.modalHeader}> 
                <div className={styles.patientHeaderRow}>
                    <h2 className={styles.patientName}>
                    {patientData.patientName}
                    <span className={styles.ageBadge}>{patientData.patientAge}</span>
                    <span className={styles.genderBadge}>{patientData.patientGender}</span>
                    </h2>
                </div>
                <button onClick={onClose} className={styles.closeButton}>
                    <X size={24} />
                </button>
                </div >

        {/* History List */}
        <div className={styles.modalBody}>
          <h3>Appointment History</h3>

          {!patientData.history || patientData.history.length === 0 ? (
            <div className={styles.noHistory}>
              <FileText size={48} />
              <p>No appointment history available</p>
            </div>
          ) : (
            <div className={styles.historyList}>
              {patientData.history.map((appointment, index) => (
                <div key={index} className={styles.historyCard}>
                  <div className={styles.historyHeader}>
                    <div className={styles.doctorInfo}>
                      <div className={styles.doctorAvatar}>
                        <User size={20} />
                      </div>
                      <div>
                        <h4>{appointment.doctorName}</h4>
                        <p>
                          <Stethoscope size={14} />
                          {appointment.specialityName}
                        </p>
                      </div>
                    </div>
                    <div className={styles.appointmentDate}>
                      <Calendar size={14} />
                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  <div className={styles.facilityInfo}>
                    <Building2 size={16} />
                    <span>{appointment.facilityName}</span>
                  </div>

                  {appointment.appointmentNote && (
                    <div className={styles.note}>
                      <p>
                        <strong>Note:</strong> {appointment.appointmentNote}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
