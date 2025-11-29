"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './patientbookingsummary.module.scss';

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
    const router = useRouter();
    const [summary, setSummary] = useState<BookingSummary | null>(null);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem('bookingSummary');
            if (raw) setSummary(JSON.parse(raw));
        } catch (e) {
            console.warn('Failed to parse bookingSummary from sessionStorage', e);
        }
    }, []);

    const handlePrint = () => window.print();

    return (
        <div className={styles.confirmationCard} style={{ maxWidth: 880, margin: '32px auto' }}>
            <div className={styles.confirmationCard__header}>
                <h2 className={styles.confirmationCard__title}>Booking Summary</h2>
            </div>

            {!summary ? (
                <div>
                    <p className={styles.confirmationCard__subtitle}>No booking data available.</p>
                    <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
                        <button className="btn btn-primary" onClick={() => router.push('/patient/dashboard')}>Back to Dashboard</button>
                        <button className="btn btn-ghost" onClick={() => router.push('/patient/booking')}>Create Booking</button>
                    </div>
                </div>
            ) : (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <strong>Booking ID</strong>
                            <div>{summary.bookingId ?? '—'}</div>
                        </div>
                        <div>
                            <strong>Patient</strong>
                            <div>{summary.patientName ?? '—'}</div>
                        </div>
                        <div>
                            <strong>Doctor</strong>
                            <div>{summary.doctorName ?? '—'}</div>
                        </div>
                        <div>
                            <strong>Facility</strong>
                            <div>{summary.facility ?? '—'}</div>
                        </div>
                        <div>
                            <strong>Date</strong>
                            <div>{summary.date ?? '—'}</div>
                        </div>
                        <div>
                            <strong>Time</strong>
                            <div>{summary.time ?? '—'}</div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <strong>Reason</strong>
                            <div>{summary.reason ?? '—'}</div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <strong>Fees</strong>
                            <div>{summary.fees ?? '—'}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
                        <button className="btn btn-primary" onClick={() => router.push('/patient/confirmation')}>Confirm & Continue</button>
                        <button className="btn btn-ghost" onClick={handlePrint}>Print</button>
                        <button className="btn btn-ghost" onClick={() => router.push('/patient/dashboard')}>Back to Dashboard</button>
                    </div>
                </div>
            )}
        </div>
    );
}