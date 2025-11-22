'use client';
import LoginCard from '@/components/LoginCard/LoginCard';
import { login } from '@/lib/api';
import { Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const DoctorLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const handleLogin = async () => {
    if (loading) return;
    console.log("Login submitted:", { email, password });
    setLoading(true);
    
    // try {
    //   const { email, password } = formData;
    //   console.log("Form Data submitted:", { email, password });
    //   const userType = 'doctor';

    //   // Login via backend API
    //   const { loginData, userName } = await login(email, password, userType);
    //   console.log('Login response from backend:', loginData, 'userName:', userName);

    //   if (loginData?.result === 'PASS') {
    //     toast.success('Login successful! Redirecting...', { id: 'login-success', duration: 1500 });
    //     setTimeout(() => {
    //       router.push(`/${userType}/dashboard`);
    //     }, 1000);
    //   } else {
    //     const reason = loginData?.reason ?? 'Login failed';
    //     toast.error(String(reason), { id: 'login-fail', duration: 3000 });
    //   }
    // } catch (error: unknown) {
    //   console.error("Error during login:", error);
    //   const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    //   // Show generic or network-related errors
    //   if (errorMessage.includes('network')) {
    //     toast.error('Network error! Please check your connection.', { id: 'login-error', duration: 3000 });
    //   } else {
    //     toast.error(errorMessage || 'Login failed! Please check your credentials.', { id: 'login-fail', duration: 3000 });
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };
    
  return (
    <div className="theme-doctor">
    <LoginCard
      title="Doctor Login"
      description="Sign in with your doctor account"
      logo={<Stethoscope size={45} />}
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      loading={loading}
    />
    </div>
  )
}

export default DoctorLoginPage;