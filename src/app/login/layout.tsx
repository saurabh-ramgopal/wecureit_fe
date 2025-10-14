"use client";

import React from 'react'
import '@/app/css/login.css'

type Props = {
  children: React.ReactNode
}

export default function LoginLayout({ children }: Props) {
  return (
    <>{children}</>
  )
}
