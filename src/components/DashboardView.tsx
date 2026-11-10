"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Activity,
  AlertTriangle,
  FileSpreadsheet,
  MapPin,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  Plus,
  RefreshCw,
  Search,
  Filter,
  LogOut,
  ChevronRight,
  Shield,
  Wifi,
  WifiOff,
  Clock,
  Layers,
  LayoutDashboard,
  ClipboardList
} from "lucide-react";
import KemenkesLogo from "./KemenkesLogo";

interface DashboardViewProps {
  username: string;
  onLogout: () => void;
}

interface PESignalItem {
  id: string;
  disease: string;
  location: string;
  date: string;
  cases: number;
  status: "Perlu Verifikasi" | "Sedang Investigasi" | "Terkendali";
  alertLevel: "merah" | "kuning" | "hijau";
  reporter: string;
}

export default function DashboardView({ username, onLogout }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"dasbor" | "formPe" | "peta" | "profil">("dasbor");
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New PE Form State
  const [newDisease, setNewDisease] = useState("Demam Berdarah Dengue (DBD)");
  const [newLocation, setNewLocation] = useState("Puskesmas Cilandak, Jakarta Selatan");
  const [newCases, setNewCases] = useState(3);
  const [newNotes, setNewNotes] = useState("");

  const [signals, setSignals] = useState<PESignalItem[]>([
    {
      id: "SIG-2026-089",
      disease: "Demam Berdarah Dengue (DBD)",
      location: "Puskesmas Gambir, Jakarta Pusat",
      date: "Hari ini, 10:20 WIB",
      cases: 6,
      status: "Perlu Verifikasi",
      alertLevel: "merah",
      reporter: "Surveilans PKM Gambir",
    },
    {
      id: "SIG-2026-088",
      disease: "Campak (Suspek)",
      location: "Puskesmas Sukasari, Kab. Bandung",
      date: "Kemarin, 16:45 WIB",
      cases: 4,
      status: "Sedang Investigasi",
      alertLevel: "kuning",
      reporter: "Dinkes Kab. Bandung",
    },
    {
      id: "SIG-2026-087",
      disease: "Leptospirosis",
      location: "Puskesmas Genuk, Kota Semarang",
      date: "08 Nov 2026",
      cases: 2,
      status: "Terkendali",
      alertLevel: "hijau",
      reporter: "Dinkes Kota Semarang",
    },
    {
      id: "SIG-2026-086",
      disease: "Diare Akut Masif",
      location: "Puskesmas Mandau, Kab. Bengkalis",
      date: "07 Nov 2026",
      cases: 11,
      status: "Sedang Investigasi",
      alertLevel: "kuning",
      reporter: "Dinkes Kab. Bengkalis",
    },
  ]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleAddSignal = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: PESignalItem = {
      id: `SIG-2026-${Math.floor(100 + Math.random() * 900)}`,
      disease: newDisease,
      location: newLocation,
      date: "Baru saja",
      cases: Number(newCases),
      status: "Perlu Verifikasi",
      alertLevel: Number(newCases) > 5 ? "merah" : "kuning",
      reporter: `Admin (${username})`,
    };

    setSignals([newEntry, ...signals]);
    setShowAddModal(false);
    setNewNotes("");
  };

  const filteredSignals = signals.filter(
    (s) =>
      s.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#005e57] text-white shadow-md">
        {/* Offline / Online Status Bar */}
        <div
          className={`py-1 px-4 text-[11px] font-semibold flex items-center justify-between transition-colors ${
            isOnline ? "bg-[#004e49]" : "bg-amber-600 text-amber-50"
          }`}
        >
          <div className="flex items-center gap-1.5">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-[#79e27c]" />
                <span>Mode Online &bull; Terhubung ke SKDR Kemenkes RI</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-white" />
                <span>Mode Offline Lapangan &bull; Data tersimpan lokal</span>
              </>
            )}
          </div>
          <span className="text-[10px] opacity-80">Minggu Ep 45 - 2026</span>
        </div>

        {/* Brand & User Header */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <KemenkesLogo size="sm" textColor="text-white" />
            <div className="h-4 w-px bg-white/20" />
            <span className="text-xs font-bold tracking-wider text-[#79e27c]">
              SKDR MOBILE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors relative"
                aria-label="Notifikasi sinyal"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              </button>
            </div>
            <button
              onClick={onLogout}
              className="px-2.5 py-1 text-xs font-semibold bg-white/10 hover:bg-red-500/80 rounded-lg text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6">
        {/* TAB 1: DASBOR UTAMA */}
        {activeTab === "dasbor" && (
          <div className="space-y-4">
            {/* Welcome Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#006d67] to-[#0d524d] text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-[#79e27c] border border-white/20">
                  Akses Berbasis Peran
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold mt-2">
                  Selamat Datang, {username}
                </h2>
                <p className="text-xs text-white/80 mt-1 max-w-md">
                  Pengawasan Sinyal EBS dan Form Penyelidikan Epidemiologi
                  seluruh Indonesia berjalan aktif.
                </p>
              </div>
              <div className="absolute right-3 bottom-0 opacity-15 pointer-events-none">
                <Activity className="w-32 h-32 text-white" />
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Sinyal EBS Aktif
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-red-600">
                    14
                  </span>
                  <span className="text-[10px] text-red-600 font-bold">+2 baru</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Form PE Selesai
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-[#007067]">
                    86%
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">&uarr; 4%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Target 7-1-7
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-amber-600">
                    92%
                  </span>
                  <span className="text-[10px] text-slate-500">Tercapai</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Kepatuhan Faskes
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-800">
                    98.1%
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">Nasional</span>
                </div>
              </div>
            </div>

            {/* Indikator 7-1-7 Progress Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-700" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Indikator Kecepatan Respons (7-1-7)
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-teal-700">92/100 Skor</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                <div className="p-2 rounded-xl bg-teal-50 border border-teal-100">
                  <span className="text-[10px] text-slate-500 block">7 Hari Deteksi</span>
                  <span className="font-bold text-teal-800">4.2 Hari (Cepat)</span>
                </div>
                <div className="p-2 rounded-xl bg-teal-50 border border-teal-100">
                  <span className="text-[10px] text-slate-500 block">1 Hari Notifikasi</span>
                  <span className="font-bold text-teal-800">&lt; 12 Jam</span>
                </div>
                <div className="p-2 rounded-xl bg-teal-50 border border-teal-100">
                  <span className="text-[10px] text-slate-500 block">7 Hari Respons</span>
                  <span className="font-bold text-teal-800">3.8 Hari</span>
                </div>
              </div>
            </div>

            {/* Sinyal Peringatan Dini Terkini */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Sinyal Kewaspadaan Dini (EBS Alert)
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-2.5 py-1 bg-[#007067] hover:bg-[#005e57] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Input Sinyal</span>
                </button>
              </div>

              {/* Search bar */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari penyakit atau lokasi puskesmas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                />
              </div>

              {/* Signal List */}
              <div className="space-y-2.5">
                {filteredSignals.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex items-start justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                          item.alertLevel === "merah"
                            ? "bg-red-500 shadow-xs shadow-red-500/50"
                            : item.alertLevel === "kuning"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {item.disease}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              item.status === "Perlu Verifikasi"
                                ? "bg-red-100 text-red-700"
                                : item.status === "Sedang Investigasi"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.location}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {item.cases} Kasus terdeteksi &bull; {item.date} &bull; {item.reporter}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Membuka rincian sinyal ${item.id}`)}
                      className="text-teal-700 hover:text-teal-900 p-1 rounded-lg hover:bg-teal-50 text-xs font-semibold flex items-center cursor-pointer"
                    >
                      <span>Detail</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FORM PE (Penyelidikan Epidemiologi) */}
        {activeTab === "formPe" && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Form Penyelidikan Epidemiologi (Form PE)
                </h2>
                <p className="text-xs text-slate-500">
                  Pencatatan kasus lapangan siap digunakan secara offline.
                </p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold bg-teal-50 text-teal-700 rounded-full border border-teal-200">
                Offline Ready
              </span>
            </div>

            <form onSubmit={handleAddSignal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jenis Penyakit Potensial KLB
                </label>
                <select
                  value={newDisease}
                  onChange={(e) => setNewDisease(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600/20"
                >
                  <option>Demam Berdarah Dengue (DBD)</option>
                  <option>Campak (Suspek)</option>
                  <option>Difteri</option>
                  <option>Kolera / Diare Akut</option>
                  <option>Leptospirosis</option>
                  <option>Gigitan Hewan Penular Rabies (GHPR)</option>
                  <option>COVID-19</option>
                  <option>AFP (Lumpuh Layu Akut)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fasilitas Pelayanan Kesehatan / Lokasi
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Contoh: Puskesmas Menteng, Jakarta Pusat"
                  required
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jumlah Kasus Terduga
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newCases}
                    onChange={(e) => setNewCases(Number(e.target.value))}
                    required
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tingkat Kewaspadaan
                  </label>
                  <input
                    type="text"
                    disabled
                    value={newCases > 5 ? "Sinyal Merah (Tinggi)" : "Sinyal Kuning (Waspada)"}
                    className="w-full p-2.5 text-xs bg-slate-100 rounded-xl border border-slate-200 font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Gejala & Investigasi Awal
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Masukkan riwayat kontak, gejala dominan, pengambilan sampel lab..."
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#007067] hover:bg-[#005e57] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.99] flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan & Laporkan Form PE</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PETA SEBARAN (SPASIAL) */}
        {activeTab === "peta" && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Dasbor Spasial & Peta Sebaran Penyakit
                </h2>
                <p className="text-xs text-slate-500">
                  Sebaran klaster sinyal kewaspadaan di seluruh Indonesia.
                </p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                38 Provinsi
              </span>
            </div>

            {/* Map Placeholder Graphic */}
            <div className="relative w-full h-64 rounded-2xl bg-gradient-to-br from-[#0c4945] to-[#062c29] p-4 text-white flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold z-10">
                <span className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-xs">
                  Layer: Klaster DBD & Campak
                </span>
                <span className="text-[#79e27c]">Terakhir diperbarui: 10 menit lalu</span>
              </div>

              {/* Faint Grid Lines */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#79e27c_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Map Island Silhouettes Representation */}
              <div className="relative z-10 flex items-center justify-center my-auto">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <span className="text-sm font-bold text-white">
                      Klaster Jakarta (6 Sinyal Aktif)
                    </span>
                  </div>
                  <p className="text-xs text-white/70 max-w-sm mx-auto">
                    Puskesmas Gambir, Cilandak, Menteng dalam status waspada merah.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] z-10 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-2xl backdrop-blur-xs">
                <span>Merah: Waspada KLB</span>
                <span>Kuning: Peningkatan Kasus</span>
                <span>Hijau: Terkendali</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFIL & TATA KELOLA */}
        {activeTab === "profil" && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-extrabold text-lg">
                {username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">{username}</h3>
                <p className="text-xs text-teal-700 font-semibold">
                  Administrator SKDR Pusat (Ditjen P2P)
                </p>
                <p className="text-[11px] text-slate-400">Kementerian Kesehatan RI</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Informasi Sistem & Integrasi
              </h4>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Versi SKDR Mobile:</span>
                  <span className="font-bold text-slate-800">v2.4.0 (PWA)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status Server:</span>
                  <span className="font-bold text-emerald-600">Terhubung Normal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sinkronisasi Terakhir:</span>
                  <span className="font-bold text-slate-800">Hari ini, 13:05 WIB</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert("Data SKDR berhasil disinkronkan ke server Kemenkes Pusat!");
              }}
              className="w-full py-2.5 rounded-xl border border-teal-600 text-teal-700 hover:bg-teal-50 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sinkronisasi Data Sekarang</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar dari Akun (Logout)</span>
            </button>
          </div>
        )}
      </main>

      {/* Bottom PWA Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-lg max-w-lg mx-auto sm:rounded-t-3xl">
        <button
          type="button"
          onClick={() => setActiveTab("dasbor")}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer transition-colors ${
            activeTab === "dasbor"
              ? "text-[#007067] font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Dasbor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("formPe")}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer transition-colors ${
            activeTab === "formPe"
              ? "text-[#007067] font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px]">Form PE</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("peta")}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer transition-colors ${
            activeTab === "peta"
              ? "text-[#007067] font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px]">Peta</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profil")}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer transition-colors ${
            activeTab === "profil"
              ? "text-[#007067] font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span className="text-[10px]">Profil</span>
        </button>
      </nav>

      {/* Modal Quick Input Sinyal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3">
            <h3 className="font-bold text-sm text-slate-900">
              Input Sinyal EBS Cepat
            </h3>
            <form onSubmit={handleAddSignal} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Penyakit
                </label>
                <input
                  type="text"
                  value={newDisease}
                  onChange={(e) => setNewDisease(e.target.value)}
                  required
                  className="w-full p-2 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Puskesmas / Wilayah
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                  className="w-full p-2 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Jumlah Kasus
                </label>
                <input
                  type="number"
                  min={1}
                  value={newCases}
                  onChange={(e) => setNewCases(Number(e.target.value))}
                  required
                  className="w-full p-2 text-xs border rounded-xl"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs bg-slate-100 rounded-xl font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs bg-[#007067] text-white rounded-xl font-bold"
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

