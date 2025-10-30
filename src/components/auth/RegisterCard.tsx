'use client';
import React, { useState } from 'react';
import { User, Mail, Lock, Phone, Calendar, ShieldCheck } from 'lucide-react';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import { on } from 'events';

type RegisterCardProps = {
  formData: { email: string; password: string; phone: string; dob: string, fullName: string, gender: string, confirmPassword: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const RegisterCard :React.FC<RegisterCardProps> = ({ formData, onChange, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const password = e.target.value;
  setPasswordStrength(calculatePasswordStrength(password));

  onChange({
    target: { name: "password", value: password },
  } as React.ChangeEvent<HTMLInputElement>);
};

const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const gender = e.target.value;
    onChange({ target: { name: "gender", value: gender } } as React.ChangeEvent<HTMLInputElement>);
};
const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const digitsOnly = e.target.value.replace(/\D+/g, '').slice(0, 10);

  onChange({
    target: { name: "phone", value: digitsOnly },
  } as React.ChangeEvent<HTMLInputElement>);
};

  const isValidEmail = (email: string) => {
    // Simple RFC-like email regex (sufficient for client-side validation)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    // Accepts digits only, require exactly 10 digits
    return /^\d{10}$/.test(phone);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    alert('Registration successful! 🎉\n\nWelcome to MediCare!');
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[url('/background.svg')] bg-cover bg-center bg-no-repeat">
      {/* Background Medical Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-20 left-10 text-6xl text-dark">+</div>
        <div className="absolute top-40 right-20 text-5xl text-dark">+</div>
        <div className="absolute bottom-32 left-20 text-7xl text-dark">+</div>
        <div className="absolute bottom-20 right-32 text-5xl text-dark">+</div>
        <div className="absolute top-1/3 right-1/4 text-6xl text-dark">+</div>
        <div className="absolute top-2/3 left-1/3 text-5xl text-dark">+</div>
        
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Card */}
          <div className="bg-[rgb(var(--color-secondary)/0.6)]   shadow-2xl overflow-hidden">

            {/* Form Content */}
            <div className="p-10">
              {/* Header */}
              <div className="text-center mb-8">
              
            <div className="inline-block p-3 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl mb-4">
                <div className="text-4xl">⚕️</div>
                </div>
                <h1 className="text-3xl font-bold text-accent mb-2">
                  Join WeCureIT Today!
                </h1>
                <p className="text-accent">
                  Create your account to start managing your health
                </p>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center items-center gap-3 mb-8">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                        currentStep >= step ? 'bg-[rgb(var(--color-primary))] text-white' : 'bg-gray-300 texgt-gray-700'
                      } ${currentStep === step ? 'scale-125 ring-4 ring-gray-200' : ''}`}
                      
                    > {step} </div>
                    {step < 2 && (
                      <div
                        className={`w-12 h-1 mx-1 transition-all ${
                          currentStep > step ? 'bg-[rgb(var(--color-primary))]' : 'bg-gray-300'
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fade">
                     <InputBox
                        label="Full Name"
                        type="text"
                name="fullName"
                value={formData.fullName}
                onChange={onChange}
                        placeholder="Enter your full name"
                         icon={<User />}
                      />
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
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="+1 (555) 123-4567"
                    icon={<Phone />}
                  />
                  {!isValidPhone(formData.phone) && formData.phone.length > 0 && (
                    <p className="text-sm text-red-500">Please enter a valid phone number (at least 10 digits).</p>
                  )}

                <Button
                  variant="login"
                  fullWidth
                  onClick={nextStep}
                  disabled={!isValidEmail(formData.email) || !isValidPhone(formData.phone)}
                >
                  Continue
                </Button>
                </div>
              )}

              {/* Step 2: Personal Details */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fade">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={onChange}
                         max={new Date().toISOString().split('T')[0]}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      onChange={handleSelectChange}
                      value={formData.gender}
                      className="w-full px-4 py-3 border bg-white border-dark focus:outline-none  focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                     <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Others</option>
                    </select>

                  </div>

                  <div>
                   <InputBox
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handlePasswordChange}
                      placeholder="Create a strong password"
                      icon={<Lock />}
                    />

                    {formData.password && (
                      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                    <InputBox
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={onChange}
                      placeholder="Re-enter your password"
                      icon={<Lock />}
                    />
                  <div className="flex gap-3">
                    <Button variant="back" flexGrow={1}  onClick={prevStep}>
                     Back
                    </Button>
                    <Button variant="login" flexGrow={1} onClick={onSubmit} disabled={formData.password.length < 8 || formData.password !== formData.confirmPassword}>
                    Register
                    </Button>
                  </div>
                </div>
              )}

              {/* Footer Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a href="/login" className="text-[rgb(var(--color-primary))] font-semibold hover:underline">
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>

   
        </div>
      </div>

     
    </div>
  );
}

export default RegisterCard;