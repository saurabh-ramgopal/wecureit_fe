import React from 'react';
import './ScheduleHeader.scss';

interface ScheduleHeaderProps {
  currentWeek: number;
  onWeekChange: (week: number) => void;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ currentWeek, onWeekChange }) => {
  return (
    <div className="schedule-header">
      <div className="schedule-header__text">
        <h2 className="schedule-header__title">My Schedule - Next 2 Weeks</h2>
        <p className="schedule-header__subtitle">
          View your upcoming appointments with location and time details
        </p>
      </div>
      <div className="schedule-header__buttons">
        <button
          className={`week-button ${currentWeek === 1 ? 'active' : ''}`}
          onClick={() => onWeekChange(1)}
           disabled={currentWeek === 1}
        >
            <span className="arrow">&lt;</span>
            <span className="week-text">Week 1</span>
        </button>
        <button
          className={`week-button ${currentWeek === 2 ? 'active' : ''}`}
          onClick={() => onWeekChange(2)}
             disabled={currentWeek === 2}
        >
                 <span className="week-text">Week 2</span>
                 <span className="arrow">&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default ScheduleHeader;
