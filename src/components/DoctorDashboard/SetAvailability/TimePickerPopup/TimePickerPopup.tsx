import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import styles from "./TimePickerPopup.module.scss";
import toast from "react-hot-toast";
import { calculateDiffHours } from "@/utils/utils";

interface TimePickerPopupProps {
    handleEditSubmit: (fromTime: string, toTime: string, availabilityId: string) => void;
   isTimePopupOpen: boolean;
    setIsTimePopupOpen: (value: boolean) => void;
    editingItemId: string;
}

const TimePickerPopup: React.FC<TimePickerPopupProps> = ({
  isTimePopupOpen,
  setIsTimePopupOpen,
  handleEditSubmit,
  editingItemId

}) => {
    
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

  const fromIndex = timeOptions.findIndex(opt => opt.value === timeOptions[0].value);
  const options = timeOptions.slice(fromIndex + 1);

  if (!options.find(opt => opt.value === "12:00 AM")) {
    options.push({ value: "12:00 AM", label: "12:00 AM" });
  }
  return options[0]?.value || "12:00 AM";
});

   const filteredEndOptions = useMemo(() => {
    if (!fromTime) return timeOptions;

    const fromIndex = timeOptions.findIndex(opt => opt.value === fromTime);
    const options = timeOptions.slice(fromIndex + 1);

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

  const handleSave = (startTime: string, endTime: string) => {
     const hoursDiff = calculateDiffHours(startTime, endTime);
        console.log("Calculated hours difference:", hoursDiff);
        console.log("Start Time:", startTime, "End Time:", endTime);
        if (hoursDiff < 4) {
            toast.error("Working hours must be at least 4 hours.");
            return;
        } 
        else{
             handleEditSubmit(startTime, endTime, editingItemId);
            setIsTimePopupOpen(false);
        }
  };


  return (
    <div className={styles.wrapper}>

      {isTimePopupOpen && (
        <>
          {/* Backdrop */}
          <div
            className={styles.backdrop}
            onClick={() => setIsTimePopupOpen(false)}
          />

          {/* Modal */}
          <div className={styles.modal}>
            <h3>Edit Available Time</h3>

            <div className={styles.field}>
              <label>Start Time</label>
              <Select
                value={timeOptions.find((opt) => opt.value === fromTime)}
                onChange={(selected) =>
                  setFromTime(selected?.value || "")
                }
                options={timeOptions}
                isSearchable={false}
                maxMenuHeight={150}
                className={styles["time-select"]}
                classNamePrefix="react-select"
              />
            </div>

            <div className={styles.field}>
              <label>End Time</label>
              <Select
                value={timeOptions.find((opt) => opt.value === toTime)}
                onChange={(selected) => setToTime(selected?.value || "")}
                options={filteredEndOptions}
                isSearchable={false}
                maxMenuHeight={150}
                className={styles["time-select"]}
                classNamePrefix="react-select"
              />
            </div>

            <div className={styles.actions}>
              <button
                className={styles.cancelButton}
                onClick={() => setIsTimePopupOpen(false)}
              >
                Cancel
              </button>
              <button className={styles.saveButton}  onClick={() => handleSave(fromTime, toTime)} >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimePickerPopup;
