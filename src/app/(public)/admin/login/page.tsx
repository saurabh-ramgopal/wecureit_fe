"use client";
import React, { useState } from 'react'
import LoginCard from '@/components/auth/LoginCard';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // No client-side auth check: /api/auth/me removed because it returned 404 in your env.
  // If you later add an auth endpoint, we can reinstate a role-based redirect here.

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
  // Include explicit type for backend compatibility
  const payload = { ...formData, type: 'admin' };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // Safely parse JSON
      type AdminLoginResp = { result?: string; reason?: string };
      let data: AdminLoginResp | null = null;
      try {
        data = await res.json();
      } catch {}

      if (data && data.result === "PASS" && data.reason === "LOGIN_SUCCESSFUL") {
        toast.success("Login successful! Redirecting...",  { id: 'login-success' , duration: 1500 });
        setTimeout(() => {
          // navigate to admin dashboard
          router.replace(`/admin/dashboard`);
        }, 1000);
      } else {
        const message = data?.reason?.trim() || 'Login failed! Please check your credentials.';
        toast.error(message, { id: 'login-fail' , duration: 2000 });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Network error! Please try again later.", { id: 'login-error' , duration: 1000 });
    } finally {
      setLoading(false);
    }
  };
    return (
      <LoginCard
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        userType="admin"
        setUserType={() => {}}
        isLoading={loading}
        fixedUserType="admin"
      />
    )
}
export default AdminLoginPage;