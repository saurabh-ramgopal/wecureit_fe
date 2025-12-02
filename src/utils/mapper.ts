import { DoctorAPIResponse, Doctor, Speciality, DoctorScheduleAPIResponse, DoctorPastAppointmentsUI} from '@/types/doctor';
import {formatPlainDate} from "../utils/utils"

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



export const mapDoctorSchedule = (apiData: DoctorScheduleAPIResponse) => {
  // Group appointments by date
  const grouped = apiData.reduce((acc, appt) => {
    const date = appt.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(appt);
    return acc;
  }, {} as Record<string, DoctorScheduleAPIResponse>);

  // Map to UI-friendly structure
  const schedule = Object.keys(grouped)
    .sort() // ensures days are in chronological order
    .map(dateStr => {
      const appts = grouped[dateStr];

      // Sort appointments by startTime
      appts.sort((a, b) => a.startTime.localeCompare(b.startTime));

      // Calculate total hours
      const totalHours = appts.reduce((sum, a) => sum + a.duration / 60, 0);

      // Format appointments for UI
      const appointments = appts.map(a => ({
        id: a.appointmentId,
        patientName: a.patientMaster.patientName,
        duration: `${a.duration} min`,
        time: `${a.startTime.slice(0,5)} - ${a.endTime.slice(0,5)}`,
      }));

     const { shortDate, fullDate } = formatPlainDate(dateStr);

      return {
        shortDate,
        fullDate,
        location: appts[0].doctorFacilityAvailability.facilityMaster.facilityName,
        totalHours: `${totalHours.toFixed(1)} hours`,
        appointments
      };
    });

  return schedule;
}



export const mapDoctorPastAppointments = (
  apiAppointments: DoctorScheduleAPIResponse
): DoctorPastAppointmentsUI[] => {
  return apiAppointments.map((appt) => {

    // Calculate age from DOB
    const age = (() => {
      const dob = new Date(appt.patientMaster.patientDob);
      const diff = Date.now() - dob.getTime();
      return new Date(diff).getUTCFullYear() - 1970;
    })();

     const formattedDate = formatPlainDate(appt.date);
      const formattedTime = `${appt.startTime.slice(0,5)} - ${appt.endTime.slice(0,5)}`;
    return {
      appointmentId: String(appt.appointmentId),
      patientName: appt.patientMaster.patientName,
      age: `${age}`,
      gender: appt.patientMaster.patientGender,
      date: formattedDate.fullDate,
      time: formattedTime,
      duration: `${appt.duration} min`,
      complaint: appt.appointmentNotes,
      location: appt.doctorFacilityAvailability.facilityMaster.facilityName,
    };
  });
};
