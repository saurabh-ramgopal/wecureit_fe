import React from 'react';
import './MainCardHeader.scss';

interface SetAvailabilityHeaderProps {
  title: string;
  subtitle: string;
}

const MainCardHeader: React.FC<SetAvailabilityHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="maincard-header">
      <div className="maincard-header__text">
        <h2 className="maincard-header__title">{title}</h2>
        <p className="maincard-header__subtitle">
         {subtitle}
        </p>
      </div>
    </div>
  );
};

export default MainCardHeader;
