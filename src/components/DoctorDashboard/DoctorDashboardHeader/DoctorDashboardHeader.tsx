import React, { useState } from 'react';
import './DoctorDashboardHeader.scss';
import { Calendar, Clock, FileText, LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}
interface DoctorDashboardHeaderProps {
  activeTab: string;
  onTabClick: (tabId: string) => void;
}
const DoctorDashboardHeader: React.FC<DoctorDashboardHeaderProps> = ({activeTab, onTabClick}) => {


  const tabs: Tab[] = [
    { id: 'schedule', label: 'My Schedule', icon: Calendar },
    { id: 'availability', label: 'Set Availability', icon: Clock },
    { id: 'appointments', label: 'Appointments & Notes', icon: FileText },
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

export default DoctorDashboardHeader;