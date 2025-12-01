import React from 'react';
import styles from './DoctorDashboardHeader.module.scss';
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
const DoctorDashboardHeader = ({activeTab, onTabClick}: DoctorDashboardHeaderProps) => {


  const tabs: Tab[] = [
    { id: 'schedule', label: 'My Schedule', icon: Calendar },
    { id: 'availability', label: 'Set Availability', icon: Clock },
    { id: 'appointments', label: 'Appointments & Notes', icon: FileText },
  ];

  return (
  <div className={styles['tab-navigation']}>
    {tabs.map((tab) => {
      const IconComponent = tab.icon;
      return (
        <button
          key={tab.id}
          className={`${styles['tab-button']} ${activeTab === tab.label ? styles['active'] : ''}`}
          onClick={() => onTabClick(tab.label)}
        >
          <IconComponent  className={styles['tab-icon']}  size={18} />
          <span className={styles['tab-label']}>{tab.label}</span>
        </button>
      );
    })}
  </div>
  );
};

export default DoctorDashboardHeader;