import React, { useState } from 'react';
import './PatientDashboardHeader.scss';
import { FileClock, House, LucideIcon, User } from 'lucide-react';
//import { PatientDashboardHeader } from '@/components/PatientDashboard/PatientDashboardHeader/DoctorDashboardHeader';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}
interface PatientDashboardHeaderProps {
  activeTab: string;
  onTabClick: (tabId: string) => void;
}
const PatientDashboardHeader: React.FC<PatientDashboardHeaderProps> = ({activeTab, onTabClick}) => {

  const tabs: Tab[] = [
    { id: 'home', label: 'Home', icon: House },
    { id: 'myprofile', label: 'My Profile', icon: User},
    { id: 'appointmenthistory', label: 'Appointment History', icon: FileClock },
  ];

  return (
  <div className="tab-navigation">
    {tabs.map((tab) => {
      const IconComponent = tab.icon;
      return (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.label ? 'active' : ''}`}
          onClick={() => onTabClick(tab.label)}
        >
          <IconComponent className="tab-icon" size={18} />
          <span className="tab-label">{tab.label}</span>
        </button>
      );
    })}
  </div>
  );
};

export default PatientDashboardHeader;