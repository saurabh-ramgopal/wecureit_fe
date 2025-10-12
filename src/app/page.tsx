"use client";
import { useEffect, useState } from "react";
import "../styles/colors.css"; 
import "../app/globals.css";
import Link from "next/link";
import { Home } from "lucide-react";
import HomePage from "./home/page";
export default function Page() {
  return (
    <HomePage/>
  );
}
