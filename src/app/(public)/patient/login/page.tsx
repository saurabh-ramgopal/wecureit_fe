'use client';
import toast from "react-hot-toast";
import LoginCard from "../../../../components/LoginCard/LoginCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function PatientLoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const handleLogin = async () => {
    console.log("Login submitted:", { email, password });
    if (loading) return;
    setLoading(true);
    
    try {
       const userCredential = await signInWithEmailAndPassword(auth, email, password);
       const user = userCredential.user;
       const idToken = await user.getIdToken(true); 
       console.log("Firebase ID Token:", idToken);
        const decodedToken = await user.getIdTokenResult(true);
        const patientMasterId = decodedToken.claims.patientMasterId;
        console.log(patientMasterId);
        toast.success("Login Credentials verified successfully!");
        router.push("/patient/dashboard");
        } catch (error: any) {
          console.error(error);
          toast.error(error.message || "Something went wrong");
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
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      loading={loading}
      onBack={() => router.push("/")} // Add this
    />
    </div>
  );
}
