'use client'
import RegisterCard from '@/components/RegisterCard/RegisterCard'
import { UserPlus } from 'lucide-react'
import React, { useState } from 'react'

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
  console.log(formData);

  const handleRegister = async (data: RegisterFormData) => {
    // save the data locally so the page can display it and use it
    setFormData(data);
    setLoading(true);
    try {
      // Example API call
      
      // const response = await fetch("/api/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });

      // if (!response.ok) {
      //   throw new Error("Registration failed");
      // }

      // const result = await response.json();
      console.log("Registration successful:");
      alert("Registration successful!");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong");
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