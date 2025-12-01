"use client";
import React, { useEffect, useState } from 'react';
import ConfirmAppointment from '@/components/PatientDashboard/BookingSummary/BookingSummary';
import styles from '@/components/PatientDashboard/BookingSummary/BookingSummary.module.scss';

type BookingSummary = {
    bookingId?: string | number;
    patientName?: string;
    doctorName?: string;
    facility?: string;
    date?: string;
    time?: string;
    reason?: string;
    fees?: string | number;
};

export default function Page() {
    const [summary, setSummary] = useState<BookingSummary | null>(null);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem('bookingSummary');
            if (raw) setSummary(JSON.parse(raw));
        } catch (e) {
            console.warn('Failed to parse bookingSummary from sessionStorage', e);
        }
    }, []);

    return (
        <div className={styles.pageBg}>
            <div className={styles.pageContainer} data-summary={summary ? '1' : '0'}>
                <ConfirmAppointment />
            </div>
        </div>
    );
}