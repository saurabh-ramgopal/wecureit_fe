// components/NotePopup.tsx
import React from 'react';
import styles from './NotePopup.module.scss';
import { Check , X} from 'lucide-react';
import { DoctorPastAppointmentsUI } from '@/types/doctor';
interface NotePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, s: string) => void;
  patientDetails: DoctorPastAppointmentsUI

}

const NotePopup = ({ isOpen, onClose, onSave, patientDetails }: NotePopupProps) => {
  const [note, setNote] = React.useState('');

  if (!isOpen) return null;
  
  const handleSave = () => {
    onSave(patientDetails.appointmentId, note);
    setNote('');
    onClose();
  }

  return (
     <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header section */}
        <div className={styles.header}>
          <h2>Clinical Note - {patientDetails.patientName}</h2>
          <p>
            {new Date(patientDetails.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
            at {patientDetails.time}
          </p>
         <div className={styles.patientInfo}>
                <p>
                    <strong>Patient:</strong> {patientDetails.patientName}, {patientDetails.age} years old, {patientDetails.gender}
                </p>
                <p>
                    <strong>Chief Complaint:</strong> {patientDetails.complaint}
                </p>
                </div>
        </div>

        {/* Textarea for notes */}
        <div className={styles.noteSection}>
                    <label htmlFor="clinicalNotes" className={styles.textareaLabel}>
                        Clinical Notes
                    </label>
                    <textarea
                        id="clinicalNotes"
                        rows={8}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={`Enter your clinical notes here...

                    Example format:
                    - Chief Complaint:
                    - History of Present Illness:
                    - Physical Examination:
                    - Assessment:
                    - Plan:`}
                        className={styles.textarea}
                    />
                    </div>


        {/* Action buttons */}
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            <X size={16} className={styles.icon} /> Cancel
          </button>
          <button onClick={handleSave} className={styles.saveBtn} disabled={!note.trim()}>
            <Check size={16} className={styles.icon} /> Save
          </button>
        </div>
      </div>
    </div>
  );
};
  

export default NotePopup;
