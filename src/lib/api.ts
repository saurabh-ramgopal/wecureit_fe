const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Read auth token issued by backend from localStorage
function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

// Helper to get auth headers from a stored token (backend-issued)
function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// Generic API call wrapper
export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid - redirect to login
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Authentication required');
    }
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || `API error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// Public API calls (no auth required)
export async function getDoctors() {
  // Use protected apiCall so Authorization header is attached when token exists
  return apiCall('/admin/getAllDoctors', { method: 'GET' });
}

// Patient registration (backend handles password hashing / storage)
export async function registerPatient(data: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  dob: string;
  gender: string;
}) {
  const response = await fetch(`${API_BASE_URL}/patient/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      name: data.fullName,
      phone: data.phone,
      dob: data.dob,
      gender: data.gender,
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
}

// Login (backend authenticates and returns a token)
export async function login(email: string, password: string, userType: string) {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/common/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        type: userType,
      }),
    });
  } catch (err) {
    // Network-level failure (server down, CORS, DNS, etc.)
    console.error('Network error while calling /common/login', err);
    throw new Error(`Network error: ${(err as Error).message || err}`);
  }

  if (!response.ok) {
    // Try to parse JSON error body, but fall back to raw text so we get server stack/HTML
    let bodyText = '';
    try {
      // attempt to parse JSON first
      const json = await response.json().catch(() => null);
      if (json && typeof json === 'object') {
        const j = json as Record<string, unknown>;
        const msgCandidate = j['message'] ?? j['reason'] ?? j['error'];
        throw new Error(String(msgCandidate ?? `Login failed (${response.status})`));
      }
      // if not JSON, read as text
      bodyText = await response.text().catch(() => '');
    } catch {
      // if json parsing threw, try to capture text
      bodyText = bodyText || (await response.text().catch(() => ''));
    }

    const snippet = bodyText ? ` Response body: ${bodyText.slice(0, 200)}` : '';
    throw new Error(`Login failed (${response.status})${snippet}`);
  }

  type LoginData = {
    token?: string;
    accessToken?: string;
    jwt?: string;
    name?: string;
    user?: { name?: string };
    [k: string]: unknown;
  };

  const loginData = (await response.json()) as LoginData;
  const token = loginData.token ?? loginData.accessToken ?? loginData.jwt ?? '';

  if (token && typeof window !== 'undefined') {
    localStorage.setItem('authToken', String(token));
    localStorage.setItem('userType', userType);
  }

  const userName = loginData.name ?? loginData.user?.name ?? email.split('@')[0];
  return { loginData, token, userName };
}

// Logout
export async function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
  }
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

// Doctor API calls
export async function getDoctorById(doctorId: number) {
  return apiCall(`/doctor/getById?doctorId=${doctorId}`, {
    method: 'GET',
  });
}

// Master data
// Assumption: backend exposes endpoints that return arrays of objects (various field names).
export async function getStates() {
  // GET /common/getState returns state_master list
  return apiCall('/common/getState', { method: 'GET' });
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
  return apiCall('/common/facility/getAll', { method: 'GET' });
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


