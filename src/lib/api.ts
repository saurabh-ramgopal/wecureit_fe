const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

function headersWithAuth(extra: Record<string,string> = {}) {
  const headers: Record<string,string> = { 'Content-Type': 'application/json', ...extra };
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('accessToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function getDoctors() {
  const res = await fetch(`${API_BASE_URL}/doctors/get`, {
    method: "GET",
    headers: headersWithAuth(),
  });
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}
