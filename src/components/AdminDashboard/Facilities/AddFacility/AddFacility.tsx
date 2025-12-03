"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddFacility.module.scss";
import { X, Info, Trash2 } from "lucide-react";
import { getStates, getSpecialities } from "../../../../lib/api";

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

  
  useEffect(() => {
    if (!facility) return;
    setFacilityName(facility.name ?? "");
    setAddress(facility.address ?? "");
    const rooms = facility.totalRooms ?? 1;
    setNumRooms(rooms);
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
      
      if (!specialties.includes('General Practice')) specialties.unshift('General Practice');
      
      rc[i + 1] = Array.from(new Set(specialties));
    }
    setRoomConfig(rc);
  }, [facility]);


  
  const extractId = (item: unknown) => {
    const it = item as Record<string, unknown>;
    const candidate =
      it["id"] ??
      it["stateCode"] ??
      it["state_code"] ??
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

  const getFacilityIdFromRecord = (rec: Record<string, unknown> | undefined): string | undefined => {
    if (!rec) return undefined;
    const tryKeys = ['facilityMasterId', 'facility_master_id', 'facilityId', 'facility_id', 'id'];
    for (const k of tryKeys) {
      const v = rec[k];
      if (v === undefined || v === null) continue;
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
      return extractId(v);
    }
    return undefined;
  };


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


  const DEFAULT_SPECIALITY = "General Practice";


  useEffect(() => {
    if (!facility) return;
    if (!Array.isArray(states) || states.length === 0) return;
  
    let facilityStateValue = (facility as Record<string, unknown>)['stateCode'] ?? (facility as Record<string, unknown>)['state'] ?? (facility as Record<string, unknown>)['stateName'] ?? '';

  
    if (typeof facilityStateValue === 'string') {
      const s = facilityStateValue.trim();
      if (s.startsWith('{') && s.endsWith('}')) {
        try {
          const parsed = JSON.parse(s) as Record<string, unknown>;
          facilityStateValue = parsed['stateCode'] ?? parsed['code'] ?? parsed['id'] ?? parsed['state_id'] ?? parsed['stateMasterId'] ?? parsed['state_master_id'] ?? facilityStateValue;
        } catch {
        }
      }
    }

    
    if (typeof console !== 'undefined' && typeof console.debug === 'function') {
      console.debug('AddFacility prefill: facilityStateValue (post-parse) =', facilityStateValue, 'selectedState currently =', selectedState);
      console.debug('AddFacility available states sample', states.slice(0, 10));
    }
    if (!facilityStateValue) return;

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

  
    setSelectedState(String(facilityStateValue));

  }, [facility, states, selectedState]);

  
  useEffect(() => {
    if (!facility) return;
    if (!Array.isArray(specialities) || specialities.length === 0) return;

    
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

    
    const flat = (facility as Record<string, unknown>)['specialties'] as string[] | undefined;
    if (Array.isArray(flat) && flat.length > 0) {
      const names = flat.map((x) => String(x));
      const rc: Record<number, string[]> = { 1: Array.from(new Set(["General Practice", ...names])) };
      setNumRooms(1);
      setRoomConfig(rc);
      return;
    }

    
    const specialityObjs = (facility as Record<string, unknown>)['speciality'] as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(specialityObjs) && specialityObjs.length > 0) {
      const names = specialityObjs.map((s) => String(s['specialityName'] ?? s['speciality_name'] ?? s['name'] ?? s['speciality'] ?? '')).filter(Boolean);
      const rc: Record<number, string[]> = { 1: Array.from(new Set(["General Practice", ...names])) };
      setNumRooms(1);
      setRoomConfig(rc);
    }
  }, [facility, specialities]);

  const handleRoomSpecialityToggle = (room: number, speciality: string) => {
    
    if (speciality === DEFAULT_SPECIALITY) return;

    setRoomConfig((prev) => {
      const existing = prev[room] || [];
      const hasOther = existing.some((s) => s !== DEFAULT_SPECIALITY);

      
      if (existing.includes(speciality)) {
        return {
          ...prev,
          [room]: existing.filter((s) => s !== speciality),
        };
      }

      
      if (hasOther) {
        return prev;
      }

      
      return {
        ...prev,
        [room]: [...existing, speciality],
      };
    });
  };

  const handleAddRoom = () => {
    const next = numRooms + 1;
    setNumRooms(next);
    setRoomConfig((prev) => ({ ...prev, [next]: ["General Practice"] }));
  };

  const handleDeleteRoom = (roomToDelete: number) => {
    
    if (numRooms <= 1) return;
    
    setDeletingRooms((prev) => ({ ...prev, [roomToDelete]: true }));

    
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
  let facilityStreet = address;
    if (address && address.includes(',')) {
      const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
      facilityStreet = parts.slice(0, parts.length - 1).join(', ');
    }

    
  const roomDetailsStructured: Array<Record<string, unknown>> = [];

    
  const gpEntry = specialities.find((sp) => extractName(sp) === DEFAULT_SPECIALITY);
  const gpId = gpEntry ? extractId(gpEntry) : DEFAULT_SPECIALITY;

    const specialityListOrdered: string[] = [];

    for (let roomNumber = 1; roomNumber <= Math.max(1, Number(numRooms) || 1); roomNumber++) {
      const rawNames = Array.isArray(roomConfig[roomNumber]) && roomConfig[roomNumber].length > 0
        ? roomConfig[roomNumber]
        : [DEFAULT_SPECIALITY];
      const names = (rawNames as string[]).map((s) => String(s));

      
      const ids = names.map((name) => {
        const found = specialities.find((sp) => extractName(sp) === name);
        return found ? extractId(found) : name;
      });
      const namesForIds = ids.map((id) => {
        const found = specialities.find((sp) => extractId(sp) === String(id));
        return found ? extractName(found) : String(id);
      });

      const hasNonGpInRoom = namesForIds.some((n) => String(n) !== DEFAULT_SPECIALITY);
      const roomSpecIds = hasNonGpInRoom ? ids.filter((id, idx) => String(namesForIds[idx]) !== DEFAULT_SPECIALITY) : ids;
      const roomSpecNames = hasNonGpInRoom ? namesForIds.filter((n) => String(n) !== DEFAULT_SPECIALITY) : namesForIds;

      roomDetailsStructured.push({ roomNumber, roomLabel: `Room ${roomNumber}`, specialityList: roomSpecIds, specialityNames: roomSpecNames });
      // If the room only has General Practice, add the GP id/code once for this room.
      if (roomSpecNames.length === 1 && String(roomSpecNames[0]) === DEFAULT_SPECIALITY) {
        if (gpId) specialityListOrdered.push(String(gpId));
        else specialityListOrdered.push(DEFAULT_SPECIALITY);
        continue;
      }

      // Otherwise, pick the first non-default speciality for this room and add its id/code.
      const nonDefault = ids.find((id) => {
        const foundSp = specialities.find((sp) => extractId(sp) === id);
        const label = foundSp ? extractName(foundSp) : id;
        return label !== DEFAULT_SPECIALITY;
      });
      if (nonDefault) {
        specialityListOrdered.push(String(nonDefault));
      }
    }

    const specialityList = specialityListOrdered;

    const ff = facility as Record<string, unknown> | undefined;

    const rawIsActive = ff?.['isActive'] ?? ff?.['is_active'] ?? ff?.['active'];
    let normalizedIsActive: boolean | undefined = undefined;
    if (rawIsActive !== undefined && rawIsActive !== null) {
      if (typeof rawIsActive === 'boolean') normalizedIsActive = rawIsActive;
      else if (typeof rawIsActive === 'string') {
        const s = rawIsActive.trim().toLowerCase();
        if (s === 'true' || s === '1') normalizedIsActive = true;
        else if (s === 'false' || s === '0') normalizedIsActive = false;
      } else {
        normalizedIsActive = Boolean(rawIsActive);
      }
    }

    let resolvedStateCode: string | undefined = undefined;
    if (selectedState) resolvedStateCode = selectedState;
    if (!resolvedStateCode && address) {
      const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
      const last = parts.length ? parts[parts.length - 1] : '';
      if (last && Array.isArray(states) && states.length > 0) {
        const match = states.find((s) => extractName(s).toLowerCase() === String(last).toLowerCase());
        if (match) resolvedStateCode = extractId(match);
      }
    }
    if (!resolvedStateCode && ff) {
      if (ff['stateCode']) resolvedStateCode = String(ff['stateCode']);
      else if (ff['state_code']) resolvedStateCode = String(ff['state_code']);
      else if (ff['stateName']) resolvedStateCode = String(ff['stateName']);
    }

    const resolvedFacilityId = getFacilityIdFromRecord(ff) ?? undefined;

    const createPayload: Record<string, unknown> = {
      facilityMasterId: resolvedFacilityId ?? undefined,
      facilityName: facilityName,
      noOfRooms: numRooms,
      facilityStreet: facilityStreet || undefined,
      isActive: normalizedIsActive ?? undefined,
      stateCode: resolvedStateCode || undefined,
      specialityList,
    };

    const updatePayload: Record<string, unknown> = {
      facilityMasterId: resolvedFacilityId ?? undefined,
      facilityName: facilityName,
      noOfRooms: numRooms,
      facilityStreet: facilityStreet || undefined,
      isActive: normalizedIsActive ?? undefined,
      stateCode: resolvedStateCode ?? (ff?.['stateCode'] as string | undefined) ?? undefined,
      specialityList,
    };

    const chosen = facility ? updatePayload : createPayload;
    const backendPayload: Record<string, unknown> = Object.fromEntries(
      Object.entries(chosen).filter(([, v]) => v !== undefined)
    );

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
                {!facility && (
                  <div className={styles.field}>
                    <label>State *</label>
                    <select
                      id="facility-state-select"
                      aria-label="Select state"
                      value={selectedState}
                      onChange={(e) => {
                        if (typeof console !== 'undefined' && typeof console.debug === 'function') console.debug('State select onChange ->', (e.target as HTMLSelectElement).value);
                        setSelectedState(e.target.value);
                      }}
                      onClick={() => { if (typeof console !== 'undefined' && typeof console.debug === 'function') console.debug('State select clicked'); }}
                      onMouseDown={() => { if (typeof console !== 'undefined' && typeof console.debug === 'function') console.debug('State select mousedown'); }}
                      onFocus={() => { if (typeof console !== 'undefined' && typeof console.debug === 'function') console.debug('State select focus'); }}
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
                )}
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

          
          <div className={styles.section}>
            <h4>Room Specialties Configuration</h4>

            
            {(() => {
              if (typeof console !== 'undefined' && typeof console.debug === 'function') {
                console.debug('roomConfig render', roomConfig);
              }
              return null;
            })()}
            {[...Array(numRooms)].map((_, i) => {
              const room = i + 1;
      
              const selected = Array.isArray(roomConfig[room]) ? ([...roomConfig[room] as string[]]) : [];

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
                      const locked = name === DEFAULT_SPECIALITY;
                      const otherSelected = (selected || []).some((s) => s !== DEFAULT_SPECIALITY && s !== name);
                      const disabled = locked ? true : (otherSelected && !selected.includes(name));

                      return (
                        <label
                          key={name}
                          className={`${styles.checkboxLabel} ${locked ? styles.locked : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(name) || locked}
                            disabled={disabled}
                            onChange={locked ? undefined : () => handleRoomSpecialityToggle(room, name)}
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
