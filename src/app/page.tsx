"use client";

import React, { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import MainDashboard from "@/components/MainDashboard";
import VectorBackground from "@/components/VectorBackground";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("admin");

  useEffect(() => {
    // Check if user session exists in sessionStorage
    const savedUser = sessionStorage.getItem("skdr_user");
    if (savedUser) {
      setUsername(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
    sessionStorage.setItem("skdr_user", user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("skdr_user");
  };

  if (isLoggedIn) {
    return <MainDashboard username={username} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen min-h-dvh w-full bg-white relative flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Background Vector Placeholder (Faint healthcare & epidemiology watermark) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <VectorBackground opacity={0.04} />
      </div>

      {/* Main Mobile PWA Container */}
      <main className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col justify-between px-5 py-6 sm:px-6 sm:py-10">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </main>
    </div>
  );
}
