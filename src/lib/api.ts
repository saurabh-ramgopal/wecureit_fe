import firebaseAuth from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get auth headers with Firebase token
async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await firebaseAuth.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Generic API call wrapper
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Helper to get auth headers from a stored token (backend-issued)
  async function getAuthHeaders(): Promise<HeadersInit> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic API call wrapper
  async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await getAuthHeaders();

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
    const res = await fetch(`${API_BASE_URL}/admin/getAllDoctors`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to fetch doctors');
    return res.json();
  }

  // Patient registration (backend-only: sends password to backend)
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

  // Login (backend authenticates and returns token)
  export async function login(email: string, password: string, userType: string) {
    const response = await fetch(`${API_BASE_URL}/common/login`, {
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
    return apiCall(`/patient/getById?patientId=${patientId}`, {
      method: 'GET',
    });
  }

  export async function updatePatient(patientData: any) {
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

