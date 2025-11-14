export interface Appointment {
  id: number;
  patientName: string;
  time: string;
  duration: string;
  reason?: string;
}

export interface Day {
  shortDate: string;
  fullDate: string;
  location: string;
  totalHours: string;
  appointments: Appointment[];
}


export interface AppointmentHistory {
  patientName: string;
  age?: string; // optional
  gender?: string; // optional
  status: string; // e.g., "Completed"
  date: string;   // e.g., "Sunday, November 2, 2025"
  time: string;   // e.g., "13:00 - 13:45"
  duration: string; // "45 min"
  complaint: string; // "Post-surgery follow-up"
  location: string; // "Downtown Medical Center"
}