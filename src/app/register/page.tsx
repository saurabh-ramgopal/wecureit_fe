 'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/dist/client/components/navigation';
import { User, Mail, Lock, Phone, Calendar, ShieldCheck } from 'lucide-react';
import RegisterCard from '@/components/auth/RegisterCard';

type Props = {}
const RegisterPage = (props: Props) => {
  const [formData, setFormData] = useState({ email: '', password: '', phone: '', dob: '', fullName: '', gender: '', confirmPassword: '' });
  const [apiResponse, setApiResponse] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const rawApi = process.env.NEXT_PUBLIC_API_URL;
      const API_BASE = rawApi && rawApi !== 'undefined' ? rawApi : 'http://localhost:8080';
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        dob: formData.dob,
      };
      const res = await fetch(`${API_BASE}/patient/registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      let data: any;
      try {
        // try to parse JSON body
        data = await res.json();
      } catch (jsonErr) {
        // not JSON (could be plain text or empty). Read text fallback.
        const text = await res.text().catch(() => '');
        data = { result: res.ok ? 'PASS' : 'FAIL', reason: text || `HTTP_${res.status}` };
      }
      console.log('API Response:', { status: res.status, ok: res.ok, body: data });
      setApiResponse(JSON.stringify({ status: res.status, body: data }, null, 2));
      if (res.ok && data && (data.result === 'PASS' || res.status === 201)) {
        toast.success('Registration successful! Redirecting to login...');
        // clear form
        setFormData({ email: '', password: '', phone: '', dob: '', fullName: '', gender: '', confirmPassword: '' });
        // go to login after a short delay so toast is visible
        setTimeout(() => router.push('/login'), 900);
      } else {
        const reason = (data && (data.reason || data.message)) || `HTTP ${res.status}`;
        toast.error(`Registration failed: ${reason}`);
      }
      setApiResponse(JSON.stringify({ status: res.status, body: data }, null, 2));
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