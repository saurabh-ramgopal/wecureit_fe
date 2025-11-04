<<<<<<< HEAD

=======
>>>>>>> 7fe3808 (chore(fe): remove firebase helper and switch api to backend auth)
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

<<<<<<< HEAD
  if (token) headers['Authorization'] = `Bearer ${token}`;
=======
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

>>>>>>> 7fe3808 (chore(fe): remove firebase helper and switch api to backend auth)
  return headers;
}

// Generic API call wrapper
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.statusText}`);
  }

  return response.json();
}

// Public API calls (no auth required)
export async function getDoctors() {
<<<<<<< HEAD
  const res = await fetch(`${API_BASE_URL}/api/doctors/get`, {
=======
  const res = await fetch(`${API_BASE_URL}/admin/getAllDoctors`, {
>>>>>>> 7fe3808 (chore(fe): remove firebase helper and switch api to backend auth)
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch doctors');
  return res.json();
}

<<<<<<< HEAD
// Patient registration (backend handles password hashing/storage)
=======
// Patient registration (backend handles password hashing / storage)
>>>>>>> 7fe3808 (chore(fe): remove firebase helper and switch api to backend auth)
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
}

<<<<<<< HEAD
// Login (backend authenticates and returns a token stored under 'authToken')
=======
// Login (backend authenticates and returns a token)
>>>>>>> 7fe3808 (chore(fe): remove firebase helper and switch api to backend auth)
export async function login(email: string, password: string, userType: string) {
  const response = await fetch(`${API_BASE_URL}/common/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
<<<<<<< HEAD
    body: JSON.stringify({ email, password, type: userType }),
=======
    body: JSON.stringify({
      email,
      password,
      type: userType,
    }),
>>>>>>> 7fe3808 (chore(fe): remove firebase helper and switch api to backend auth)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Login failed');
  }

  const loginData = await response.json();
  const token = loginData.token || loginData.accessToken || loginData.jwt || '';

  if (token && typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userType', userType);
  }

  const userName = loginData.name || loginData.user?.name || email.split('@')[0];
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
<<<<<<< HEAD
  return apiCall(`/patient/getById?patientId=${patientId}`, { method: 'GET' });
}

export async function updatePatient(patientData: Record<string, unknown>) {
  return apiCall('/patient/addOrUpdate', { method: 'POST', body: JSON.stringify(patientData) });
=======
  return apiCall(`/patient/getById?patientId=${patientId}`, {
    method: 'GET',
  });
}

export async function updatePatient(patientData: Record<string, unknown>) {
  return apiCall('/patient/addOrUpdate', {
    method: 'POST',
    body: JSON.stringify(patientData),
  });
>>>>>>> 7fe3808 (chore(fe): remove firebase helper and switch api to backend auth)
}

// Doctor API calls
export async function getDoctorById(doctorId: number) {
<<<<<<< HEAD
  return apiCall(`/doctor/getById?doctorId=${doctorId}`, { method: 'GET' });
}

// Master data
// Assumption: backend exposes endpoints that return arrays of { id, name }
export async function getStates() {
  // Call the correct backend endpoint now that it exists: /common/getState
  return apiCall('/common/getState', { method: 'GET' });
}

export async function getSpecialities() {
  // Backend exposes specialities via CommonController -> /common/getSpeciality
  // (see CommonController.getSpeciality()). Use that path instead of /master/specialities.
  try {
    return await apiCall('/common/getSpeciality', { method: 'GET' });
  } catch (err) {
    console.error('getSpecialities failed', err);
    throw err;
  }
}

// Admin: add or update doctor
export async function addDoctor(doctorData: Record<string, unknown>) {
  return apiCall('/admin/doctor/addOrUpdate', { method: 'POST', body: JSON.stringify(doctorData) });
=======
  return apiCall(`/doctor/getById?doctorId=${doctorId}`, {
    method: 'GET',
  });
>>>>>>> 7fe3808 (chore(fe): remove firebase helper and switch api to backend auth)
}

