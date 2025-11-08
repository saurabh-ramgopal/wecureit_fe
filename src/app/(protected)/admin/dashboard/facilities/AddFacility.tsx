"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddFacility.module.scss";
import { X, Info, Trash2 } from "lucide-react";
import { getStates, getSpecialities } from "../../../../../lib/api";

// Minimal exported Facility type so other modules can import it for typing
export type Facility = {
  facilityMasterId?: string;
  name: string;
  state: string;
  address: string;
  totalRooms: number;
  specialties: string[];
  roomDetails: unknown[];
};

interface AddFacilityProps {
  onClose: () => void;
  // when provided, onSubmit receives the backend-shaped AddOrUpdateFacilityRequest object
  onSubmit?: (payload?: Record<string, unknown>) => void;
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
  const [deletingRooms, setDeletingRooms] = useState<Record<number, boolean>>({});

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
    const rooms = facility.totalRooms ?? 1;
    setNumRooms(rooms);
    // Build roomConfig from roomDetails. Support multiple shapes:
    // - legacy: array of comma-separated strings
    // - array of objects: { roomNumber, roomLabel, specialityNames: string[] } or { specialityList: [ids|objects|names] }
    // - array of arrays
    const rc: Record<number, string[]> = {};
    const rawRooms = (facility as Record<string, unknown>)['roomDetails'] as unknown[] | undefined;
    for (let i = 0; i < rooms; i++) {
      const entry = rawRooms?.[i];
      let specialties: string[] = [];

      if (entry === undefined || entry === null) {
        specialties = ['General Practice'];
      } else if (typeof entry === 'string') {
        specialties = entry.split(',').map((s) => s.trim()).filter(Boolean);
      } else if (Array.isArray(entry)) {
        // array of names or objects
        if (entry.length === 0) specialties = [];
        else if (typeof entry[0] === 'string') specialties = (entry as string[]).map((s) => String(s));
        else specialties = (entry as Record<string, unknown>[]).map((el) => String(el['specialityName'] ?? el['speciality_name'] ?? el['name'] ?? el['speciality'] ?? el['label'] ?? ''));
      } else if (typeof entry === 'object') {
        const obj = entry as Record<string, unknown>;
        if (Array.isArray(obj['specialityNames'])) {
          specialties = (obj['specialityNames'] as unknown[]).map((s) => String(s));
        } else if (Array.isArray(obj['specialityList'])) {
          const list = obj['specialityList'] as unknown[];
          if (list.length > 0 && typeof list[0] === 'string') specialties = (list as string[]).map((s) => String(s));
          else specialties = (list as Record<string, unknown>[]).map((el) => String(el['specialityName'] ?? el['speciality_name'] ?? el['name'] ?? el['speciality'] ?? el['label'] ?? ''));
        } else if (Array.isArray(obj['specialities']) || Array.isArray(obj['specialties'])) {
          const list = (obj['specialities'] ?? obj['specialties']) as unknown[];
          specialties = list.map((el) => (typeof el === 'string' ? String(el) : String((el as Record<string, unknown>)['specialityName'] ?? (el as Record<string, unknown>)['speciality_name'] ?? (el as Record<string, unknown>)['name'] ?? (el as Record<string, unknown>)['speciality'] ?? '')));
        } else if (obj['specialityName']) {
          specialties = [String(obj['specialityName'])];
        }
      }

      if (!specialties || specialties.length === 0) specialties = ['General Practice'];
      // ensure default is present
      if (!specialties.includes('General Practice')) specialties.unshift('General Practice');
      // dedupe
      rc[i + 1] = Array.from(new Set(specialties));
    }
    setRoomConfig(rc);
  }, [facility]);


  // Helper extractors to avoid `any` and handle variable backend field names
  const extractId = (item: unknown) => {
    const it = item as Record<string, unknown>;
    // Prefer common id field names used by different master tables.
    // Ensure we include speciality keys (specialityMasterId / speciality_master_id)
    const candidate =
      it["id"] ??
      it["specialityMasterId"] ??
      it["speciality_master_id"] ??
      it["speciality_id"] ??
      it["stateId"] ??
      it["state_master_id"] ??
      it["stateMasterId"] ??
      it["code"];
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

  // parse a roomDetails entry into an array of speciality names
  const parseRoomEntry = (entry: unknown): string[] => {
    if (entry === undefined || entry === null) return ['General Practice'];
    if (typeof entry === 'string') return entry.split(',').map((s) => s.trim()).filter(Boolean);
    if (Array.isArray(entry)) {
      if (entry.length === 0) return [];
      if (typeof entry[0] === 'string') return (entry as string[]).map((s) => String(s));
      return (entry as Record<string, unknown>[]).map((el) => String(el['specialityName'] ?? el['speciality_name'] ?? el['name'] ?? el['speciality'] ?? el['label'] ?? '')).filter(Boolean);
    }
    if (typeof entry === 'object') {
      const obj = entry as Record<string, unknown>;
      if (Array.isArray(obj['specialityNames'])) return (obj['specialityNames'] as unknown[]).map((s) => String(s)).filter(Boolean);
      if (Array.isArray(obj['specialityList'])) {
        const list = obj['specialityList'] as unknown[];
        if (list.length > 0 && typeof list[0] === 'string') return (list as string[]).map((s) => String(s));
        return (list as Record<string, unknown>[]).map((el) => String(el['specialityName'] ?? el['speciality_name'] ?? el['name'] ?? el['speciality'] ?? el['label'] ?? '')).filter(Boolean);
      }
      if (Array.isArray(obj['specialities']) || Array.isArray(obj['specialties'])) {
        const list = (obj['specialities'] ?? obj['specialties']) as unknown[];
        return list.map((el) => (typeof el === 'string' ? String(el) : String((el as Record<string, unknown>)['specialityName'] ?? (el as Record<string, unknown>)['speciality_name'] ?? (el as Record<string, unknown>)['name'] ?? (el as Record<string, unknown>)['speciality'] ?? ''))).filter(Boolean);
      }
      if (obj['specialityName']) return [String(obj['specialityName'])];
    }
    return ['General Practice'];
  };

  // When editing an existing facility, the backend may provide the state as a name
  // (e.g. "Virginia"). Our <select> uses state IDs as values, so once `states`
  // are loaded we should map the facility.state (name or id) to the matching
  // state's id so the correct option is selected.
  useEffect(() => {
    if (!facility) return;
    if (!Array.isArray(states) || states.length === 0) return;
    const facilityStateValue = (facility as Record<string, unknown>)['state'] ?? (facility as Record<string, unknown>)['stateName'] ?? '';
    if (!facilityStateValue) return;

    // try to match by id first, then by display name
    const byId = states.find((s) => extractId(s) === String(facilityStateValue));
    if (byId) {
      setSelectedState(extractId(byId));
      return;
    }

    const byName = states.find((s) => extractName(s) === String(facilityStateValue));
    if (byName) {
      setSelectedState(extractId(byName));
      return;
    }

    // Fallback: set the raw value (the select will fall back to empty)
    setSelectedState(String(facilityStateValue));
  }, [facility, states]);

  // Ensure specialties are pre-selected when editing.
  // Two possible shapes may be present on the facility prop:
  // - roomDetails: string[] where each element is a comma-separated list of speciality names for that room
  // - specialties: string[] (flattened list of speciality names)
  // If speciality master objects are present on the facility (unlikely here), we also handle that.
  useEffect(() => {
    if (!facility) return;
    if (!Array.isArray(specialities) || specialities.length === 0) return;

    // If roomDetails already exists on the facility prop, prefer that
    const fd = (facility as Record<string, unknown>)['roomDetails'] as unknown[] | undefined;
    if (Array.isArray(fd) && fd.length > 0) {
      const rooms = fd.length;
      setNumRooms(rooms);
      const rc: Record<number, string[]> = {};
      for (let i = 0; i < rooms; i++) {
        const rawEntry = fd[i];
        const parsed = parseRoomEntry(rawEntry);
        if (!parsed.includes('General Practice')) parsed.unshift('General Practice');
        rc[i + 1] = Array.from(new Set(parsed));
      }
      setRoomConfig(rc);
      return;
    }

    // Otherwise, look for a flattened `specialties` array on the facility and put them into room 1
    const flat = (facility as Record<string, unknown>)['specialties'] as string[] | undefined;
    if (Array.isArray(flat) && flat.length > 0) {
      const names = flat.map((x) => String(x));
      const rc: Record<number, string[]> = { 1: Array.from(new Set(["General Practice", ...names])) };
      setNumRooms(1);
      setRoomConfig(rc);
      return;
    }

    // As a last resort, check if facility has `speciality` objects (from backend) and map them
    const specialityObjs = (facility as Record<string, unknown>)['speciality'] as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(specialityObjs) && specialityObjs.length > 0) {
      const names = specialityObjs.map((s) => String(s['specialityName'] ?? s['speciality_name'] ?? s['name'] ?? s['speciality'] ?? '')).filter(Boolean);
      const rc: Record<number, string[]> = { 1: Array.from(new Set(["General Practice", ...names])) };
      setNumRooms(1);
      setRoomConfig(rc);
    }
  }, [facility, specialities]);

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

  const handleDeleteRoom = (roomToDelete: number) => {
    // Prevent deleting the last room
    if (numRooms <= 1) return;
    // mark room as deleting so we can play an animation
    setDeletingRooms((prev) => ({ ...prev, [roomToDelete]: true }));

    // wait for animation to play, then actually remove and reindex
    window.setTimeout(() => {
      setRoomConfig((prev) => {
        const newMap: Record<number, string[]> = {};
        let idx = 1;
        for (let r = 1; r <= numRooms; r++) {
          if (r === roomToDelete) continue;
          const arr = prev[r] ?? ["General Practice"];
          newMap[idx++] = Array.from(new Set(arr));
        }
        return newMap;
      });
      setNumRooms((n) => Math.max(1, n - 1));
      setDeletingRooms((prev) => {
        const copy = { ...prev };
        delete copy[roomToDelete];
        return copy;
      });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build backend-shaped payload AddOrUpdateFacilityRequest
    // Split address into street and city when possible
    let facilityStreet = address;
    let facilityCity = '';
    if (address && address.includes(',')) {
      const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
      facilityCity = parts.length > 1 ? parts[parts.length - 1] : '';
      facilityStreet = parts.slice(0, parts.length - 1).join(', ');
    }

    // Build structured roomDetails and global specialityList as IDs using fetched specialities
    const roomDetailsStructured: Array<Record<string, unknown>> = [];
    const allSpecialityIds = new Set<string>();

    Object.keys(roomConfig).forEach((k) => {
      const roomNumber = Number(k);
      const names = (roomConfig[roomNumber] || []).map((s) => String(s));
      const ids = names.map((name) => {
        const found = specialities.find((sp) => extractName(sp) === name);
        const id = found ? extractId(found) : name;
        return id;
      });
      ids.forEach((id) => allSpecialityIds.add(String(id)));
      roomDetailsStructured.push({ roomNumber, roomLabel: `Room ${roomNumber}`, specialityList: ids });
    });

    const specialityList = Array.from(allSpecialityIds);

    const ff = facility as Record<string, unknown> | undefined;
    const backendPayload: Record<string, unknown> = {
      facilityMasterId: ff?.['facilityMasterId'] ?? undefined,
      facilityName: facilityName,
      // include selected state name so backend can persist it
      stateName: (states.find((s) => extractId(s) === selectedState) ? extractName(states.find((s) => extractId(s) === selectedState)) : selectedState) ?? undefined,
      noOfRooms: numRooms,
      facilityStreet,
      facilityCity,
      specialityList,
      // include roomDetails for frontend use (backend will ignore unknown fields)
  roomDetails: roomDetailsStructured,
    };
    // Debug: show exactly what we'll send to the backend (inspect in browser console)
    console.debug('AddFacility outgoing payload', backendPayload);

    if (onSubmit) onSubmit(backendPayload);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{facility ? 'Edit Facility' : 'Add New Facility'}</h2>
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
                <div key={room} className={`${styles.roomBox} ${deletingRooms[room] ? styles.deleting : ''}`}>
                  <div className={styles.roomHeader}>
                    <strong>Room {room}</strong>
                    <div className={styles.roomActions}>
                      <span className={styles.badge}>
                        {selected.length} specialties
                      </span>
                      <button
                        type="button"
                        title={numRooms > 1 ? `Delete Room ${room}` : "Cannot delete last room"}
                        onClick={() => handleDeleteRoom(room)}
                        className={styles.deleteRoomBtn}
                        disabled={numRooms <= 1 || Boolean(deletingRooms[room])}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  
                  {deletingRooms[room] && (
                    <div className={styles.deletingBadge} aria-hidden>
                      Deleted
                    </div>
                  )}
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
              {facility ? 'Update Facility' : 'Create Facility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFacility;
