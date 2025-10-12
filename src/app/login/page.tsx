"use client";
import React, { useState } from 'react'
import Navbar from '@/components/NavBar';
import LoginCard from '@/components/auth/LoginCard';

type Props = {}
const LoginPage = (props: Props) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [apiResponse, setApiResponse] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log('API Response:', data);
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (e) {
      setApiResponse('Network error');
    }
  };
    return (
        <>
        <LoginCard  formData={formData} onChange={handleInputChange} onSubmit={handleSubmit}/>
        {apiResponse && (
  <pre className="mt-4 p-3 bg-gray-100 w-full rounded text-sm">{apiResponse}</pre>
        )}

   </>
    )
}
export default LoginPage;