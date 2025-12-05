"use client";
import React from 'react';
import { DropdownSelectionProvider } from '@/components/PatientDashboard/DropdownSelection/DropdownSelectionContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DropdownSelectionProvider>
      {children}
    </DropdownSelectionProvider>
  );
}
