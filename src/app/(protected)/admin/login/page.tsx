"use client";
import React, { useState } from 'react'
import { Mail, Lock } from 'lucide-react';
import InputBox from '@/components/common/InputBox';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [apiResponse, setApiResponse] = useState('');
  // this page is admin-only, we don't need a mutable userType
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // No client-side auth check: /api/auth/me removed because it returned 404 in your env.
  // If you later add an auth endpoint, we can reinstate a role-based redirect here.

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleSubmit = async () => {
    // basic client-side verification
    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!formData.password || formData.password.length === 0) {
      toast.error('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, type: 'admin' };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("API Response:", data);
      setApiResponse(JSON.stringify(data, null, 2));
      if (data.result === "PASS" && data.reason === "LOGIN_SUCCESSFUL") {
        toast.success("Login successful! Redirecting...",  { id: 'login-success' , duration: 1500 });
        setTimeout(() => {
          // navigate to admin dashboard
          router.replace(`/admin/dashboard`);
        }, 1000);
      } else {
        toast.error("Login failed! Please check your credentials.", { id: 'login-fail' , duration: 1000 });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Network error! Please try again later.", { id: 'login-error' , duration: 1000 });
      setApiResponse("Network error");
    } finally {
      setLoading(false);
    }
  };
    return (
      <div className="min-h-screen relative overflow-hidden flex" style={{ background: 'var(--page-bg, transparent)' }}>
        <div className="relative z-10 w-full flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] bg-clip-text text-transparent mb-2">Admin Login</h1>
                  <p className="text-gray-600 text-sm">Sign in with your administrator account</p>
                </div>

                <div className="space-y-5">
                  <InputBox
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    icon={<Mail />}
                  />
                  {!isValidEmail(formData.email) && formData.email.length > 0 && (
                    <p className="text-sm text-red-500">Please enter a valid email address.</p>
                  )}

                  <InputBox
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    icon={<Lock />}
                  />

                  <button
                    onClick={handleSubmit}
                    aria-busy={loading}
                    disabled={loading || formData.email === '' || formData.password === '' || !isValidEmail(formData.email)}
                    className={`w-full bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] text-white py-3 rounded-xl font-semibold hover:from-[rgb(var(--color-primary))] hover:to-[rgb(var(--color-secondary))] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                      loading || formData.email === '' || formData.password === '' || !isValidEmail(formData.email) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Signing in…' : 'Login as Admin'}
                  </button>

                  {apiResponse && (
                    <pre className="mt-4 p-3 bg-gray-100 w-full rounded text-sm">{apiResponse}</pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}
export default LoginPage;