import React from "react";
import styles from "./PatientHome.module.scss";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa";

type Appointment = {
	id: string;
	date: string;
	time: string;
	doctor: string;
	location: string;
	department?: string;
	cancellationFeeNote?: string;
};

const sampleAppointments: Appointment[] = [
	{
		id: "1",
		date: "Mon, Oct 27, 2025",
		time: "10:00 AM - 10:30 AM",
		doctor: "Dr. Sarah Johnson",
		location: "Downtown Medical Center",
		department: "Cardiology",
		cancellationFeeNote: "Cancellation fee: $50 (within 24 hours of appointment)",
	},
];

export default function PatientHome() {
	const handleBook = () => {
		console.log("Book appointment clicked");
	};

	const handleCancel = (id: string) => {
		console.log("Cancel appointment", id);
	};

	return (
			<div className={`${styles.container} space-y-6 px-6 py-4`}>
				<div className={`${styles.welcomeBanner} bg-red-50 border border-red-100 rounded-xl p-6 text-red-700`}>
					<h2 className="text-2xl font-semibold text-red-600">Welcome back, John!</h2>
					<p className="text-sm text-gray-600 mt-1">Manage your appointments and health information</p>
				</div>

			<div className={`${styles.bookBox} bg-white border rounded-xl p-8 shadow-sm flex flex-col items-center text-center`}>
				<svg
					className="w-14 h-14 text-red-600 mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
				<h3 className="text-lg font-medium text-gray-700">Need to see a doctor?</h3>
				<p className="text-sm text-gray-500 mt-2">Book an appointment with our specialists</p>
				<button onClick={handleBook} className={`${styles.bookBtn}`}>
					Book New Appointment
				</button>
			</div>

					<div className={`${styles.upcoming}`}>
						<div className={`${styles.upcomingCard} p-4 shadow-sm`}>
							<div className="flex items-center justify-between">
								<div>
									<h4 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h4>
									<p className="text-sm text-gray-500">Your scheduled visits</p>
								</div>
								<div className={styles.countBadge}>{sampleAppointments.length}</div>
							</div>

							<div className={styles.upcomingInner}>
								<div className={`${styles.upcomingCardInner}`}>
									<div className="mt-4 space-y-4">
										{sampleAppointments.map((a) => (
											<div key={a.id} className={`${styles.apptCard}`}>
							<div className="flex justify-between items-start">
								<div className="max-w-[75%]">
									<div className={`${styles.infoRow} text-sm text-gray-600`}>
										<FiCalendar className="text-red-600" size={18} aria-hidden />
										<span className="font-medium text-gray-800">{a.date}</span>
									</div>

									<div className={`${styles.infoRow} text-sm text-gray-600`}>
										<FiClock className="text-red-600" size={18} aria-hidden />
										<span>{a.time}</span>
									</div>

									<div className={`${styles.infoRow} text-sm text-gray-600`}>
										<FaStethoscope className="text-red-600" size={18} aria-hidden />
										<span>{a.doctor}</span>
									</div>

									<div className={`${styles.infoRow} text-sm text-gray-600`}>
										<FiMapPin className="text-red-600" size={18} aria-hidden />
										<span>{a.location}</span>
									</div>
								</div>

												<div className="text-right">
													{a.department && (
														<div className={styles.deptBadge}>{a.department}</div>
													)}
												</div>
							</div>

											{a.cancellationFeeNote && (
												<div className={`${styles.warning} mt-4 text-sm`}>
													<span className={styles.warnIcon} aria-hidden>
														<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M10.29 3.86L1.82 18a1.5 1.5 0 001.29 2.25h17.78a1.5 1.5 0 001.29-2.25L13.71 3.86a1.5 1.5 0 00-2.42 0z" fill="#F59E0B"/>
														<path d="M12 9v4" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
														<circle cx="12" cy="17" r="1" fill="#92400E" />
													</svg>
													</span>
													<span className="font-medium">{a.cancellationFeeNote}</span>
												</div>
											)}

											<div className="mt-3">
												<button onClick={() => handleCancel(a.id)} className={styles.cancelBtn}>
													<span className={styles.cancelIcon} aria-hidden>✖</span>
													Cancel Appointment
												</button>
											</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
		</div>
	);
}
