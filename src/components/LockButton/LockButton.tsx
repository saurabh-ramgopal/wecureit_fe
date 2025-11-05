"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function LockButton() {
  const router = useRouter();

  return (
    <button
      aria-label="Admin login"
      onClick={() => router.push('/admin/login')}
      className="wecureit-lock-button"
    >
      <Lock className="w-5 h-5" color="#ffffff" strokeWidth={2} />
    </button>
  );
}
