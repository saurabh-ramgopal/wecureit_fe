
export interface AllDoctorResponseAPI {
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
}

export interface AllDoctorUI {
  doctorMasterId: number;
  name: string;
  specialities?: string[];
}

export interface AllFacilityResponseAPI {
  facilityMasterId: string;
  facilityName: string;
  noOfRooms: number;
  facilityStreet: string;
  stateCode: string;
  stateName: string;
  isActive: boolean;
  speciality: { specialityMasterId: string; specialityName: string }[];
}

export interface AllFacilityUI {
  facilityID: string;
  facilityName: string;
  street: string;
  state: string;
}

export interface AllSpecialitiesRespUI{
  specialityMasterId: string;
  specialityName: string;

}

export interface fetchL1Request{
    doctorMasterId: number | null,
    specialityMasterId:string | null,
    facilityMasterId:string | null
}

export interface FacilityStateCode {
  stateCode: string;
  stateName: string;
}

export interface FacilityItem {
  facilityMasterId: string;
  facilityName: string;
  noOfRooms: number;
  facilityStreet: string;
  stateCode: FacilityStateCode;
  isActive: boolean;
}

export interface DoctorItem {
  doctorMasterId: number;
  doctorName: string;
  doctorEmail: string;
  doctorGender: string;
  isActive: boolean;
}

export interface FacilityDocL1 {
  facilityMasterList: FacilityItem[];
  specialityMasterList: any[] | null; // can refine if you have the structure
  doctorMasterList: DoctorItem[] | null;
}

export interface FetchL1Response {
  doctorMasterList?: Array<any>; 
  facilityMasterList?: Array<any>; 
  specialityMasterList?: Array<any>; 
}

export interface FetchDatesResponse{
    dfAvailabilityId: string,
    availableDate: string,
    isFilled?: null
}

export interface FetchTimeSlotsRequest{
  duration: number,
  dfAvailabilityId: string;
}

export interface FetchTimeSlotResponse{
  start: string,
  end: string
}


export interface BookAppointmentRequest{
    date: string,
    duration: string,
    patientMasterId: string,
    dfAvailabilityId: string,
    startTime: string,
    endTime: string,
    specialityMasterId: string
}

export interface BookAppointmentResponse{
    date: string,
    duration: string,
    appointmentId:number
}