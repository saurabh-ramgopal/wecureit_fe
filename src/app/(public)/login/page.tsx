"use client";
import React, { useState } from 'react'
import LoginCard from '@/components/auth/LoginCard';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { login } from '@/lib/api';

type Props = {}
const LoginPage = (props: Props) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [apiResponse, setApiResponse] = useState('');
  const [userType, setUserType] = useState('patient');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Login with Firebase
      const { user, token } = await login(formData.email, formData.password, userType);
      
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
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoginCard  
        userType={userType} 
        setUserType={setUserType} 
        formData={formData} 
        onChange={handleInputChange} 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      {apiResponse && (
        <pre className="mt-4 p-3 bg-gray-100 w-full rounded text-sm">{apiResponse}</pre>
      )}
    </>
  )
}
export default LoginPage;