"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { login } from '@/lib/api';
import LoginCard from '@/components/auth/LoginCard';

const DoctorLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await login(formData.email, formData.password, 'doctor');
      toast.success('Login successful!', { id: 'login-success', duration: 2000 });
      setTimeout(() => router.push('/doctor/dashboard'), 1000);
    } catch (error: unknown) {
      console.error('Error during login:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      if (errorMessage.includes('wrong-password') || errorMessage.includes('user-not-found')) {
        toast.error('Invalid email or password', { id: 'login-fail', duration: 3000 });
      } else if (errorMessage.includes('too-many-requests')) {
        toast.error('Too many failed attempts. Please try again later.', { id: 'login-fail', duration: 3000 });
      } else {
        toast.error(errorMessage || 'Login failed. Please try again.', { id: 'login-fail', duration: 3000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginCard
      formData={formData}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      userType="doctor"
      setUserType={() => {}}
      isLoading={isLoading}
      fixedUserType="doctor"
    />
  );
};

export default DoctorLoginPage;
