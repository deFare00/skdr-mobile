"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  LayoutGrid,
  Shield,
  KeyRound,
  LogOut,
  ChevronDown,
  WifiOff,
  X,
  CheckCircle2,
  Lock,
  Layers,
  Database,
  Users
} from "lucide-react";
import KemenkesLogo from "../KemenkesLogo";

interface SkdrHeaderProps {
  username?: string;
  onLogout: () => void;
  isOnline?: boolean;
  onNavigateHome?: () => void;
}

export default function SkdrHeader({
  username = "admin",
  onLogout,
  isOnline = true,
  onNavigateHome,
}: SkdrHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTataKelolaModal, setShowTataKelolaModal] = useState(false);

  // Password modal states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setShowPasswordModal(false);
        setShowTataKelolaModal(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!oldPassword) {
      setPasswordError("Masukkan kata sandi saat ini");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Kata sandi baru minimal 6 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi tidak cocok");
      return;
    }

    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1200);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
        {/* Offline banner if offline */}
        {!isOnline && (
          <div className="bg-amber-600 text-white text-[11px] font-semibold py-1 px-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Mode Offline &bull; Menampilkan data statis tersimpan</span>
            </div>
            <span className="text-[10px] opacity-90">PWA Offline Mode</span>
          </div>
        )}

        <div className="px-4 py-2.5 sm:py-3 flex items-center justify-between max-w-4xl mx-auto">
          {/* Brand / Logo */}
          <div className="flex items-center gap-2.5">
            <KemenkesLogo size="sm" />
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <div className="leading-none">
              <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                SKDR INDONESIA
              </h1>
              <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
                Kementerian Kesehatan Republik Indonesia
              </p>
            </div>
          </div>

          {/* User Profile Card Dropdown (Replaces notification bell & old logout button) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600/20 active:scale-[0.98]"
              aria-expanded={isDropdownOpen}
              aria-label="Menu Akun Administrator"
            >
              {/* Circular Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#007067] text-white flex items-center justify-center font-black text-sm shadow-xs flex-shrink-0">
                A
              </div>

              {/* Title & Role */}
              <div className="text-left hidden min-[360px]:block leading-tight pr-0.5">
                <div className="text-xs font-black text-slate-900 truncate max-w-[110px]">
                  Administrator
                </div>
                <div className="text-[10px] text-slate-400 font-medium truncate max-w-[110px]">
                  Administrator
                </div>
              </div>

              {/* Downward Chevron */}
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 mr-1 sm:mr-0 ${
                  isDropdownOpen ? "rotate-180 text-teal-700" : ""
                }`}
              />
            </button>

            {/* Dropdown Card */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 sm:w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Profile Header */}
                <div className="px-2 py-1.5">
                  <div className="text-sm font-black text-slate-900">
                    Administrator
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">
                    @{username} &middot; Administrator
                  </div>
                </div>

                {/* Subtle Divider */}
                <div className="h-px bg-slate-100 my-2" />

                {/* Menu Items */}
                <div className="space-y-0.5 text-slate-700">
                  {/* 1. Dasbor */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onNavigateHome?.();
                    }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer"
                  >
                    <LayoutGrid className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>Dasbor</span>
                  </button>

                  {/* 2. Tata Kelola */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowTataKelolaModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>Tata Kelola</span>
                  </button>

                  {/* 3. Ganti kata sandi */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowPasswordModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>Ganti kata sandi</span>
                  </button>

                  {/* 4. Keluar */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 text-xs sm:text-sm font-semibold rounded-xl hover:bg-red-50 hover:text-red-600 text-slate-700 transition-colors text-left cursor-pointer mt-1 pt-2 border-t border-slate-100"
                  >
                    <LogOut className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal: Ganti Kata Sandi */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#007067]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Ganti Kata Sandi
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Perbarui keamanan akun @{username}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1.5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-800">
                  Kata Sandi Berhasil Diperbarui!
                </p>
                <p className="text-[10px] text-emerald-600">
                  Gunakan kata sandi baru saat login berikutnya.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                {passwordError && (
                  <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold">
                    {passwordError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Kata Sandi Saat Ini
                  </label>
                  <input
                    type="password"
                    placeholder="Masukkan kata sandi lama..."
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    placeholder="Minimal 6 karakter..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    placeholder="Ulangi kata sandi baru..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white bg-[#007067] hover:bg-[#005e57] rounded-xl shadow-xs cursor-pointer"
                  >
                    Simpan Kata Sandi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Tata Kelola */}
      {showTataKelolaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#007067]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Tata Kelola SKDR
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Manajemen data, form PE & sinkronisasi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTataKelolaModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#007067]">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900">Form PE Terpadu</div>
                  <div className="text-[10px] text-slate-500">Penyelidikan epidemiologi 24 penyakit</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Aktif
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#007067]">
                  <Database className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900">Master Data Wilayah & Faskes</div>
                  <div className="text-[10px] text-slate-500">38 Provinsi, 514 Kab/Kota, 10.374 Puskesmas</div>
                </div>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Sinkron
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#007067]">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900">Akses Berbasis Peran (RBAC)</div>
                  <div className="text-[10px] text-slate-500">Hak akses Puskesmas, Dinkes Kab/Kota & Prov</div>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Administrator
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTataKelolaModal(false)}
              className="w-full py-2.5 text-xs font-bold text-white bg-[#007067] hover:bg-[#005e57] rounded-xl shadow-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
