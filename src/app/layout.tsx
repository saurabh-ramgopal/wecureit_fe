import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Lora } from 'next/font/google'
import "../assets/styles/globals.css";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const lora = Lora({ 
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeCureIT",
  description: "WeCureIT - Manage appointments and medical records",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en">
      <body
        className={`${inter.variable} ${lora.variable} ${inter.className} antialiased`}
      >
        {children}
      <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
             style: {
            fontSize: "1.3rem",     
            padding: "1rem 1.5rem",  
            minWidth: "400px",     
            maxWidth: "1800px",
            borderRadius: "8px",   
          },
          }}
        />
      </body>
    </html>
  );
}
