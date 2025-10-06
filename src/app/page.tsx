"use client";
import { useEffect, useState } from "react";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/get`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setDoctors(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  console.log("Doctors:", doctors); // 👈 check browser console

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Doctors</h1>
      {doctors.length === 0 ? (
        <p>No doctors found</p>
      ) : (
        <ul className="space-y-2">
          {doctors.map((doc, idx) => (
            <li key={idx} className="p-3 bg-gray-100 rounded">
              {doc.doctorMasterId} — {doc.doctorName}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
