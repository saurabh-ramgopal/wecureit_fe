import React, { useState, useMemo, useEffect } from "react";
import styles from "./WorkingHoursDropdown.module.scss";
import Select from 'react-select';
type WorkingHoursDropdownProps = {
  handleSubmit: (fromTime: string, toTime: string) => void;
}

const WorkingHoursDropdown = ({ handleSubmit }: WorkingHoursDropdownProps) => {
  const timeOptions = useMemo(() => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "AM" : "PM";
      const timeStr = `${hour12.toString().padStart(2, "0")}:00 ${ampm}`;
      options.push({ value: timeStr, label: timeStr });
    }
    return options;
  }, []);

  const [fromTime, setFromTime] = useState(timeOptions[0].value);
  const [toTime, setToTime] = useState(() => {
  // Default end time: first option after fromTime
  const fromIndex = timeOptions.findIndex(opt => opt.value === timeOptions[0].value);
  const options = timeOptions.slice(fromIndex + 1);
  // Ensure 12 AM is included
  if (!options.find(opt => opt.value === "12:00 AM")) {
    options.push({ value: "12:00 AM", label: "12:00 AM" });
  }
  return options[0]?.value || "12:00 AM";
});

  
    // Filter End Time options based on selected From Time
   const filteredEndOptions = useMemo(() => {
    if (!fromTime) return timeOptions;

    const fromIndex = timeOptions.findIndex(opt => opt.value === fromTime);
    const options = timeOptions.slice(fromIndex + 1);

    // Ensure 12 AM is included if not already
    if (!options.find(opt => opt.value === "12:00 AM")) {
      options.push({ value: "12:00 AM", label: "12:00 AM" });
    }

    return options;
  }, [fromTime, timeOptions]);

  useEffect(() => {
  if (fromTime && (!toTime || !filteredEndOptions.find(opt => opt.value === toTime))) {
    setToTime(filteredEndOptions[0]?.value || "");
  }
}, [fromTime, filteredEndOptions]);

  return (
    <div>
  <div className={styles['working-hours-container']}>
    <div className={styles['time-select-wrapper']}>
      <label className={styles['dropdown-heading']}>Start Time</label>
      <Select
        value={timeOptions.find(option => option.value === fromTime)}
        onChange={(selectedOption) => setFromTime(selectedOption?.value || '')}
        options={timeOptions}
        isSearchable={false}
        maxMenuHeight={150}
        className={styles["time-select"]}
        classNamePrefix="react-select"
      />
    </div>

    <div className={styles['time-select-wrapper']}>
      <label className={styles['dropdown-heading']}>End Time</label>
      <Select
        value={filteredEndOptions.find(option => option.value === toTime) || filteredEndOptions[0]}
        onChange={(selectedOption) => setToTime(selectedOption?.value || '')}
        options={filteredEndOptions}
        isSearchable={false}
        maxMenuHeight={150}
        className={styles["time-select"]}
        classNamePrefix="react-select"
      />
    </div>
  </div>

  <div className={styles['submit-button-wrapper']}>
    <button className={styles['add-availability-button']} onClick={() => handleSubmit(fromTime, toTime)}>
      Add Availability
    </button>
  </div>
</div>
      
  );
};

export default WorkingHoursDropdown;