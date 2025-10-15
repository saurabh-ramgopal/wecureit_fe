"use client";
import React, { useState } from 'react'
import LoginCard from '@/components/auth/LoginCard';
import { useRouter } from 'next/dist/client/components/navigation';
import toast from 'react-hot-toast';

type Props = {}
const LoginPage = (props: Props) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [apiResponse, setApiResponse] = useState('');
  const [userType, setUserType] = useState('patient');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
 const handleButtonClick = () => {
    toast.success('You did it!'); // Displays a success message
  };
  const handleSubmit = async () => {
    try {
      const payload = { ...formData, type: userType };
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
          router.push(`/dashboard/${userType}`);
        }, 1000);
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
        <LoginCard  userType={userType} setUserType={setUserType} formData={formData} onChange={handleInputChange} onSubmit={handleSubmit}/>
        {apiResponse && (
  <pre className="mt-4 p-3 bg-gray-100 w-full rounded text-sm">{apiResponse}</pre>
        )}
   </>
    )
}
export default LoginPage;