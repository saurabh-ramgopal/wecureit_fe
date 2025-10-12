"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; // optional for hamburger icon

type Props = {};

const NavBar = (props: Props) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/login", label: "Appointments" },
    { href: "/register", label: "Messages" },
    { href: "/home", label: "Profile" },
  ];

  return (
    <nav className="bg-primary text-[rgb(var(--color-primary))] shadow-md sticky top-0 z-20">
      <div className="relative">
        <img
          src="/logo.png"
          alt="WeCureIT Logo"
          className="h-60 w-60 absolute top-1/2 -translate-y-1/2 pb-4"
        />

        {/* Centered max-width container for links (logo is outside this flow) */}
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-end items-center">
          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                pathname === link.href
                  ? "text-accent border-b-2 border-accent"
                  : "hover:text-accent"
              } transition font-medium`}
            >
              {link.label}
            </Link>
          ))}

          <button className="bg-secondary hover:bg-secondary/90 px-4 py-2 rounded-lg font-semibold">
            Logout
          </button>
        </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
