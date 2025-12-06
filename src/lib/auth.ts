import { getAuth, signOut } from "firebase/auth";
import toast from "react-hot-toast";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function logoutUser(redirectTo: string = "/") {
  const auth = getAuth();

  try {
    await signOut(auth);
    toast.success("Signed out successfully");

    if (typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
  } catch (err) {
    console.error("Logout failed", err);
    toast.error("Sign out failed");
  }
}
export async function registerPatient(data: {
  email: string;
  fullName: string;
  phone: string;
  dob: string;
  gender: string;
  firebaseUid: string,
  address: string;
}) {
  const response = await fetch(`${API_BASE_URL}/patient/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      name: data.fullName,
      phone: data.phone,
      dob: data.dob,
      gender: data.gender,
      firebaseUid: data.firebaseUid,
      address: data.address
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || 'Registration failed');
  }
  console.log(response);
  return response.json();
}

