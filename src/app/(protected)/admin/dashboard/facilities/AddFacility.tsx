"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddFacility.module.scss";
import { X, Info } from "lucide-react";
import { getStates, getSpecialities } from "../../../../../lib/api";

// Minimal exported Facility type so other modules can import it for typing
export type Facility = {
  name: string;
  state: string;
  address: string;
  totalRooms: number;
  specialties: string[];
  roomDetails: string[];
};

interface AddFacilityProps {
  onClose: () => void;
  // when provided, onSubmit receives the created/updated Facility object
  onSubmit?: (facility?: Facility) => void;
  facility?: Facility;
}

const AddFacility: React.FC<AddFacilityProps> = ({ onClose, onSubmit, facility }) => {
  const [states, setStates] = useState<Array<Record<string, unknown>>>([]);
  const [specialities, setSpecialities] = useState<Array<Record<string, unknown>>>([]);
  const [facilityName, setFacilityName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [numRooms, setNumRooms] = useState(1);
  const [roomConfig, setRoomConfig] = useState<Record<number, string[]>>({ 1: ["General Practice"] });

  useEffect(() => {
    let mounted = true;
    getStates()
      .then((res: unknown) => {
        if (!mounted) return;
        if (Array.isArray(res)) setStates(res as Array<Record<string, unknown>>);
      })
      .catch((err: unknown) => console.error("getStates error", err));

    getSpecialities()
      .then((res: unknown) => {
        if (!mounted) return;
        if (Array.isArray(res)) setSpecialities(res as Array<Record<string, unknown>>);
      })
      .catch((err: unknown) => console.error("getSpecialities error", err));

    return () => {
      mounted = false;
    };
  }, []);

  // Initialize form when editing an existing facility
  useEffect(() => {
    if (!facility) return;
    setFacilityName(facility.name ?? "");
    setAddress(facility.address ?? "");
    setSelectedState(facility.state ?? "");
    const rooms = facility.totalRooms ?? 1;
    setNumRooms(rooms);
    // Build roomConfig from roomDetails strings (comma-separated)
    const rc: Record<number, string[]> = {};
    for (let i = 0; i < rooms; i++) {
      const raw = facility.roomDetails?.[i] ?? "General Practice";
      rc[i + 1] = raw.split(',').map((s) => s.trim());
      if (!rc[i + 1].includes('General Practice')) rc[i + 1].push('General Practice');
    }
    setRoomConfig(rc);
  }, [facility]);

  // Helper extractors to avoid `any` and handle variable backend field names
  const extractId = (item: unknown) => {
    const it = item as Record<string, unknown>;
    const candidate = it["id"] ?? it["stateId"] ?? it["state_master_id"] ?? it["stateMasterId"] ?? it["code"];
    if (candidate === undefined || candidate === null) return JSON.stringify(it);
    if (typeof candidate === "object") return JSON.stringify(candidate);
    return String(candidate);
  };

  const extractName = (item: unknown) => {
    const it = item as Record<string, unknown>;
    const candidate = it["name"] ?? it["stateName"] ?? it["state_name"] ?? it["specialityName"] ?? it["speciality_name"];
    if (candidate === undefined || candidate === null) return String(item);
    if (typeof candidate === "object") return JSON.stringify(candidate);
    return String(candidate);
  };

  const handleRoomSpecialityToggle = (room: number, speciality: string) => {
    // Prevent toggling the default speciality
    const DEFAULT_SPECIALITY = "General Practice";
    if (speciality === DEFAULT_SPECIALITY) return;

    setRoomConfig((prev) => {
      const existing = prev[room] || [];
      return {
        ...prev,
        [room]: existing.includes(speciality)
          ? existing.filter((s) => s !== speciality)
          : [...existing, speciality],
      };
    });
  };

  const handleAddRoom = () => {
    const next = numRooms + 1;
    setNumRooms(next);
    setRoomConfig((prev) => ({ ...prev, [next]: ["General Practice"] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build facility payload and pass to onSubmit if provided
    const payload: Facility = {
      name: facilityName,
      state: selectedState,
      address,
      totalRooms: numRooms,
      specialties: Object.values(roomConfig).flat().map((s) => String(s)),
      roomDetails: Object.values(roomConfig).map((arr) => arr.join(', ')),
    };

    if (onSubmit) onSubmit(payload);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add New Facility</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <p className={styles.subtext}>
          Create a new medical facility with rooms
        </p>

        <div className={styles.infoBox}>
          <Info size={18} />
          <p>
            <strong>Important:</strong> All rooms automatically support{" "}
            <b>General Practice</b>. You can add additional specialties to each room.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Facility Information */}
          <div className={styles.section}>
            <h4>Facility Information</h4>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Facility Name *</label>
                <input
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  placeholder="e.g. Alexandria Hospital"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Address *</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 13 West Trott Road"
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>State *</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required
                >
                  <option value="">Select state</option>
                  {states.map((s, i) => (
                    <option key={i} value={extractId(s)}>
                      {extractName(s)}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Number of Rooms *</label>
                <input
                  type="number"
                  min={1}
                  value={numRooms}
                  onChange={(e) => setNumRooms(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Room Configuration */}
          <div className={styles.section}>
            <h4>Room Specialties Configuration</h4>

            {[...Array(numRooms)].map((_, i) => {
              const room = i + 1;
              const selected = roomConfig[room] || [];

              return (
                <div key={room} className={styles.roomBox}>
                  <div className={styles.roomHeader}>
                    <strong>Room {room}</strong>
                    <span className={styles.badge}>
                      {selected.length} specialties
                    </span>
                  </div>

                  <div className={styles.specialityGrid}>
                    {specialities.map((sp) => {
                      const name = extractName(sp);
                      const DEFAULT_SPECIALITY = "General Practice";
                      const locked = name === DEFAULT_SPECIALITY;

                      return (
                        <label
                          key={name}
                          className={`${styles.checkboxLabel} ${
                            locked ? styles.locked : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(name) || locked}
                            disabled={locked}
                            onChange={
                              locked
                                ? undefined
                                : () => handleRoomSpecialityToggle(room, name)
                            }
                          />
                          {name}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddRoom}
              className={styles.addRoomBtn}
            >
              + Add Another Room
            </button>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              Create Facility
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFacility;
