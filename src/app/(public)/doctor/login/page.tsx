'use client';
import LoginCard from '@/components/LoginCard/LoginCard';
import { Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const DoctorLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const handleLogin = async () => {
    if (loading) return;
    console.log("Login submitted:", { email, password });
    setLoading(true);
    try {
       const userCredential = await signInWithEmailAndPassword(auth, email, password);
             const user = userCredential.user;
             const idToken = await user.getIdToken(true); 
             console.log("Firebase ID Token:", idToken);
              toast.success("Login Credentials verified successfully!");
              router.push("/doctor/dashboard");
              } catch (error: any) {
                console.error(error);
                toast.error(error.message || "Something went wrong");
              } finally {
                setLoading(false);
              }
      
        };    

  return (
    <div className="theme-doctor">
    <LoginCard
      title="Doctor Login"
      description="Sign in with your doctor account"
      logo={<Stethoscope size={45} />}
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      loading={loading}
      onBack={() => router.push("/")}
    />
    </div>
  )
}

export default DoctorLoginPage;