'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { registerPatient } from '@/lib/api';
import RegisterCard from '@/components/auth/RegisterCard';

const PatientRegisterPage = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    phone: '', 
    dob: '', 
    fullName: '', 
    gender: '', 
    confirmPassword: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', { id: 'password-mismatch', duration: 3000 });
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters', { id: 'password-length', duration: 3000 });
      return;
    }

    setIsLoading(true);
    try {
      await registerPatient({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
      });
      
      toast.success('Registration successful! Redirecting to login...', { 
        id: 'register-success', 
        duration: 2000 
      });

      setTimeout(() => {
        router.push('/patient/login');
      }, 2000);

    } catch (error: unknown) {
      console.error('Error during registration:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      
      if (errorMessage.includes('email-already-in-use')) {
        toast.error('This email is already registered', { id: 'register-error', duration: 3000 });
      } else if (errorMessage.includes('weak-password')) {
        toast.error('Password is too weak. Please use a stronger password.', { id: 'register-error', duration: 3000 });
      } else if (errorMessage.includes('invalid-email')) {
        toast.error('Invalid email address', { id: 'register-error', duration: 3000 });
      } else if (errorMessage.includes('already exists')) {
        toast.error('Patient with this email already exists', { id: 'register-error', duration: 3000 });
      } else {
        toast.error(errorMessage, { id: 'register-error', duration: 3000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterCard
      formData={formData}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      loginLink="/patient/login"
    />
  );
}

export default PatientRegisterPage;
