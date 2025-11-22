'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib//firebase"; 
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import toast from "react-hot-toast";

const PatientDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = sessionStorage.getItem("idToken");
        if (!token) {
          router.push("/patient/login"); 
          return;
        }

        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            router.push("/patient/login");
            return;
          }
          const tokenResult = await getIdTokenResult(user, true);
          const role = tokenResult.claims.role;
          const patientMasterId = tokenResult.claims.patientMasterId;
          console.log(patientMasterId);
          if (role === "patient") {
            setAuthorized(true); 
          } else {
            toast.error(`You are logged in as ${role}. Only Patients can access this page.`);
            router.push("/patient/login"); 
          }
        });
      } catch (error) {
        console.error("Authorization error:", error);
        router.push("/patient/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!authorized) return null; 

return (
  <div className="flex items-center justify-center min-h-screen">
    {loading || !authorized ? (
      <p>Loading...</p>
    ) : (
      <h1 className="text-2xl font-bold text-center">
        Welcome to Patient Dashboard
      </h1>
    )}
  </div>
);
}

export default PatientDashboard;
