import React, { useState } from 'react';
import styles from './PatientDashboardHeader.module.scss';
import { FileClock, House, LucideIcon, User, LogOut } from 'lucide-react';
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
    {id: 'Logout', label:'Logout User', icon: LogOut},
  ];

  return (
<div className={styles['tabNavigation']}>
  {tabs.map((tab) => {
    const IconComponent = tab.icon;
    return (
      <button
        key={tab.id}
        className={`${styles['tabButton']} ${activeTab === tab.label ? styles.active : ''}`}
        onClick={() => onTabClick(tab.label)}
      >
        <IconComponent className={styles['tabIcon']} size={18} />
        <span className={styles['tabLabel']}>{tab.label}</span>
      </button>
    );
  })}
</div>

  );
};

export default PatientDashboardHeader;