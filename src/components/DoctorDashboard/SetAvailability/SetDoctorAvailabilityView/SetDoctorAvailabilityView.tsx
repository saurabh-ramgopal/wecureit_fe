import React from 'react'
import SetAvailabilityHeader from '../../MainCardHeader/MainCardHeader';
import './SetDoctorAvailabilityView.scss';
import SelectDayCards from '../SelectDayCards/SelectDayCards';
import AvailabilitySummary from '../AvailabilitySummary/AvailabilitySummary';
type Props = {}

const SetDoctorAvailability = (props: Props) => {
  return (
    <>
    <div className="setavailability-card">
     <SetAvailabilityHeader title='Set Your Availability'
     subtitle='Choose dates, facilities, and working hours. Minimum 4 hours per day, one facility per day.'/>
     <SelectDayCards/>
    
    </div>
    <div className='setavailability-card'>
       <SetAvailabilityHeader title = 'Your Availability Summary'
       subtitle='0 day(s) scheduled' />
       <AvailabilitySummary/>
    </div>
    </>
  );
}

export default SetDoctorAvailability;