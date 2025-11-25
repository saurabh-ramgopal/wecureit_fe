'use client';
import { login } from '@/lib/api';
import LoginCard from '@/components/LoginCard/LoginCard';
import { Shield } from 'lucide-react';
import { useRouter } from "next/navigation";
import React, { useState, useRef } from 'react'
import toast from 'react-hot-toast';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AdminLoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toastShownRef = useRef(false);
    const router = useRouter();


  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    console.log("Login submitted:", { email, password });
    try {
       const userCredential = await signInWithEmailAndPassword(auth, email, password);
             const user = userCredential.user;
             const idToken = await user.getIdToken(true); 
             console.log("Firebase ID Token:", idToken);
              toast.success("Login Credentials verified successfully!");
              router.push("/admin/dashboard");
              } catch (error: any) {
                console.error(error);
                toast.error(error.message || "Something went wrong");
              } finally {
                setLoading(false);
              }
      
        };
    
  return (
    <div className="theme-admin">
     <LoginCard
      title="Admin Login"
      description="Sign in with your administrator account"
      logo={<Shield size={45} />}
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
export default AdminLoginPage;