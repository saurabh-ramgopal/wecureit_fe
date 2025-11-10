'use client';
import toast from "react-hot-toast";
import LoginCard from "../../../../components/LoginCard/LoginCard";
import { login } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function PatientLoginPage() {
  const [loading, setLoading] = useState(false);
  // kept for potential debugging; not displayed in UI
  const router = useRouter();
  type FormData = {
    email: string;
    password: string;
  };

  const handleLogin = async (formData: FormData) => {
    if (loading) return;
    setLoading(true);
    
    try {
      const { email, password } = formData;
      console.log("Form Data submitted:", { email, password });
      // You may need to define userType or extract it similarly
      const userType = 'patient'; // Adjust as needed
      // Login via backend API (returns loginData and token)
      const { loginData, token, userName } = await login(email, password, userType);
      console.log('Login response from backend:', loginData, 'token:', token, 'userName:', userName);

      if (loginData?.result === 'PASS') {
  // optional: store or log backend response
        toast.success('Login successful! Redirecting...', { id: 'login-success', duration: 1500 });
        // Redirect to appropriate dashboard
        setTimeout(() => {
          router.push(`/${userType}/dashboard`);
        }, 1000);
      } else {
        // Backend returned failure (user not found / wrong password etc.)
  const reason = loginData?.reason || 'Login failed';
  toast.error(String(reason), { id: 'login-fail', duration: 3000 });
  // optional: store or log backend failure reason
      }
    } catch (error: unknown) {
      console.error("Error during login:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      // Handle specific Firebase auth errors
      if (errorMessage.includes('wrong-password') || errorMessage.includes('user-not-found')) {
        toast.error("Invalid email or password", { id: 'login-fail', duration: 3000 });
      } else if (errorMessage.includes('too-many-requests')) {
        toast.error("Too many failed attempts. Please try again later.", { id: 'login-error', duration: 3000 });
      } else if (errorMessage.includes('network')) {
        toast.error("Network error! Please check your connection.", { id: 'login-error', duration: 3000 });
      } else {
        toast.error(errorMessage || "Login failed! Please try again.", { id: 'login-error', duration: 3000 });
      }
  // optional: log error response for debugging
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <div className="theme-patient">
    <LoginCard
      title="Patient Login"
      description="Sign in with your patient account"
      logo={<User size={45} />}
      onSubmit={handleLogin}
      loading={loading}
    />
    </div>
  );
}
