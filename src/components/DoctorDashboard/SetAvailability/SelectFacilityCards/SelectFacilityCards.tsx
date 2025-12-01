import React, {useState, useEffect} from 'react'
import { FacilityAPIResponse, FacilityAvailabilityUI } from "@/types/doctor";
import { getDoctorFacilities } from '@/lib/api';
import { Doctor } from "@/types/doctor";
import styles from './SelectFacilityCards.module.scss';


type SelectFacilityCardsProps = {
  doctor: Doctor;
  onSelectFacility: (facility: FacilityAvailabilityUI) => void;
  selectedFacilityId: string;
};


const SelectFacilityCards = ({  doctor, onSelectFacility, selectedFacilityId}: SelectFacilityCardsProps) => {
  const [facilities, setFacilities] = useState<FacilityAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  useEffect(() => {
    let mounted = true;

    const fetchFacilities = async () => {
      try {
        const data = await getDoctorFacilities(doctor.doctorId);
        if (mounted) setFacilities(data);
      } catch (err: unknown) {
        if (mounted)
          setError((err as Error).message || "Failed to fetch facilities");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFacilities();

    return () => {
      mounted = false;
    };
  }, [doctor.doctorId]);


  if (loading) return <p>Loading facilities...</p>;
  if (error) return <p>{error}</p>;
  if (facilities.length === 0) return <p>No facilities found.</p>;

   return (
    <div className={styles['facility-cards-container']}>
      {facilities.map(facility => (
        <div
            key={facility.facilityMasterId}
             className={`${styles['facility-card']} ${selectedFacilityId === facility.facilityMasterId ? styles['selected'] : ''}`}
            onClick={() =>  {onSelectFacility({
              facilityId: facility.facilityMasterId,
              facilityName: facility.facilityName,
              speciality: facility.speciality || [],
              facilityStreet: facility.facilityStreet || "",
              stateName: facility.stateName || "",
              availableDate: "",
              availableStartTime: "",
              availableEndTime: "",
            });
            setSelectedFacility(facility.facilityMasterId);
            }
          }
          >
          <h2 className={styles['facility-name']}>{facility.facilityName}</h2>
          <p className={styles['facility-location']}>
            {facility.facilityStreet}, {facility.stateName}
          </p>

          <div className={styles['facility-specialities']}>
            {facility.speciality.length ? (
              <div className={styles['specialities-pills']}>
                {facility.speciality.map(spec => (
                  <span key={spec.specialityMasterId} className={styles['speciality-pill']}>
                    {spec.specialityName}
                  </span>
                ))}
              </div>
            ) : (
              <p>No specialties available</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectFacilityCards;