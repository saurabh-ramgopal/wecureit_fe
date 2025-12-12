import { DoctorAPIResponse, Doctor, Speciality, DoctorScheduleAPIResponse, DoctorPastAppointmentsUI} from '@/types/doctor';
import {formatPlainDate, toAMPM} from "../utils/utils"
import {AllDoctorResponseAPI, AllDoctorUI, AllFacilityResponseAPI, AllFacilityUI} from "@/types/patient";
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

      const [firstAppt] = appts;


      const dayStart = firstAppt.startTime;                      
      const dayEnd = appts[appts.length - 1].endTime;     
      
      const availableStart = firstAppt.doctorFacilityAvailability.availableStartTime;
      const availableEnd = firstAppt.doctorFacilityAvailability.availableEndTime;

        const toMinutes = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

     
      const startMin = toMinutes(dayStart);
      const endMin = toMinutes(dayEnd);

      const availStartMin = toMinutes(availableStart);
      const availEndMin = toMinutes(availableEnd);

      const totalAppointmentMinutes = endMin - startMin;
      const FOUR_HOURS = 240;

      let windowStart: number;
      let windowEnd: number;

      if (totalAppointmentMinutes > FOUR_HOURS) {
      
        windowStart = startMin;
        windowEnd = endMin;
      } else {

        const fourHrEnd = startMin + FOUR_HOURS;

        if (fourHrEnd <= availEndMin) {

          windowStart = startMin;
          windowEnd = fourHrEnd;
        } else {

          windowEnd = availEndMin;
          windowStart = availEndMin - FOUR_HOURS;
        }
      }

      const displayWindow = `${toAMPM(windowStart)} - ${toAMPM(windowEnd)}`;

      const appointments = appts.map(a => ({
        id: a.appointmentId,
        patientName: a.patientMaster.patientName,
        patientMasterId: a.patientMaster.patientMasterId,
        duration: `${a.duration} min`,
        time: `${toAMPM(a.startTime)} - ${toAMPM(a.endTime)}`,
      }));

     const { shortDate, fullDate } = formatPlainDate(dateStr);

      return {
        shortDate,
        fullDate,
        location: firstAppt.doctorFacilityAvailability.facilityMaster.facilityName,
        totalHours:displayWindow,
        facilityStreet: firstAppt.doctorFacilityAvailability.facilityMaster.facilityStreet,
        stateName: firstAppt.doctorFacilityAvailability.facilityMaster.stateCode.stateName,
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

export const mapAllDoctorResponse = (doctors: AllDoctorResponseAPI[]): AllDoctorUI[] => {
  return doctors.map((doc) => {
     const allSpecialities = (doc.stateDetails ?? []).flatMap((state) =>
      (state.stateSpecialities ?? []).map((s) => s.specialityName)
    );
    const uniqueSpecialities = Array.from(new Set(allSpecialities));

    return {
      doctorMasterId: doc.doctorMasterId,
      name: `Dr. ${doc.doctorName}`,
      specialities: uniqueSpecialities,
    };
  });

  
};


export const mapAllFacilityResponse = (facilities: AllFacilityResponseAPI[]): AllFacilityUI[] => {
  return facilities.map((facility) => {
    return {
      facilityID: facility.facilityMasterId,
      facilityName: facility.facilityName,
      street: facility.facilityStreet,
      state: facility.stateName,
    };
  });
};