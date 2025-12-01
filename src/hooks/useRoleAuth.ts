'use client';
import { useEffect, useState , useRef} from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Role = 'doctor' | 'patient' | 'admin';

interface RoleAuthOptions {
  allowedRoles: Role[]; 
}

interface RoleAuthResult {
  authorized: boolean;
  loading: boolean;
  userId?: string; 
  role?: Role;    
}

export const useRoleAuth = ({ allowedRoles }: RoleAuthOptions): RoleAuthResult => {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>();
  const [role, setRole] = useState<Role>();
  const router = useRouter();
  const hasShownToast = useRef(false);
   useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        const firstRole = allowedRoles[0];
        router.push(`/${firstRole}/login`);
        setLoading(false);
        return;
      }

      try {
        // Get token and decode role
        const tokenResult = await user.getIdTokenResult(); 
        const userRole = tokenResult.claims.role as Role;
        const uid =
          (tokenResult.claims.doctorMasterId as string | undefined) ||
          (tokenResult.claims.patientMasterId as string | undefined) ||
          (tokenResult.claims.adminMasterId as string | undefined) ||
          user.uid;

        setUserId(uid);
        setRole(userRole);

        if (allowedRoles.includes(userRole)) {
          setAuthorized(true);
        } else {
            if (userRole && !hasShownToast.current) {
            toast.error(`You are logged in as ${userRole}. Not authorized.`);
            hasShownToast.current = true;
            }
            router.replace(`/`);
        }
      } catch (err) {
        console.error("Error checking auth:", err);
        setUserId(undefined);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); 
  }, [allowedRoles, router]);

  return { authorized, loading, userId, role };
};