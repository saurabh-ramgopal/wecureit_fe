"use client";
import React, { useState } from 'react';
import LoginCard from '@/components/auth/LoginCard';
import { useRouter } from 'next/dist/client/components/navigation';
import toast from 'react-hot-toast';

const PatientLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [apiResponse, setApiResponse] = useState('');
  const [userType, setUserType] = useState('patient');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData, type: userType };
      const rawApi = process.env.NEXT_PUBLIC_API_URL;
      const API_BASE = rawApi && rawApi !== 'undefined' ? rawApi : 'http://localhost:8080';
      const res = await fetch(`${API_BASE}/common/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = res.ok ? await res.json() : await res.json().catch(() => ({ result: 'FAIL', reason: 'INVALID_RESPONSE' }));
      if (!res.ok) {
        toast.error(`Login request failed (${res.status})`);
      }
      console.log("API Response:", data);
      setApiResponse(JSON.stringify(data, null, 2));
      if (data.result === "PASS" && data.reason === "LOGIN_SUCCESSFUL") {
        const token = data.token || data.accessToken || data.jwt;
        if (token && typeof window !== 'undefined') sessionStorage.setItem('accessToken', token);
        toast.success("Login successful! Redirecting...",  { id: 'login-success' , duration: 1500 });
        setTimeout(() => router.push(`/dashboard/patient`), 1000);
      } else {
        toast.error("Login failed! Please check your credentials.", { id: 'login-fail' , duration: 1000 });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Network error! Please try again later.", { id: 'login-error' , duration: 1000 });
      setApiResponse("Network error");
    }
  };

  return (
    <>
      <LoginCard userType={userType} setUserType={setUserType} formData={formData} onChange={handleInputChange} onSubmit={handleSubmit} />
      {apiResponse && (
        <pre className="mt-4 p-3 bg-gray-100 w-full rounded text-sm">{apiResponse}</pre>
      )}
    </>
  );
};

export default PatientLoginPage;
