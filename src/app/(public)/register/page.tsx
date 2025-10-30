'use client';
import React, { useState } from 'react';
import bcrypt from "bcryptjs";
import { User, Mail, Lock, Phone, Calendar, ShieldCheck } from 'lucide-react';
import RegisterCard from '@/components/auth/RegisterCard';

type Props = {}
const RegisterPage = (props: Props) => {
  const [formData, setFormData] = useState({ email: '', password: '', phone: '', dob: '', fullName: '', gender: '', confirmPassword: '' });
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
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      console.log('Hashed password:', hashedPassword);
      const decodepass= await bcrypt.compare(formData.password, hashedPassword);
      console.log('Password match:', decodepass);
      const data = await res.json();
       console.log("Stored hash:", hashedPassword);
      console.log('API Response:', data);
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (e) {
      setApiResponse('Network error');
    }
  };

  return (
    <div>
    <RegisterCard formData={formData} onChange={handleInputChange} onSubmit={handleSubmit} />
    {apiResponse && (
      <pre className="mt-4 p-3 bg-gray-100 w-full rounded text-sm">{apiResponse}</pre>
    )}
    </div>
  );
}
export default RegisterPage;