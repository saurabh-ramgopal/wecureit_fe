import { DoctorAPIResponse, Doctor, Speciality, DoctorScheduleAPIResponse, DoctorPastAppointmentsUI} from '@/types/doctor';

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
        reason: a.appointmentNotes || 'N/A'
      }));

      const dateObj = new Date(dateStr);
     const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short',  
        month: 'short',    
        day: 'numeric' 
      };

      const fullOptions: Intl.DateTimeFormatOptions = { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        };

      return {
        shortDate: dateObj.toLocaleDateString('en-US', options),
        fullDate: dateObj.toLocaleDateString('en-US', fullOptions),
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

    // Format date → "Sunday, November 2, 2025"
    const formattedDate = new Date(appt.date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Format time → "13:00 - 13:45"
    const formattedTime = `${appt.startTime.slice(0, 5)} - ${appt.endTime.slice(0, 5)}`;

    return {
      patientName: appt.patientMaster.patientName,
      age: `${age}`,
      gender: appt.patientMaster.patientGender,
      date: formattedDate,
      time: formattedTime,
      duration: `${appt.duration} min`,
      complaint: "N/A",
      location: appt.doctorFacilityAvailability.facilityMaster.facilityName,
    };
  });
};
