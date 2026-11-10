"use client";

import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle, RefreshCw } from "lucide-react";
import KemenkesLogo from "./KemenkesLogo";

interface LoginFormProps {
  onLoginSuccess?: (username: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState<string>("admin");
  const [password, setPassword] = useState<string>("skdr#testing1");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials requested by user
      if (
        (username.trim().toLowerCase() === "admin" || username.trim() === "admin@kemenkes.go.id") &&
        password === "skdr#testing1"
      ) {
        setIsLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess(username);
        }
      } else {
        setErrorMessage("Nama Pengguna atau Kata Sandi salah. Gunakan kredensial: admin / skdr#testing1");
        setIsLoading(false);
      }
    }, 450);
  };

  const handleResetDemo = () => {
    setUsername("admin");
    setPassword("skdr#testing1");
    setErrorMessage(null);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between">
      {/* Top and Form Section */}
      <div>
        {/* Top Kemenkes Logo */}
        <div className="mb-6 sm:mb-8">
          <KemenkesLogo size="md" />
        </div>

        {/* Portal Akses Pill Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-[#006e66] bg-[#e6f7f5] border border-[#b2e5df]">
            PORTAL AKSES
          </span>
        </div>

        {/* Heading */}
        <div className="mb-6 sm:mb-7">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192b28] tracking-tight mb-1.5">
            Masuk ke SKDR
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-normal">
            Masukkan akun Anda untuk membuka SKDR INDONESIA.
          </p>
        </div>

        {/* Alert Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Field 1: Nama Pengguna / Email */}
          <div>
            <label
              htmlFor="username"
              className="block text-[11px] font-bold tracking-wider uppercase text-slate-700 mb-1.5"
            >
              NAMA PENGGUNA / EMAIL
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-slate-400">
                <User className="w-4 h-4" strokeWidth={2} />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007067]/20 focus:border-[#007067] transition-all shadow-xs"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Field 2: Kata Sandi */}
          <div>
            <label
              htmlFor="password"
              className="block text-[11px] font-bold tracking-wider uppercase text-slate-700 mb-1.5"
            >
              KATA SANDI
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" strokeWidth={2} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="skdr#testing1"
                required
                className="w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007067]/20 focus:border-[#007067] transition-all tracking-wide shadow-xs"
                autoComplete="current-password"
              />
              {/* Eye Icon Button for Hide / Show Password */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute right-2.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#007067]/20 cursor-pointer"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4 text-slate-600" strokeWidth={2} />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-400" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase text-white bg-[#007067] hover:bg-[#005e57] active:bg-[#00524c] shadow-md shadow-[#007067]/25 hover:shadow-lg hover:shadow-[#007067]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed select-none active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>MEMPROSES...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 rotate-0" strokeWidth={2.4} />
                  <span>MASUK</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Helper pill to fill demo credentials if cleared */}
        {(username !== "admin" || password !== "skdr#testing1") && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResetDemo}
              className="text-[11px] text-[#007067] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Kembalikan kredensial default (admin / skdr#testing1)</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Text */}
      <div className="mt-10 sm:mt-14 pb-2 text-center">
        <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
          SKDR Indonesia &bull; Sistem Kewaspadaan Dini dan Respons
        </p>
      </div>
    </div>
  );
}
