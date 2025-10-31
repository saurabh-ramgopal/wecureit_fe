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
      window.location.href = '/login';
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
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}

// Patient registration (uses Firebase, then backend)
export async function registerPatient(data: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  dob: string;
  gender: string;
}) {
  // Step 1: Register with Firebase (creates the account and hashes password)
  const { user, token } = await firebaseAuth.register(data.email, data.password);
  
  // Step 2: Register with backend (just stores user data in database)
  // Backend will get the Firebase UID from the JWT token
  const response = await fetch(`${API_BASE_URL}/patient/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Backend extracts Firebase UID from this token
    },
    body: JSON.stringify({
      email: data.email,
      // Don't send password - Firebase already has it
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

  return { user, data: await response.json() };
}

// Login function (Firebase only, no backend call needed)
export async function login(email: string, password: string, userType: string) {
  const { user, token } = await firebaseAuth.login(email, password);
  
  // Store token for later use
  localStorage.setItem('firebaseToken', token);
  localStorage.setItem('userType', userType);
  
  // Call backend to verify login and get user data including name
  let userName = user.displayName || user.email?.split('@')[0] || 'User';
  
  try {
    const response = await fetch(`${API_BASE_URL}/common/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        password: '', // Not needed for Firebase auth
        type: userType,
      }),
    });
    
    if (response.ok) {
      const loginData = await response.json();
      // Get name from backend response (from registration data)
      if (loginData.name) {
        userName = loginData.name;
      }
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    // Continue with fallback name
  }
  
  return { user, token, userName };
}

// Logout function
export async function logout() {
  await firebaseAuth.logout();
  localStorage.removeItem('firebaseToken');
  localStorage.removeItem('userType');
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

// Admin API calls
export async function getAdminById(adminId: number) {
  return apiCall(`/api/admin/getById?adminId=${adminId}`, {
    method: 'GET',
  });
}

