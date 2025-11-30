import React, { useState } from 'react'
import SetAvailabilityHeader from '../../MainCardHeader/MainCardHeader';
import styles from './SetDoctorAvailabilityView.module.scss';
import SelectDayCards from '../SelectDayCards/SelectDayCards';
import SelectFacilityCards from '../SelectFacilityCards/SelectFacilityCards';
import { Doctor, FacilityAvailability, FacilityAvailabilityUI, FacilitySpeciality } from "@/types/doctor";
import WorkingHoursDropdown from '../WorkingHoursDropdown/WorkingHoursDropdown';
import DraftAvailabilitySummary from '../DraftAvailabilitySummary/DraftAvailabilitySummary';
import SavedAvailabilitySummary from '../SavedAvailabilitySummary/SavedAvailabilitySummary';

type SetDoctorAvailabilityProps = {
    doctor: Doctor;
    handleSetAvailabilitySubmit: (fromTime: string, toTime: string) => void;
    onDateChange: (date: string) => void;
    selectedDate: string;
    selectedFacilityId: string;
    handleFacilityChange: (facility: FacilityAvailabilityUI) => void;
    onDelete: (index: number) => void;
    availabilityList: FacilityAvailabilityUI[];
    handleSaveAvailabilitySubmit: () => void;

}

const SetDoctorAvailability= ({doctor, handleSetAvailabilitySubmit, selectedDate, selectedFacilityId, onDateChange, handleFacilityChange, onDelete, availabilityList, handleSaveAvailabilitySubmit} : SetDoctorAvailabilityProps) => {
  return (
    <>
    <div className={styles['setavailability-card']}>
     <SetAvailabilityHeader title='Set Your Availability'
     subtitle='Choose dates, facilities, and working hours. Minimum 4 hours per day, one facility per day.'/>
     <SelectDayCards onDateSelect={onDateChange}  />
       {selectedDate && (
        <>
          <SetAvailabilityHeader title={`Set Facility for ${selectedDate}`} />
          <SelectFacilityCards selectedDate={selectedDate} selectedFacilityId={selectedFacilityId} doctor={doctor} onSelectFacility={handleFacilityChange} />
          {selectedFacilityId && (
            <>
               <SetAvailabilityHeader title={'Select Working Hours (Minimum 4 hours)'} />
                <WorkingHoursDropdown handleSubmit={handleSetAvailabilitySubmit} 
                />
                </>
          )}
        </>
      )}
    </div>
    <div className={styles['setavailability-card']}>
       <SetAvailabilityHeader title = 'Draft Availability Summary'
       subtitle='Review your draft availability before finalizing' />
       <DraftAvailabilitySummary draftlist={availabilityList} onDelete={onDelete} handleSaveAvailabilitySubmit={handleSaveAvailabilitySubmit} />
    </div>
    <div className={styles['setavailability-card']}>
       <SetAvailabilityHeader title = 'Saved Availability Summary'
       subtitle='Review your saved availability' />
       <SavedAvailabilitySummary  />
    </div>
    </>
  );
}

export default SetDoctorAvailability;