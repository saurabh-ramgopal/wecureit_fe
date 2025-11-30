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

// Speciality type
export type Speciality = {
  specialityId: string;      // use this consistently
  specialityName: string;
};

// Doctor type for UI
export type Doctor = {
    doctorId: number; 
  doctorName: string;
  doctorGender: string;
  doctorEmail: string;
  firebaseUid?: string; // optional
  doctorStateSpeciality: {
    stateCode: string;
    stateName: string;
    specialityList: Speciality[];
  }[];
};

// Doctor type for API response
export type DoctorAPIResponse = {
  doctorMasterId: number;
  doctorName: string;
  doctorEmail: string;
  doctorGender: string;
  isActive: boolean;
  stateDetails: {
    stateCode: string;
    stateName: string;
    stateSpecialities: {
      specialityId: string;
      specialityName: string;
    }[];
  }[];
};

// Type for speciality inside a facility
export type FacilitySpeciality = {
  specialityMasterId: string;
  specialityName: string;
};

// Facility type for API response
export type FacilityAPIResponse = {
  facilityMasterId: string;
  facilityName: string;
  noOfRooms: number;
  facilityStreet: string;
  stateCode: string;
  stateName: string;
  isActive: boolean;
  speciality: FacilitySpeciality[];
};

export interface FacilityAvailability {
  facilityId: string;
  availableDate: string;        // format: YYYY-MM-DD
  availableStartTime: string;   // format: HH:mm:ss
  availableEndTime: string;     // format: HH:mm:ss
}

export interface DoctorAvailabilityRequest {
  doctorId: number;
  facilityList: FacilityAvailability[];
}


export interface FacilityAvailabilityUI extends FacilityAvailability {
  facilityName: string;
  speciality?: FacilitySpeciality[];
  facilityStreet?: string;  // optional
  stateName?: string;       // optional
}