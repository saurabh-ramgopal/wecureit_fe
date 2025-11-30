import { DoctorAPIResponse, Doctor, Speciality } from '@/types/doctor';

export const mapDoctorAPIToDoctor = (apiDoctor: DoctorAPIResponse): Doctor => ({
  doctorId: apiDoctor.doctorMasterId,
  doctorName: apiDoctor.doctorName,
  doctorGender: apiDoctor.doctorGender,
  doctorEmail: apiDoctor.doctorEmail,
  doctorStateSpeciality: apiDoctor.stateDetails.map(state => {
    // Remove duplicate specialities
    const uniqueSpecialities: Speciality[] = Array.from(
      new Map(
        state.stateSpecialities.map(spec => [spec.specialityId, spec])
      ).values()
    );

    return {
      stateCode: state.stateCode,
      stateName: state.stateName,
      specialityList: uniqueSpecialities,
    };
  }),
});
