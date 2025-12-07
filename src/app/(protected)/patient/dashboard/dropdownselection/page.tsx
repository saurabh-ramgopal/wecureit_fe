"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from "next/link";
import DropdownSelection from "@/components/PatientDashboard/DropdownSelection/DropdownSelection";
import SelectionSummary from "@/components/PatientDashboard/DropdownSelection/SelectionSummary";
import { useDropdownSelection } from '@/components/PatientDashboard/DropdownSelection/DropdownSelectionContext';
import styles from "@/components/PatientDashboard/DropdownSelection/DropdownSelection.module.scss";
import {AllDoctorUI, AllDoctorResponseAPI, AllFacilityResponseAPI , AllFacilityUI, AllSpecialitiesRespUI} from "@/types/patient";
import {getDoctors, getFacilities, getSpecialities} from "@/lib/api";
import {mapAllDoctorResponse, mapAllFacilityResponse} from "@/utils/mapper";
export default function SelectDocFacSpecPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const ctx = useDropdownSelection();

  const fetchAllDoctors = async() =>{
    try{
      const response = await getDoctors();
        if (Array.isArray(response)) {
          const mappedDoctors: AllDoctorUI[] = mapAllDoctorResponse(response as AllDoctorResponseAPI[]);
          if (ctx?.setAllDoctors) ctx.setAllDoctors(mappedDoctors);
           console.log("Fetched doctor:", mappedDoctors);
        } else {
          console.error("Unexpected API response:", response);
        }
  
    }
    catch (error) {
        console.error("Failed to fetch doctor:", error);
      } 
  }

  const fetchAllFacilities = async () =>{
    try{
      const response = await getFacilities();
       if (Array.isArray(response)) {
          const mappedFacilities: AllFacilityUI[] = mapAllFacilityResponse(response as AllFacilityResponseAPI[]);
          if (ctx?.setAllFacilities) ctx.setAllFacilities(mappedFacilities);
           console.log("Fetched doctor:", mappedFacilities);
        } else {
          console.error("Unexpected API response:", response);
        }
    }
      catch (error) {
        console.error("Failed to fetch facility:", error);
      } 
  }

  const fetchAllSpecialitites = async() =>{
    try{
      const response = await getSpecialities();
         if (Array.isArray(response)) {
          if (ctx?.setAllSpecialities) ctx.setAllSpecialities(response);
           console.log("Fetched specialities:", response);
        } else {
          console.error("Unexpected API response:", response);
        }
    }
    catch (error) {
        console.error("Failed to fetch speciality:", error);
      } 
  }

  const handleDropdownClearSelection = async() =>{
    try{
       await fetchAllDoctors(); 
        await fetchAllFacilities();
        await fetchAllSpecialitites();
    }
    catch(err){
       console.error("Failed to clear the options", err);
    }
  }
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult(true);
        const role = tokenResult.claims.role;
          if (role === 'patient') {
          setAuthorized(true);
          await fetchAllDoctors(); 
          await fetchAllFacilities();
          await fetchAllSpecialitites();
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Error checking auth role', err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);


  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!authorized) return null;

  return (
    <div className={`${styles.pageWrapper} theme-patient`} >
      <div className={styles.pageInner}>
        <div className="mb-6">
          <Link href="/patient/dashboard" className={styles.backLink}>← Back to Home</Link>
        </div>

        <h1 className={styles.pageTitle}>Book an Appointment</h1>
        <p className={styles.pageSubtitle}>Select your doctor, facility, and specialty to continue</p>

        <div className={styles.gridWrapper}>
          <div className={styles.leftCard}>
            <div className={styles.cardHeading}>
              <h3>Appointment Details</h3>
              <p>Choose your preferences below</p>
              <p className="text-sm text-gray-400 mb-6">Selecting any option (doctor, facility, or specialty) will automatically filter the other dropdowns to show only compatible choices.</p>
            
            </div>
              <DropdownSelection handleClearSelection={handleDropdownClearSelection}/>
            </div>
    

            <div className="md:col-span-1">
              <SelectionSummary />
            </div>
          
        </div>
      </div>
    </div>
  );
}
