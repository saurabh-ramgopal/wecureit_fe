import { getAuth } from "firebase/auth";
import { UnauthorizedError } from "./apiErrors";
import router from "next/router";
import { DoctorAPIResponse, DoctorAvailability, FacilityAPIResponse, DoctorScheduleAPIResponse, SaveNotesRequest, SaveAvailabilityResponse } from "@/types/doctor"; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getFirebaseToken(): Promise<string | null> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(); 
}


export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getFirebaseToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthorizedError(); 
    }
    // Try to capture JSON error body, otherwise read text so we get stack traces
    let bodyText = '';
    try {
      const json = await response.json().catch(() => null);
      if (json && typeof json === 'object') {
        const j = json as Record<string, unknown>;
        const msgCandidate = j['message'] ?? j['error'] ?? j['reason'];
        if (msgCandidate) throw new Error(String(msgCandidate));
        // fallback to stringified JSON
        bodyText = JSON.stringify(json);
      } else {
        bodyText = await response.text().catch(() => '');
      }
    } catch (err) {
      // If parsing threw (or we intentionally threw with message), capture text if possible
      bodyText = (bodyText && String(bodyText)) || (await response.text().catch(() => ''));
      // If we previously threw with a meaningful message, rethrow it
      if (err instanceof Error && err.message) throw err;
    }

    const snippet = bodyText ? ` Response body: ${String(bodyText).slice(0, 2000)}` : '';
    throw new Error(`API error: ${response.status} ${response.statusText}.${snippet}`);
  }

  return response.json() as Promise<T>;
}

export async function handleApiCall<T>(apiFunc: () => Promise<T>): Promise<T | null> {
  try {
    return await apiFunc();
  } catch (err: any) {
    if (err instanceof UnauthorizedError) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        router.push("/"); 
        return null;
      }
      const tokenResult = await user.getIdTokenResult();
      const role = tokenResult.claims.role || "patient"; 

      if (role === "admin") router.push("/admin/login");
      else if (role === "doctor") router.push("/doctor/login");
      else router.push("/patient/login");
      return null;
    }
    throw err;
  }
}

// Public API calls (no auth required)
export async function getDoctors() {
  // Use protected apiCall so Authorization header is attached when token exists
  return apiCall('/admin/getAllDoctors', { method: 'GET' });
}

// Protected API calls
export async function getPatientById(patientId: number) {
  return apiCall(`/patient/getById?patientId=${patientId}`, {
    method: 'GET',
  });
}

export async function updatePatient(patientData: Record<string, unknown>) {
  return apiCall('/patient/addOrUpdate', {
    method: 'POST',
    body: JSON.stringify(patientData),
  });
}

// Master data
// Assumption: backend exposes endpoints that return arrays of objects (various field names).
export async function getStates() {
  return apiCall('/common/states/getAll', { method: 'GET' });
}

export async function getSpecialities() {
  try {
    return await apiCall('/common/getSpeciality', { method: 'GET' });
  } catch (err) {
    console.error('getSpecialities failed', err);
    throw err;
  }
}

// Admin: add or update doctor
export async function addDoctor(doctorData: Record<string, unknown>) {
  // backend exposes POST /admin/addDoctor
  return apiCall('/admin/addDoctor', {
    method: 'POST',
    body: JSON.stringify(doctorData),
  });
}

// Delete a doctor. payload can be { doctorId } or { email } depending on backend contract.
export async function deleteDoctor(payload: Record<string, unknown>) {
  return apiCall('/admin/deleteDoctor', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Update doctor speciality (if backend exposes this separate route)
export async function updateDoctorSpeciality(payload: Record<string, unknown>) {
  return apiCall('/admin/updateDoctorSpeciality', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Facilities
export async function getFacilities() {
  try {
    return await apiCall('/common/facility/getAll', { method: 'GET' });
  } catch (err) {
    // Log the error and return an empty array so the frontend can continue gracefully
    console.error('getFacilities failed, returning empty array', err);
    return [] as unknown as Promise<unknown>;
  }
}

export async function addOrUpdateFacility(facilityData: Record<string, unknown>) {
  return apiCall('/common/facility/addOrUpdate', {
    method: 'POST',
    body: JSON.stringify(facilityData),
  });
}

export async function deleteFacility(payload: Record<string, unknown>) {
  return apiCall('/common/facility/delete', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}


// Doctor Dashboard APIs

export async function getDoctorById(doctorId: number) : Promise<DoctorAPIResponse> {
  return apiCall(`/doctor/getById?doctorId=${doctorId}`, {
    method: 'GET',
  });
}

export async function getDoctorFacilities(doctorId: number): Promise<FacilityAPIResponse[]> {
  return apiCall<FacilityAPIResponse[]>(`/doctor/facilities/getById?doctorId=${doctorId}`, {
    method: "GET",
  });
}

export async function setDoctorAvailability(availabilityData: DoctorAvailability) {
  return apiCall('/doctor/availability/add', {
    method: 'POST',
    body: JSON.stringify(availabilityData),
  });
}

export async function getDoctorSchedule(doctorId: number): Promise<DoctorScheduleAPIResponse> {
  return apiCall(`/doctor/appointments/getNextTwoWeeks?doctorId=${doctorId}`, {
    method: 'GET',
  });
}

export async function getDoctorPastAppointments(doctorId: number): Promise<DoctorScheduleAPIResponse>  {
  return apiCall(`/doctor/appointments/getAllPast?doctorId=${doctorId}`, { 
    method: 'GET',
  });
}


export async function getSavedDoctorAvailability(doctorId: number) : Promise<SaveAvailabilityResponse> {
  return apiCall(`/doctor/availability/getSummary?doctorId=${doctorId}`, { 
    method: 'GET',
  });
}

export async function saveNotes(saveNotesData: SaveNotesRequest): Promise<boolean> {
  return apiCall(`/doctor/appointments/addNote`, {
    method: 'POST',
    body: JSON.stringify(saveNotesData),
  });
}