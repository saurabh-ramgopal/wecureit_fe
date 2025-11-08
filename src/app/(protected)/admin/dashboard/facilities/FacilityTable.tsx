"use client";
import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import styles from "../AdminDashboard.module.scss";
import localStyles from "./FacilityTable.module.scss";
import AddFacility, { type Facility as AddFacilityType } from "./AddFacility";
import { getFacilities, addOrUpdateFacility, deleteFacility, getSpecialities } from "../../../../../lib/api";

// facilities will be loaded from the backend on mount

const FacilityTable = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [facilities, setFacilities] = useState<AddFacilityType[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<AddFacilityType | null>(null);
  const [specMapState, setSpecMapState] = useState<Record<string, string>>({});

  const refreshFacilities = useCallback(async () => {
    try {
      const res = await getFacilities();
      // Fetch all specialities once so we can map ids -> names for room-level display
  let allSpecialities: Record<string, unknown>[] = [];
      try {
        const specResp = await getSpecialities();
        allSpecialities = Array.isArray(specResp) ? (specResp as Record<string, unknown>[]) : [];
      } catch (e) {
        console.warn('Failed to fetch speciality master list; room specialty names will show ids', e);
      }
      const specMap: Record<string, string> = {};
      for (const s of allSpecialities) {
        const id = String((s['specialityMasterId'] ?? s['speciality_master_id'] ?? '') as string);
        const name = String((s['specialityName'] ?? s['speciality_name'] ?? s['speciality'] ?? s['name'] ?? id) as string);
        if (id) specMap[id] = name;
      }
      // expose specMap to render logic
      setSpecMapState(specMap);
      if (Array.isArray(res)) {
        // Filter out inactive facilities (backend returns isActive flag)
  const activeRes = (res as any[]).filter((f) => {
          const ff = f as Record<string, unknown>;
          // treat explicit false (boolean or string) as inactive
          if (ff['isActive'] === false) return false;
          if (typeof ff['isActive'] === 'string' && String(ff['isActive']).toLowerCase() === 'false') return false;
          return true;
        });
        // Backend returns FacilityMaster entities which look like:
        // { facilityMasterId, facilityName, noOfRooms, facilityStreet, facilityCity, isActive }
        // Map them into the AddFacilityType shape used by the FE components.
        const normalized = activeRes.map((ff) => {
          const id = ff['facilityMasterId'] ?? ff['facility_master_id'] ?? '';

          // helper to map spec master list to ids/names
          const facilitySpecs = Array.isArray(ff['speciality']) ? (ff['speciality'] as any[]) : [];
          const facilitySpecIds = facilitySpecs.map((s) => String(s['specialityMasterId'] ?? s['speciality_master_id'] ?? '')).filter(Boolean);
          const facilitySpecNames = facilitySpecs.map((s) => String(s['specialityName'] ?? s['speciality_name'] ?? s['name'] ?? '')).filter(Boolean);

          // parse backend roomDetails if present
          let parsedRooms: unknown[] = [];
          if (Array.isArray(ff['roomDetails'])) {
            parsedRooms = (ff['roomDetails'] as unknown[]).map((r) => {
              if (typeof r === 'string') return String(r);
              const obj = (r as Record<string, unknown>) || {};
              const roomNumber = (obj['roomNumber'] ?? obj['room_number']) as number | undefined;
              const roomLabel = (obj['roomLabel'] ?? obj['room_label'] ?? (roomNumber ? `Room ${roomNumber}` : undefined)) as string | undefined;

              const possibleLists = [obj['specialityList'], obj['specialityIds'], obj['specialities'], obj['specialties'], obj['speciality']];
              let ids: string[] = [];
              let names: string[] = [];
              for (const lst of possibleLists) {
                if (!lst) continue;
                if (Array.isArray(lst)) {
                  if (lst.length === 0) { ids = []; names = []; break; }
                  const first = lst[0];
                  if (typeof first === 'string') {
                    ids = (lst as string[]).map((x) => String(x));
                    names = ids.map((id) => specMap[id] ?? id);
                    break;
                  }
                  if (typeof first === 'object') {
                    const arr = lst as Record<string, unknown>[];
                    const extractedIds: string[] = [];
                    const extractedNames: string[] = [];
                    for (const el of arr) {
                      const idv = String(el['specialityMasterId'] ?? el['speciality_master_id'] ?? el['id'] ?? el['specialityId'] ?? el['speciality'] ?? '');
                      const nm = String(el['specialityName'] ?? el['speciality_name'] ?? el['name'] ?? el['label'] ?? idv);
                      if (idv) extractedIds.push(idv);
                      if (nm) extractedNames.push(nm);
                    }
                    if (extractedIds.length > 0) ids = extractedIds;
                    if (extractedNames.length > 0) names = extractedNames;
                    if (ids.length > 0 && names.length === 0) names = ids.map((id) => specMap[id] ?? id);
                    break;
                  }
                }
              }
              if (ids.length === 0 && names.length === 0 && obj['speciality_name']) {
                names = [String(obj['speciality_name'])];
              }
              return {
                raw: obj,
                roomNumber,
                roomLabel,
                specialityIds: ids,
                specialityNames: names,
              } as unknown;
            });
          }

          // fallback: synthesize rooms from noOfRooms and facility-level specialities
          if ((parsedRooms.length === 0 || parsedRooms.every((r) => !r)) && typeof ff['noOfRooms'] === 'number' && (ff['noOfRooms'] as number) > 0) {
            const n = ff['noOfRooms'] as number;
            const synth: unknown[] = [];
            for (let i = 1; i <= n; i++) {
              synth.push({
                roomNumber: i,
                roomLabel: `Room ${i}`,
                specialityIds: facilitySpecIds,
                specialityNames: facilitySpecNames.length > 0 ? facilitySpecNames : facilitySpecIds.map((id: string) => specMap[id] ?? id),
              });
            }
            parsedRooms = synth;
          }

          const normalizedFacility: AddFacilityType = {
            name: String(ff['facilityName'] ?? ff['facility_name'] ?? ''),
            state: String(ff['stateName'] ?? ff['state_name'] ?? ff['facilityCity'] ?? ff['facility_city'] ?? ''),
            address: [ff['facilityStreet'] ?? ff['facility_street'] ?? '', ff['facilityCity'] ?? ff['facility_city'] ?? '']
              .filter(Boolean)
              .join(', '),
            totalRooms: typeof ff['noOfRooms'] === 'number' ? (ff['noOfRooms'] as number) : Number(ff['no_of_rooms'] ?? 0),
            specialties: facilitySpecNames.length > 0 ? facilitySpecNames : facilitySpecIds.map((id) => specMap[id] ?? id),
            roomDetails: parsedRooms as any,
            facilityMasterId: String(id),
          };

          return normalizedFacility;
        });
        console.debug('getFacilities normalized sample', normalized[0]);

  setFacilities(sortFacilities(normalized));
      } else console.warn('getFacilities returned non-array', res);
    } catch (err) {
      console.error('Failed to fetch facilities', err);
    }
  }, []);

  useEffect(() => {
    void refreshFacilities();
  }, [refreshFacilities]);

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

  // Keep facilities consistently sorted by name (case-insensitive)
  const sortFacilities = (arr: AddFacilityType[]) =>
    arr
      .slice()
      .sort((a, b) =>
        String(a?.name ?? "").localeCompare(String(b?.name ?? ""), undefined, { sensitivity: "base" })
      );

  // Try to derive a displayable state/city for a facility.
  // Prefer explicit `state` field; fallback to parsing the last segment of `address` (e.g. "123 St, City")
  const getFacilityState = (f: AddFacilityType) => {
    if (f?.state) return String(f.state);
    const addr = f?.address ?? '';
    if (typeof addr === 'string' && addr.includes(',')) {
      const parts = addr.split(',').map((p) => p.trim()).filter(Boolean);
      if (parts.length > 1) return parts[parts.length - 1];
    }
    return '';
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
      <div className={localStyles.grid}>
        {facilities.map((f, i) => (
          <div key={i} className={localStyles.card}>
            {/* Facility Name + Actions */}
            <div className={localStyles.cardTop}>
              <div>
                <h3 className={localStyles.facilityName}>
                  {String((f.name ?? ((typeof f.address === 'string' && f.address.split(',')[0]) || (f as Record<string, unknown>)['facilityMasterId'])) ?? '')}
                </h3>

                <p className={localStyles.stateRow}>
                  <MapPin size={14} /> {extractStateName((f as AddFacilityType).state ?? getFacilityState(f))}
                </p>
              </div>

              <div className={localStyles.actions}>
                <button
                  className={styles.iconButton}
                  onClick={() => {
                    setSelectedFacility(f);
                    setShowAddModal(true);
                  }}
                >
                  <Pencil className={styles.iconEdit} size={16} />
                </button>
                <button
                  className={styles.iconButton}
                  onClick={async () => {
                    const _displayName = String((f.name ?? ((typeof f.address === 'string' && f.address.split(',')[0]) || (f as Record<string, unknown>)['facilityMasterId'])) ?? '');
                    if (!confirm(`Delete facility ${_displayName}?`)) return;
                    try {
                      // prefer to delete by id if available
                      const ff = f as Record<string, unknown>;
                      const id = ff['facilityMasterId'] ?? ff['facility_master_id'] ?? undefined;
                      if (!id) {
                        alert('Cannot delete facility: missing id');
                        return;
                      }
                      // Backend expects a DeleteFacilityRequest { facilityMasterId, isActive }
                      // Set isActive=false to mark the facility as deleted (soft delete)
                      await deleteFacility({ facilityMasterId: id, isActive: false });
                      // Refresh from backend to ensure DB state is reflected in the UI
                      await refreshFacilities();
                    } catch (err) {
                      console.error('deleteFacility failed', err);
                      alert('Failed to delete facility');
                    }
                  }}
                >
                  <Trash2 className={styles.iconDelete} size={16} />
                </button>
              </div>
            </div>

            {/* Address + Rooms */}
            <p className={localStyles.info}>
              <strong>Address:</strong> {f.address}
            </p>
            <p className={localStyles.infoStrong}>
              <strong>Total Rooms:</strong> {f.totalRooms} rooms
            </p>

            {/* Specialties section intentionally removed: UI simplified to show per-room specialties only */}

            {/* Room Details */}
            <div>
              <p className={localStyles.sectionTitle}>Room Details:</p>
              <div className={localStyles.roomContainer}>
                {(Array.isArray(f.roomDetails) ? f.roomDetails : []).map((r, idx) => {
                  // r may be a string (legacy) or a structured object { roomNumber, roomLabel, specialityNames }
                  if (!r) return null;
                  if (typeof r === 'string') {
                    return (
                      <p key={idx} className={localStyles.roomParagraph}>
                        <strong>Room {idx + 1}:</strong> {r}
                      </p>
                    );
                  }
                  const roomObj = r as Record<string, unknown>;
                  const roomNumber = roomObj.roomNumber ?? roomObj.room_number ?? (idx + 1);
                  const roomLabel = roomObj.roomLabel ?? roomObj.room_label ?? `Room ${roomNumber}`;
                  const maybeSpecNames = roomObj['specialityNames'] ?? roomObj['specialityList'];

                  // normalize speciality entries (may be strings, ids, or objects)
                  const specNames: string[] = Array.isArray(maybeSpecNames)
                    ? (maybeSpecNames as unknown[]).map((entry) => {
                        if (entry === null || entry === undefined) return '';
                        if (typeof entry === 'string') {
                          // could be id or name; prefer mapping id->name
                          return specMapState[entry] ?? entry;
                        }
                        // entry may be an object with various shapes
                        const e = entry as Record<string, unknown>;
                        const nm = (e['specialityName'] ?? e['speciality_name'] ?? e['name'] ?? e['label'] ?? e['speciality'] ?? e['specialityMaster'] ?? e['speciality_master'] ?? undefined);
                        if (nm && typeof nm === 'string') return nm;
                        // nested specialityMaster object with its own fields
                        if (typeof e['specialityMaster'] === 'object' && e['specialityMaster'] !== null) {
                          const sm = e['specialityMaster'] as Record<string, unknown>;
                          const nm2 = (sm['specialityName'] ?? sm['speciality_name'] ?? sm['name'] ?? undefined) as string | undefined;
                          if (nm2) return nm2;
                        }
                        // fallback to id fields or stringify the object so we don't render [object Object]
                        const id = String(e['specialityMasterId'] ?? e['speciality_master_id'] ?? e['id'] ?? e['specialityId'] ?? e['speciality'] ?? '');
                        return specMapState[id] ?? (id ? id : JSON.stringify(e));
                      }).filter(Boolean)
                    : [];

                  return (
                    <div key={idx} className={localStyles.roomCard}>
                      <div className={localStyles.roomHeader}>
                        <strong>{String(roomLabel)}</strong>
                        {
                          // avoid showing duplicate number when label already contains it (e.g. "Room 1")
                          (() => {
                            const labelStr = String(roomLabel ?? '');
                            const num = roomNumber ?? (idx + 1);
                            const labelHasNumber = /\b(room\s*\d+)\b/i.test(labelStr) || new RegExp(`\\b${num}\\b`).test(labelStr);
                            if (!labelHasNumber) return <span className={localStyles.roomNumber}>#{String(num)}</span>;
                            return null;
                          })()
                        }
                      </div>
                      <div className={localStyles.roomSpecs}>
                        {specNames.length > 0 ? (
                          specNames.map((s, i2) => (
                            <span key={i2} className={styles.badge} style={{ marginRight: 6 }}>
                              {String(s)}
                            </span>
                          ))
                        ) : (
                          <em className={localStyles.noSpecs}>No specialties</em>
                        )}
                      </div>
                    </div>
                  );
                })}
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
          onSubmit={async (backendPayload) => {
            if (!backendPayload) {
              setShowAddModal(false);
              setSelectedFacility(null);
              return;
            }

            try {
              // Send to backend and then refresh the authoritative list.
              // This ensures we display the normalized room/speciality data the server returns
              // and avoids coercing objects into the string "[object Object]".
              await addOrUpdateFacility(backendPayload as Record<string, unknown>);
              await refreshFacilities();
            } catch (err) {
              console.error('addOrUpdateFacility failed', err);
              const msg = (err as Error)?.message ?? 'Failed to save facility';
              alert(msg);
              return;
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
