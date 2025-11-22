'use client'
import RegisterCard from '@/components/RegisterCard/RegisterCard'
import { UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import { registerPatient } from '@/lib/api';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import {auth} from "@/lib/firebase"
import {toast} from "react-hot-toast"
type RegisterFormData = {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dob: string;
  gender: string;
  name: string;
}

const PatientRegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData | null>(null);
  const router = useRouter();
  const handleRegister = async (data: RegisterFormData) => {
    setFormData(data);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUid = userCredential.user.uid;

      console.log("Firebase UID:", firebaseUid);
      await registerPatient({   email: data.email,
                                fullName: data.name,
                                phone: data.phone,
                                dob: data.dob,
                                gender: data.gender,
                                firebaseUid: firebaseUid });
      console.log("Registration successful:");
      toast.success("Registration successful!");
      await signOut(auth);
      router.push("/patient/login"); // redirect to login page
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="theme-patient">
      <RegisterCard
        title="Patient Registration"
        description="Create your patient account"
        logo={<UserPlus size={45} />}
        onSubmit={handleRegister}
        loading={loading}
      />
    </div>
  )
}
export default PatientRegisterPage;