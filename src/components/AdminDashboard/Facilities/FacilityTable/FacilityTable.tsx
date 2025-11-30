"use client";
import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import styles from "@/app/(protected)/admin/dashboard/AdminDashboard.module.scss";
import localStyles from "./FacilityTable.module.scss";
import AddFacility, { type Facility as AddFacilityType } from "../AddFacility/AddFacility";
import { getFacilities, addOrUpdateFacility, deleteFacility, getSpecialities } from "../../../../lib/api";


const FacilityTable = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [facilities, setFacilities] = useState<AddFacilityType[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<AddFacilityType | null>(null);
  

  const refreshFacilities = useCallback(async () => {
    try {
      const res = await getFacilities();
      
      if (Array.isArray(res)) {
        
        const rawArr = Array.isArray(res) ? (res as unknown[]) : [];
        
        const activeRes = rawArr.filter((f) => {
          const ff = f as Record<string, unknown>;
          
          if (ff['isActive'] === false) return false;
          if (typeof ff['isActive'] === 'string' && String(ff['isActive']).toLowerCase() === 'false') return false;
          return true;
        });
        
  const normalized = (activeRes as Record<string, unknown>[]).map((ff) => {
          const id = ff['facilityMasterId'] ?? ff['facility_master_id'] ?? '';

          
          const facilitySpecs = Array.isArray(ff['speciality']) ? (ff['speciality'] as Record<string, unknown>[]) : [];
          const facilitySpecIds = facilitySpecs.map((s) => String(s['specialityMasterId'] ?? s['speciality_master_id'] ?? '')).filter(Boolean);
          const facilitySpecNames = facilitySpecs.map((s) => String(s['specialityName'] ?? s['speciality_name'] ?? s['name'] ?? '')).filter(Boolean);

          
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
                    names = ids.map((id) => id);
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
                    if (ids.length > 0 && names.length === 0) names = ids.map((id) => id);
                    break;
                  }
                }
              }
              if (ids.length === 0 && names.length === 0 && obj['speciality_name']) {
                names = [String(obj['speciality_name'])];
              }

              const hasNonGp = names.some((n) => String(n) !== 'General Practice');
              const outIds = hasNonGp ? ids.filter((id, idx) => String(names[idx] ?? id) !== 'General Practice') : ids;
              const outNames = hasNonGp ? names.filter((n) => String(n) !== 'General Practice') : names;

              return {
                raw: obj,
                roomNumber,
                roomLabel,
                specialityIds: outIds,
                specialityNames: outNames,
              } as unknown;
            });
          }

          
          if ((parsedRooms.length === 0 || parsedRooms.every((r) => !r)) && typeof ff['noOfRooms'] === 'number' && (ff['noOfRooms'] as number) > 0) {
            const n = ff['noOfRooms'] as number;
            const synth: unknown[] = [];
            
            const idToName = new Map<string, string>();
            for (let idx = 0; idx < facilitySpecIds.length; idx++) {
              const id = facilitySpecIds[idx];
              const nm = facilitySpecNames[idx] ?? id;
              if (id) idToName.set(id, nm);
            }
            const gpEntry = facilitySpecNames.find((s) => s === 'General Practice');
            const gpId = gpEntry ? facilitySpecIds[facilitySpecNames.indexOf('General Practice')] : (facilitySpecNames.includes('General Practice') ? 'General Practice' : undefined);
            
            const nonGpIds = facilitySpecIds.filter((id) => (idToName.get(id) ?? id) !== 'General Practice');

            for (let i = 1; i <= n; i++) {
              const idsForRoom: string[] = [];
             
              if (gpId) idsForRoom.push(gpId);
              
              const extra = nonGpIds[i - 1];
              if (extra) idsForRoom.push(extra);

              let namesForRoom: string[] = idsForRoom.map((id) => idToName.get(id) ?? id);

              const hasNonGpRoom = namesForRoom.some((nm) => String(nm) !== 'General Practice');
              let finalIdsForRoom = idsForRoom;
              if (hasNonGpRoom) {
                finalIdsForRoom = idsForRoom.filter((id) => (idToName.get(id) ?? id) !== 'General Practice');
                namesForRoom = namesForRoom.filter((nm) => String(nm) !== 'General Practice');
              }

              synth.push({
                roomNumber: i,
                roomLabel: `Room ${i}`,
                specialityIds: finalIdsForRoom,
                specialityNames: namesForRoom,
              });
            }
            parsedRooms = synth;
          }

          
          const rawStateCode = ff['stateCode'] ?? ff['state_code'] ?? ff['stateId'] ?? ff['state_master_id'] ?? null;
          const rawStateName = ff['stateName'] ?? ff['state_name'] ?? null;
          const facilitySpecialtiesRaw = facilitySpecNames.length > 0 ? facilitySpecNames : facilitySpecIds.map((id) => id);
          const parsedRoomsArr = Array.isArray(parsedRooms) ? parsedRooms as Record<string, unknown>[] : [];
          const facilityHasAnyRoomWithNonGp = parsedRoomsArr.some((r) => {
            const names = Array.isArray((r as Record<string, unknown>)['specialityNames']) ? (r as Record<string, unknown>)['specialityNames'] as string[] : (Array.isArray((r as Record<string, unknown>)['specialityList']) ? (r as Record<string, unknown>)['specialityList'] as string[] : []);
            return names.some((n) => String(n) !== 'General Practice');
          });

          const specialtiesNormalized = facilityHasAnyRoomWithNonGp
            ? facilitySpecialtiesRaw.filter((s) => String(s) !== 'General Practice')
            : facilitySpecialtiesRaw;

          const normalizedFacility = {
            name: String(ff['facilityName'] ?? ff['facility_name'] ?? ''),
            state: rawStateName ? String(rawStateName) : String(ff['facilityCity'] ?? ff['facility_city'] ?? ''),
            address: [ff['facilityStreet'] ?? ff['facility_street'] ?? '', ff['facilityCity'] ?? ff['facility_city'] ?? '']
              .filter(Boolean)
              .join(', '),
            totalRooms: typeof ff['noOfRooms'] === 'number' ? (ff['noOfRooms'] as number) : Number(ff['no_of_rooms'] ?? 0),
            specialties: specialtiesNormalized,
            roomDetails: parsedRooms as unknown[],
            facilityMasterId: id ? String(id) : undefined,

            stateCode: rawStateCode !== null && rawStateCode !== undefined ? String(rawStateCode) : undefined,
            stateName: rawStateName !== null && rawStateName !== undefined ? String(rawStateName) : undefined,
          } as unknown as AddFacilityType;

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

  
  const [specialityMaster, setSpecialityMaster] = useState<Array<Record<string, unknown>>>([]);
  useEffect(() => {
    let mounted = true;
    getSpecialities()
      .then((res) => {
        if (!mounted) return;
        if (Array.isArray(res)) setSpecialityMaster(res as Array<Record<string, unknown>>);
      })
      .catch((err) => console.error('getSpecialities failed in FacilityTable', err));
    return () => { mounted = false; };
  }, []);

  
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

  
  const sortFacilities = (arr: AddFacilityType[]) =>
    arr
      .slice()
      .sort((a, b) =>
        String(a?.name ?? "").localeCompare(String(b?.name ?? ""), undefined, { sensitivity: "base" })
      );

  
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

      
      <div className={localStyles.grid}>
        {facilities.map((f, i) => (
          <div key={i} className={localStyles.card}>
            
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
                    if (typeof console !== 'undefined' && typeof console.debug === 'function') {
                      console.debug('Opening AddFacility modal with facility:', f);
                    }
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
                      
                      const ff = f as Record<string, unknown>;
                      const id = ff['facilityMasterId'] ?? ff['facility_master_id'] ?? undefined;
                      if (!id) {
                        alert('Cannot delete facility: missing id');
                        return;
                      }
                      
                      await deleteFacility({ facilityMasterId: id, isActive: false });
                      
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

            
            <p className={localStyles.info}>
              <strong>Address:</strong> {f.address}
            </p>
            <p className={localStyles.infoStrong}>
              <strong>Total Rooms:</strong> {f.totalRooms} rooms
            </p>

            
            <div>
              <p className={localStyles.sectionTitle}>Room Details:</p>
              <div className={localStyles.roomContainer}>
                {(Array.isArray(f.roomDetails) ? f.roomDetails : []).map((r, idx) => {
                  if (!r) return null;
                  
                  const roomObj = (r as Record<string, unknown>);
                  const roomNumber = roomObj.roomNumber ?? roomObj.room_number ?? (idx + 1);
                  const roomLabel = roomObj.roomLabel ?? roomObj.room_label ?? `Room ${roomNumber}`;
                  const specialityNames = Array.isArray(roomObj['specialityNames']) ? (roomObj['specialityNames'] as string[]) : (Array.isArray(roomObj['specialityList']) ? (roomObj['specialityList'] as string[]) : []);

                  
                  let labels = Array.from(new Set([...(specialityNames.length ? specialityNames.map(String) : [] )]));

                  const hasNonGp = labels.some((lbl) => String(lbl) !== 'General Practice');
                  if (!hasNonGp) {
                    if (!labels.includes('General Practice')) labels.unshift('General Practice');
                  } else {
                    labels = labels.filter((lbl) => String(lbl) !== 'General Practice');
                  }

                  return (
                    <div key={idx} className={localStyles.roomCard}>
                      <div className={localStyles.roomHeader}>
                        <strong>{String(roomLabel)}</strong>
                      </div>
                      <div className={localStyles.roomSpecs}>
                        {labels.length > 0 ? (
                          labels.map((s, i2) => (
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
              
              const saved = await addOrUpdateFacility(backendPayload as Record<string, unknown>);
              if (typeof console !== 'undefined' && typeof console.debug === 'function') {
                console.debug('addOrUpdateFacility response', saved);
              }

              const source = (saved && typeof saved === 'object') ? (saved as Record<string, unknown>) : (backendPayload as Record<string, unknown>);
              const id = source.facilityMasterId ?? source.facility_master_id ?? (backendPayload as Record<string, unknown>)['facilityMasterId'] ?? undefined;

              
              const rawRoomDetails = Array.isArray(source.roomDetails)
                ? JSON.parse(JSON.stringify(source.roomDetails))
                : (Array.isArray((backendPayload as Record<string, unknown>).roomDetails) ? JSON.parse(JSON.stringify((backendPayload as Record<string, unknown>).roomDetails)) : []);

              
              const normalizedRooms = (rawRoomDetails as Record<string, unknown>[]).map((rd) => {
                const sList = Array.isArray(rd['specialityList']) ? (rd['specialityList'] as unknown[]).map(String) : (Array.isArray(rd['specialityIds']) ? (rd['specialityIds'] as unknown[]).map(String) : []);

                const sNames = sList.map((id) => {
                  const found = specialityMaster.find((sp) => {
                    const candidate = String(sp['specialityMasterId'] ?? sp['speciality_master_id'] ?? sp['id'] ?? sp['code'] ?? sp['stateCode'] ?? '');
                    return candidate === String(id);
                  });
                  if (found) return String(found['specialityName'] ?? found['speciality_name'] ?? found['name'] ?? id);

                  return String(id);
                });

                const roomHasNonGp = sNames.some((nm) => String(nm) !== 'General Practice');
                const outSList = roomHasNonGp ? sList.filter((id, idx) => String(sNames[idx]) !== 'General Practice') : sList;
                const outSNames = roomHasNonGp ? sNames.filter((nm) => String(nm) !== 'General Practice') : sNames;

                return {
                  roomNumber: rd['roomNumber'] ?? rd['room_number'],
                  roomLabel: rd['roomLabel'] ?? rd['room_label'] ?? (rd['roomNumber'] ? `Room ${rd['roomNumber']}` : undefined),
                  specialityList: outSList,
                  specialityNames: outSNames,
                } as unknown;
              });

              const stateDisplay = source.stateName ?? source.state ?? source.state_name ?? source.facilityCity ?? (backendPayload as Record<string, unknown>)?.facilityCity ?? (backendPayload as Record<string, unknown>)?.stateName ?? (backendPayload as Record<string, unknown>)?.state ?? (backendPayload as Record<string, unknown>)?.state_name ?? '';

              const normalizedLocal: AddFacilityType = {
                facilityMasterId: id ? String(id) : undefined,
                name: String(source.facilityName ?? source.facility_name ?? (backendPayload as Record<string, unknown>).facilityName ?? ''),
                address: [source.facilityStreet ?? source.facility_street ?? (backendPayload as Record<string, unknown>).facilityStreet ?? '', source.facilityCity ?? source.facility_city ?? (backendPayload as Record<string, unknown>).facilityCity ?? '']
                  .filter(Boolean)
                  .join(', '),
                state: String(stateDisplay),
                totalRooms: Number(source.noOfRooms ?? source.noOf_rooms ?? (backendPayload as Record<string, unknown>).noOfRooms ?? 1),
                specialties: Array.isArray(source.specialityList) ? (source.specialityList as string[]).map(String) : (Array.isArray((backendPayload as Record<string, unknown>).specialityList) ? ((backendPayload as Record<string, unknown>).specialityList as string[]).map(String) : []),
                roomDetails: normalizedRooms as unknown[],
                
                stateCode: source.stateCode ?? source.state_code ?? (backendPayload as Record<string, unknown>).stateCode ?? (backendPayload as Record<string, unknown>).state_code ?? undefined,
                stateName: source.stateName ?? source.state_name ?? (backendPayload as Record<string, unknown>).stateName ?? (backendPayload as Record<string, unknown>).state_name ?? undefined,
              } as AddFacilityType;

              setFacilities((prev) => {
                const exists = prev.some((f) => f.facilityMasterId && normalizedLocal.facilityMasterId && f.facilityMasterId === normalizedLocal.facilityMasterId);
                let next = prev.slice();
                if (exists) {
                  next = prev.map((f) => (f.facilityMasterId === normalizedLocal.facilityMasterId ? normalizedLocal : f));
                } else {
                  next.push(normalizedLocal);
                }
                return sortFacilities(next);
              });

              try {
                await refreshFacilities();
              } catch (refreshErr) {
                console.warn('refreshFacilities failed after save', refreshErr);
              }

          
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
