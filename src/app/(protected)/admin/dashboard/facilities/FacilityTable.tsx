"use client";
import React, { useState } from "react";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import styles from "../AdminDashboard.module.scss";
import AddFacility, { type Facility as AddFacilityType } from "./AddFacility";

const initialFacilities: AddFacilityType[] = [
  {
    name: "Downtown Medical Center",
    state: "Washington DC",
    address: "123 Main Street, Washington DC 20001",
    totalRooms: 6,
    specialties: [
      "Cardiology",
      "Dermatology",
      "General Practice",
      "Neurology",
      "Orthopedics",
      "Pediatrics",
    ],
    roomDetails: [
      "Cardiology, General Practice",
      "Orthopedics, General Practice",
      "Pediatrics, General Practice",
      "Dermatology, General Practice",
      "Neurology, General Practice",
      "General Practice",
    ],
  },
  {
    name: "Northwest Health Clinic",
    state: "Washington DC",
    address: "456 Northwest Ave, Washington DC 20015",
    totalRooms: 4,
    specialties: [
      "Dermatology",
      "General Practice",
      "Ophthalmology",
      "Pediatrics",
    ],
    roomDetails: [
      "Pediatrics, General Practice",
      "Dermatology, General Practice",
      "Ophthalmology, General Practice",
      "General Practice",
    ],
  },
  {
    name: "Alexandria Main Hospital",
    state: "Virginia",
    address: "789 King Street, Alexandria VA 22314",
    totalRooms: 4,
    specialties: [
      "Cardiology",
      "General Practice",
      "Neurology",
      "Orthopedics",
    ],
    roomDetails: [
      "Cardiology, General Practice",
      "Orthopedics, General Practice",
      "Neurology, General Practice",
      "General Practice",
    ],
  },
];

const FacilityTable = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [facilities, setFacilities] = useState<AddFacilityType[]>(initialFacilities);
  const [selectedFacility, setSelectedFacility] = useState<AddFacilityType | null>(null);

  // Helper to extract a displayable state name from various backend shapes
  const extractStateName = (s: unknown): string => {
    if (!s) return '';
    if (typeof s === 'string') return s;
    const o = s as Record<string, unknown>;
    return (
      (o['stateName'] as string) ||
      (o['state_name'] as string) ||
      (o['state'] as string) ||
      (o['name'] as string) ||
      (o['stateName'] as string) ||
      ''
    );
  };

  return (
    <>
      {/* Header */}
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Facility Management</h2>
          <p className={styles.cardSubtitle}>
            Add and manage medical facilities with room-based specialties.
          </p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          + Add Facility
        </button>
      </div>

      {/* Two-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))",
          gap: "1.5rem",
          width: "100%",
        }}
      >
        {facilities.map((f, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            {/* Facility Name + Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.5rem",
              }}
            >
              <div>
                <h3
                  style={{
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    fontSize: "1rem", // Slightly smaller
                  }}
                >
                  {f.name}
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <MapPin size={14} /> {extractStateName(f.state)}
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={styles.iconButton}
                  onClick={() => {
                    setSelectedFacility(f);
                    setShowAddModal(true);
                  }}
                >
                  <Pencil className={styles.iconEdit} size={16} />
                </button>
                <button className={styles.iconButton}>
                  <Trash2 className={styles.iconDelete} size={16} />
                </button>
              </div>
            </div>

            {/* Address + Rooms */}
            <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>
              <strong>Address:</strong> {f.address}
            </p>
            <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>
              <strong>Total Rooms:</strong> {f.totalRooms} rooms
            </p>

            {/* Specialties */}
            <div style={{ marginBottom: "0.75rem" }}>
              <p
                style={{
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  marginBottom: "0.25rem",
                }}
              >
                All Supported Specialties:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                {f.specialties.map((sp, idx) => (
                  <span key={idx} className={styles.badge}>
                    {sp}
                  </span>
                ))}
              </div>
            </div>

            {/* Room Details */}
            <div>
              <p
                style={{
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  marginBottom: "0.25rem",
                }}
              >
                Room Details:
              </p>
              <div
                style={{
                  background: "var(--bg-page)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "10px",
                  padding: "0.6rem 0.8rem",
                }}
              >
                {f.roomDetails.map((r, idx) => (
                  <p
                    key={idx}
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      margin: "0.25rem 0",
                    }}
                  >
                    <strong>Room {idx + 1}:</strong> {r}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Facility Modal */}
      {showAddModal && (
        <AddFacility
          facility={selectedFacility ?? undefined}
          onClose={() => {
            setShowAddModal(false);
            setSelectedFacility(null);
          }}
          onSubmit={(updated) => {
            if (selectedFacility) {
              // edit existing
              setFacilities((prev) => prev.map((it) => (it === selectedFacility ? (updated ?? selectedFacility) : it)));
            } else if (updated) {
              // new facility
              setFacilities((prev) => [updated, ...prev]);
            }
            setShowAddModal(false);
            setSelectedFacility(null);
          }}
        />
      )}
    </>
  );
};

export default FacilityTable;
