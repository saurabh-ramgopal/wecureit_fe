const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDoctors() {
  const res = await fetch(`${API_BASE_URL}/doctors/get`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}
