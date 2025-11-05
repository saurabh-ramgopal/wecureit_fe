"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddDoctor.module.scss";
import { X, Info } from "lucide-react";
import { getStates, getSpecialities } from "../../../../lib/api";

interface AddDoctorModalProps {
	onClose: () => void;
	onSubmit: () => void;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ onClose, onSubmit }) => {
		const [states, setStates] = useState<Array<Record<string, unknown>>>([]);
		const [specialities, setSpecialities] = useState<Array<Record<string, unknown>>>([]);

	// Helpers to handle backend shape differences (backend uses specialityMasterId/specialityName)
	const extractId = (item: unknown) => {
		const it = item as Record<string, unknown>;
		const candidate = it['id'] ?? it['specialityMasterId'] ?? it['speciality_master_id'] ?? it['stateMasterId'] ?? it['state_master_id'] ?? it['state_id'] ?? it['code'];
		if (candidate === undefined || candidate === null) return JSON.stringify(it);
		if (typeof candidate === 'object') return JSON.stringify(candidate);
		return String(candidate);
	};

	const extractName = (item: unknown) => {
		const it = item as Record<string, unknown>;
		const candidate = it['name'] ?? it['specialityName'] ?? it['speciality_name'] ?? it['stateName'] ?? it['state_name'] ?? it['state_name'];
		if (candidate === undefined || candidate === null) return String(item);
		if (typeof candidate === 'object') return JSON.stringify(candidate);
		return String(candidate);
	};

	useEffect(() => {
		let mounted = true;
				getStates()
							.then((res: unknown) => {
								if (mounted && Array.isArray(res)) setStates(res as Array<Record<string, unknown>>);
					})
					.catch((err: unknown) => console.error("getStates error", err));

				getSpecialities()
							.then((res: unknown) => {
								if (mounted && Array.isArray(res)) setSpecialities(res as Array<Record<string, unknown>>);
					})
					.catch((err: unknown) => console.error("getSpecialities error", err));

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h2>Add New Doctor</h2>
					<button onClick={onClose} className={styles.closeBtn}>
						<X size={20} />
					</button>
				</div>

				<p className={styles.subtext}>
					Create a new doctor account with state licenses (doctors assign their own facilities).
				</p>

				<form className={styles.form}>
					<div className={styles.row}>
						<div className={styles.field}>
							<label>Full Name *</label>
							<input type="text" placeholder="Dr. John Smith" />
						</div>
						<div className={styles.field}>
							<label>Email *</label>
							<input type="email" placeholder="john.smith@hospital.com" />
						</div>
					</div>

					<div className={styles.row}>
						<div className={styles.field}>
							<label>Password *</label>
							<input type="password" placeholder="Create secure password" />
						</div>
						<div className={styles.field}>
							<label>Gender *</label>
							<select>
								<option>Select gender</option>
								<option>Female</option>
								<option>Male</option>
							</select>
						</div>
					</div>

					<label>State Licenses *</label>

					<div className={styles.exampleBox}>
						<Info size={16} />
						<p>
							<strong>Example:</strong> Virginia license for Cardiology
							(License #: VA-CARD-2020-1234)
						</p>
					</div>

					<div className={styles.licenseBox}>
						<div className={styles.row}>
							<div className={styles.field}>
								<label>State</label>
								<select>
									<option value="">Select state</option>
									{states.length === 0 ? (
										<option value="" disabled>
											No states available
										</option>
									) : (
										states.map((s) => (
											<option key={extractId(s)} value={extractId(s)}>
												{extractName(s)}
											</option>
										))
									)}
								</select>
							</div>
							<div className={styles.field}>
								<label>Specialty</label>
								<select>
									<option value="">Select specialty</option>
									{specialities.length === 0 ? (
										<option value="" disabled>
											No specialities available
										</option>
									) : (
										specialities.map((sp) => (
											<option key={extractId(sp)} value={extractId(sp)}>
												{extractName(sp)}
											</option>
										))
									)}
								</select>
							</div>
						</div>

						<div className={styles.field}>
							<label>License Number *</label>
							<input type="text" placeholder="e.g. VA-CARD-2020-1234" />
						</div>
					</div>

					<div className={styles.infoNote}>
						<Info size={16} />
						<p>
							Doctors will assign their own facilities through the Doctor Portal based on their availability preferences.
						</p>
					</div>

					<div className={styles.footer}>
						<button type="button" onClick={onClose} className={styles.cancelBtn}>
							Cancel
						</button>
						<button type="submit" onClick={onSubmit} className={styles.submitBtn}>
							Create Doctor
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddDoctorModal;

