"use client";

import React from 'react'
import '@/app/css/login.css'
import { Toaster } from 'react-hot-toast';

type Props = {
  children: React.ReactNode
}

export default function LoginLayout({ children }: Props) {
  return (
    <>{children}
    <Toaster position="top-center" />
    </>
  )
}
