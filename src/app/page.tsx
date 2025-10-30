"use client";
import { useEffect, useState } from "react";
import "../styles/colors.css"; 
import "../app/globals.css";
import Image from 'next/image';
import { RefreshCw, Zap , CheckCircle, Lock } from "lucide-react";

export default function Page() {
  return (
  <div className="min-h-screen flex flex-col">
  {/* Header */}
  <header className="bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] shadow-lg">
    <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="relative h-16 w-40">
        <Image
          src="/wecureit-logo.png"
          alt="WeCureIT"
          fill
          className="object-contain scale-300"
          priority
        />
      </div>
      <div className="flex gap-4">
     <a
        href="/login"
        className="px-6 py-2 bg-white text-teal-700 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:-translate-y-0.5 inline-block"
      >
        Login
      </a>
        <a
          href="/register"
          className="px-6 py-2 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-teal-700 transition-all hover:-translate-y-0.5"
        >
          Register
        </a>
      </div>
    </div>
  </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-50 to-cyan-100 py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl md:text-5xl font-bold text-teal-700 mb-6">
            Seamless Healthcare Access
          </h1>
          <p className="text-xl md:text-2xl text-teal-800 mb-8 max-w-2xl mx-auto">
            Find available doctors across all facilities instantly. No more waiting, no more hassle
          </p>
          <a
            href="/register"
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-lg font-semibold rounded-full hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4 bg-white flex-grow">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-50 p-8 rounded-xl text-center border-2 border-cyan-100 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-xl transition-all">
              <CheckCircle size={64} className="mx-auto mb-4 text-teal-600" />
                <h3 className="text-2xl font-bold text-teal-700 mb-3">
                  Easy Booking
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Reserve appointments in seconds. Search by doctor, or specialty - it's that simple.
                </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 p-8 rounded-xl text-center border-2 border-cyan-100 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-xl transition-all">
               <Zap size={64} className="mx-auto mb-4 text-teal-600" />
              <h3 className="text-2xl font-bold text-teal-700 mb-3">
                Fast & Efficient
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Streamlined workflows and intuitive interface designed for healthcare professionals.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 p-8 rounded-xl text-center border-2 border-cyan-100 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-xl transition-all">
              <RefreshCw size={64} className="mx-auto mb-4 text-teal-600" />
                <h3 className="text-2xl font-bold text-teal-700 mb-3">
                  Flexible Appointments
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Choose any doctor or facility that fits your schedule. Maximum convenience, minimum hassle.
                </p>
                </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-900 text-white text-center py-8">
        <p className="opacity-90">&copy; 2025 WeCureIT. All rights reserved.</p>
      </footer>

      {/* Admin access button (small, visible) */}
      <a
        href="/admin/login"
        title="Admin login"
        aria-label="Admin login"
        className="fixed right-4 top-4 w-9 h-9 rounded-full bg-teal-900 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition z-50 shadow-md"
      >
        <Lock size={14} />
      </a>

    </div>
  );
}
