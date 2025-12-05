import {FormattedDate} from '../types/doctor'
export function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}
export const calculateDiffHours = (startTime: string, endTime: string): number => {
  const startStr = convertTo24Hour(startTime);
  const endStr = convertTo24Hour(endTime);

  let start = new Date(`1970-01-01T${startStr}:00`);
  let end = new Date(`1970-01-01T${endStr}:00`);

  if (end <= start) {
    end.setDate(end.getDate() + 1); // next day
  }

  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};
export function convertTo24HourWithSeconds(time12h: string): string {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = minutes.toString().padStart(2, "0");

    return `${hoursStr}:${minutesStr}:00`;
}



export const formatPlainDate = (dateStr: string): FormattedDate => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day)); // UTC ensures no timezone shift

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthsLong = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];

  const shortDate = `${weekdays[dateObj.getUTCDay()]}, ${monthsShort[dateObj.getUTCMonth()]} ${dateObj.getUTCDate()}`;
  const fullDate = `${monthsLong[dateObj.getUTCMonth()]} ${dateObj.getUTCDate()}, ${dateObj.getUTCFullYear()}`;

  return { shortDate, fullDate };
};

export const formatTime = (t: string) => {
  if (!t) return '';
  const [hhStr, mmStr] = t.split(':');
  const hh = parseInt(hhStr ?? '0', 10);
  const mm = parseInt(mmStr ?? '0', 10);

  const ampm = hh >= 12 ? 'PM' : 'AM';
  let hour12 = hh % 12;
  if (hour12 === 0) hour12 = 12;

  return `${String(hour12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${ampm}`;
};
