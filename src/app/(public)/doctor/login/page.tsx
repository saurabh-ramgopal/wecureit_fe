'use client';
import LoginCard from '@/components/LoginCard/LoginCard';
import { login } from '@/lib/api';
import { Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

type Props = {}

const DoctorLoginPage = (props: Props) => {
   const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const router = useRouter();
  type FormData = {
    email: string;
    password: string;
  };

  const handleLogin = async (formData: FormData) => {
    if (loading) return;
    setLoading(true);
    
    try {
      const { email, password } = formData;
      console.log("Form Data submitted:", { email, password });
      // You may need to define userType or extract it similarly
      const userType = 'patient'; // Adjust as needed
      // Login with Firebase
      const { user, token } = await login(email, password, userType);
      console.log("Firebase login successful:", { uid: user.uid, email: user.email });
      setApiResponse(JSON.stringify({ 
        result: "PASS", 
        message: "Login successful", 
        uid: user.uid,
        email: user.email 
      }, null, 2));
      toast.success("Login successful! Redirecting...", { id: 'login-success', duration: 1500 });
      // Redirect to appropriate dashboard
      setTimeout(() => {
        router.push(`/${userType}/dashboard`);
      }, 1000);
      console.log("API Response:", apiResponse);
    } catch (error: unknown) {
      console.error("Error during login:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      // Handle specific Firebase auth errors
      if (errorMessage.includes('wrong-password') || errorMessage.includes('user-not-found')) {
        toast.error("Invalid email or password", { id: 'login-fail', duration: 3000 });
      } else if (errorMessage.includes('too-many-requests')) {
        toast.error("Too many failed attempts. Please try again later.", { id: 'login-error', duration: 3000 });
      } else if (errorMessage.includes('network')) {
        toast.error("Network error! Please check your connection.", { id: 'login-error', duration: 3000 });
      } else {
        toast.error(errorMessage || "Login failed! Please try again.", { id: 'login-error', duration: 3000 });
      }
      setApiResponse(JSON.stringify({ error: errorMessage }, null, 2));
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <div className="theme-doctor">
    <LoginCard
      title="Doctor Login"
      description="Sign in with your doctor account"
      logo={<Stethoscope size={45} />}
      onSubmit={handleLogin}
      loading={loading}
    />
    </div>
  )
}

export default DoctorLoginPage;