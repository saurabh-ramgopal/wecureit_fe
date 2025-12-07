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

export interface DoctorAvailability {
  doctorId: number;
  facilityList: FacilityAvailability[];
}


export interface FacilityAvailabilityUI extends FacilityAvailability {
  facilityName: string;
  speciality?: FacilitySpeciality[];
  facilityStreet?: string; 
  stateName?: string;   
  stateCode?: string;
  
}




export interface PatientMaster {
  patientMasterId: number;
  patientName: string;
  patientEmail: string;
  patientDob: string; // YYYY-MM-DD
  patientGender: string;
  patientPhone: string;
  patientAddress: string;
}

export interface DoctorMaster {
  doctorMasterId: number;
  doctorName: string;
  doctorEmail: string;
  doctorGender: string;
  isActive: boolean;
}

export interface StateCode {
  stateCode: string;
  stateName: string;
}

export interface FacilityMaster {
  facilityMasterId: string;
  facilityName: string;
  noOfRooms: number | null;
  facilityStreet: string;
  stateCode: StateCode;
  isActive: boolean;
}

export interface DoctorFacilityAvailability {
  dfAvailabilityId: string;
  doctorMaster: DoctorMaster;
  facilityMaster: FacilityMaster;
  availableDate: string; // YYYY-MM-DD
  availableStartTime: string; // HH:mm:ss
  availableEndTime: string;   // HH:mm:ss
  isActive: boolean | null;
  isFilled: boolean | null;
}

export interface SpecialityMaster {
  specialityMasterId: string;
  specialityName: string;
}

export interface DoctorScheduleAPIAppointment {
  appointmentId: number;
  duration: number; // in minutes
  date: string; // YYYY-MM-DD
  patientMaster: PatientMaster;
  doctorFacilityAvailability: DoctorFacilityAvailability;
  startTime: string; // HH:mm:ss
  endTime: string;   // HH:mm:ss
  appointmentNotes: string | null;
  specialityMaster: SpecialityMaster | null;
  doctorMaster: DoctorMaster | null;
}
export type DoctorScheduleAPIResponse = DoctorScheduleAPIAppointment[];



export interface ScheduleDayUI {
  shortDate: string;      // e.g., "Thu, Dec 01"
  fullDate: string;       // e.g., "December 1, 2025"
  location: string;       // e.g., "Bethesda Health Center"
  totalHours: string;     // e.g., "1.0 hours"
  appointments: Appointment[];
}

export type ScheduleUI = ScheduleDayUI[];

export interface DoctorPastAppointmentsUI {
  appointmentId: string;  
  patientName: string;
  age: string;         
  gender: string;   
  date: string;        
  time: string;         
  duration: string;    
  location: string;
  complaint: string | null;
}

export interface SaveNotesRequest{
appointmentId: string;
appointmentNote: string;
}
export interface FacilityAvailabilityUIEditable
  extends FacilityAvailabilityUI {
  editable: boolean;
  dfAvailabilityId: string;
}
export interface SaveAvailabilityResponse {
  doctorId: number;
  facilityList: FacilityAvailabilityUIEditable[];
}

export interface FormattedDate{
 shortDate: string; // e.g., "Mon, Jan 1"
  fullDate: string;  // e.g., "January 1, 2024"
}

export interface EditDoctorAvailability{
  availableStartTime: string;
  availableEndTime: string;
  dfAvailabilityId: string;
}

export interface DeleteDoctorAvailability{
    dfAvailabilityId: string;
    isActive: boolean
}