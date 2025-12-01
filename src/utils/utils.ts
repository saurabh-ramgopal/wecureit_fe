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