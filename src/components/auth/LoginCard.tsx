import React, { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { Mail, Lock } from 'lucide-react';
import InputBox from '../common/InputBox';


interface LoginCardProps {
  formData: { email: string; password: string };
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  userType: string;
  setUserType: (type: string) => void;
}
  const isValidEmail = (email: string) => {
    // Simple RFC-like email regex (sufficient for client-side validation)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };


const LoginCard :React.FC<LoginCardProps> = ({ userType, setUserType, formData, onChange, onSubmit }) =>{


  return (
  <div className="min-h-screen relative overflow-hidden flex" style={{ background: 'var(--page-bg, transparent)' }}>
      {/* Main Container */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row">
        
  {/* Left Side - Login Form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center p-6 lg:p-12 z-20">
      <div className="w-full max-w-lg">
        {/* Card with Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden" >
              
              {/* User Type Tabs */}
              <div className="flex" >
                <button
                  onClick={() => setUserType('patient')}
                  className={`flex-1 py-4 px-6 font-semibold transition-all  ${
                    userType === 'patient'
                      ? 'bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] text-white'
                        : 'bg-gradient-to-r from-[rgb(var(--color-primary)/0.06)] to-[rgb(var(--color-secondary)/0.06)] text-gray-600 hover:from-[rgb(var(--color-primary)/0.08)] hover:to-[rgb(var(--color-secondary)/0.08)]'
                  }`}
                >
                  Patient Login
                </button>
                <button
                  onClick={() => setUserType('doctor')}
                  className={`flex-1 py-4 px-6 font-semibold transition-all ${
                    userType === 'doctor'
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
                      : 'bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-600 hover:from-teal-100 hover:to-cyan-100'
                  }`}
                >
                  Doctor Login
                </button>
              </div>

              {/* Form Content */}
              <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] bg-clip-text text-transparent mb-2">
                    Welcome!
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {userType === 'patient'
                      ? 'Login to book appointments and manage your health'
                      : 'Login to manage your schedule and appointments'}
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-5">
                  <InputBox
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder="Enter your email"
                    icon={<Mail />}
                  />
                   {/* Email validation error */}
                    {!isValidEmail(formData.email) && formData.email.length > 0 && (
                      <p className="text-sm text-red-500">Please enter a valid email address.</p>
                    )}
                    <InputBox
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={onChange}
                      placeholder="Enter your password"
                      icon={<Lock />}
                    />

       

                  {/* Remember Me & Forgot Password */}
                  {/* <div className="flex items-center justify-between">
                    <a href="#" className="text-sm text-[rgb(var(--color-primary))] font-semibold hover:underline">
                      Forgot Password?
                    </a>
                  </div> */}

                  {/* Login Button */}
                  <button
                    onClick={onSubmit}
                    disabled={formData.email === '' || formData.password === '' || !isValidEmail(formData.email)}
                    className={`w-full bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] text-white py-3 rounded-xl font-semibold hover:from-[rgb(var(--color-primary))] hover:to-[rgb(var(--color-secondary))] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 
                    ${
                        formData.email === '' || formData.password === '' || !isValidEmail(formData.email)
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    Login as {userType === 'patient' ? 'Patient' : 'Doctor'}
                  </button>

                 
                  {userType === 'patient' && (
                    <>
                      {/* Divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white/80 text-gray-500">OR</span>
                        </div>
                      </div>
                      
                      {/* Sign Up Link */}
                      <div className="text-center mt-3">
                        <p className="text-sm text-gray-600">
                          Don&apos;t have an account? 
                          <a 
                            href="/register" 
                            className="text-[rgb(var(--color-primary))] font-semibold hover:underline"
                          >
                            Sign Up
                          </a>
                        </p>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side - Illustration (full-bleed) */}
        <div className="hidden md:block lg:w-3/5 relative">
          <div className="absolute inset-0">
            <Image src="/doctor.png" alt="Doctor illustration" fill className="object-cover" />
          </div>

          {/* Optional translucent overlay to increase contrast */}
          <div className="absolute inset-0 bg-[rgba(255,255,255,0.06)]" />
        </div>
        <></>
      </div>
    </div>
  );
}

export default LoginCard;