"use client";

import React, { useState, useEffect, useRef } from "react";
import SkdrHeader from "./dashboard/SkdrHeader";
import SkdrFilterBar from "./dashboard/SkdrFilterBar";
import ExecutiveSummary from "./dashboard/ExecutiveSummary";
import DiseaseCarousel from "./dashboard/DiseaseCarousel";
import EbsUnitPanel from "./dashboard/EbsUnitPanel";
import UnderDevelopmentSection from "./dashboard/UnderDevelopmentSection";
import TataKelolaSection from "./tatakelola/TataKelolaSection";
import SectionNav, { DashboardSectionTab } from "./dashboard/SectionNav";
import { RefreshCw, ArrowUp, ChevronLeft, ChevronRight, LayoutGrid, Shield } from "lucide-react";

interface MainDashboardProps {
  username?: string;
  onLogout: () => void;
}

const SECTION_PAGES: { id: DashboardSectionTab; title: string; subtitle: string }[] = [
  {
    id: "ringkasan",
    title: "Ringkasan",
    subtitle: "KPI utama Sinyal EBS, Kasus PE, Kematian, dan Provinsi Terdampak",
  },
  {
    id: "cfr",
    title: "CFR",
    subtitle: "Analisis Case Fatality Rate (CFR) per penyakit dengan interval kepercayaan 95%.",
  },
  {
    id: "alert",
    title: "Alert",
    subtitle: "Daftar peringatan dini, sinyal alert SKDR mingguan, dan status verifikasi lapangan.",
  },
  {
    id: "t717",
    title: "7-1-7",
    subtitle: "Indikator ketepatan waktu deteksi ≤ 7 hari, notifikasi ≤ 1 hari, dan respons awal ≤ 7 hari.",
  },
  {
    id: "laboratorium",
    title: "Laboratorium",
    subtitle: "Matriks pemeriksaan spesimen dan hasil uji laboratorium penyakit menular.",
  },
  {
    id: "sebaran_wilayah",
    title: "Sebaran Wilayah",
    subtitle: "Peta interaktif dan sebaran sinyal EBS serta kasus PE di 38 provinsi Indonesia.",
  },
  {
    id: "tren",
    title: "Tren",
    subtitle: "Matriks heatmap perbandingan tren mingguan dan pertumbuhan kasus antar periode.",
  },
  {
    id: "klaster_epi_curve",
    title: "Klaster & EPI Curve",
    subtitle: "Pemantauan klaster kejadian luar biasa dan kurva epidemiologi mingguan.",
  },
  {
    id: "nar_skdr",
    title: "NAR-SKDR",
    subtitle: "Integrasi data surveilans spesimen NAR dengan sistem pelaporan SKDR nasional.",
  },
];

export default function MainDashboard({
  username = "admin",
  onLogout,
}: MainDashboardProps) {
  // Query parameters: startYear=2026&startWeek=1&endYear=2026&endWeek=45
  const [sumber, setSumber] = useState<"all" | "ebs" | "pe">("all");
  const [startYear, setStartYear] = useState(2026);
  const [startWeek, setStartWeek] = useState(1);
  const [endYear, setEndYear] = useState(2026);
  const [endWeek, setEndWeek] = useState(45);
  const [selectedProvince, setSelectedProvince] = useState("Semua provinsi");
  const [selectedCategory, setSelectedCategory] = useState("Semua kategori");
  const [selectedDisease, setSelectedDisease] = useState("Semua penyakit");
  const [selectedKabkota, setSelectedKabkota] = useState("Semua kabupaten/kota");
  const [selectedUnit, setSelectedUnit] = useState("Semua unit pelapor");

  const [activeTopMenu, setActiveTopMenu] = useState<"dasbor" | "tata_kelola">("dasbor");
  const [activeSection, setActiveSection] = useState<DashboardSectionTab>("ringkasan");
  const [isOnline, setIsOnline] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

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

  const handleFilterChange = (filters: {
    sumber: "all" | "ebs" | "pe";
    startYear: number;
    startWeek: number;
    endYear: number;
    endWeek: number;
    selectedProvince: string;
    selectedCategory: string;
    selectedDisease: string;
    selectedKabkota: string;
    selectedUnit: string;
  }) => {
    setSumber(filters.sumber);
    setStartYear(filters.startYear);
    setStartWeek(filters.startWeek);
    setEndYear(filters.endYear);
    setEndWeek(filters.endWeek);
    setSelectedProvince(filters.selectedProvince);
    setSelectedCategory(filters.selectedCategory);
    setSelectedDisease(filters.selectedDisease);
    setSelectedKabkota(filters.selectedKabkota);
    setSelectedUnit(filters.selectedUnit);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeIndex = SECTION_PAGES.findIndex((p) => p.id === activeSection);

  // Jump to specific page
  const handlePageChange = (tab: DashboardSectionTab) => {
    setActiveSection(tab);
    const index = SECTION_PAGES.findIndex((p) => p.id === tab);
    if (sliderRef.current && index !== -1) {
      isProgrammaticScroll.current = true;
      const width = sliderRef.current.clientWidth;
      sliderRef.current.scrollTo({
        left: index * width,
        behavior: "smooth",
      });
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 400);
    }
  };

  // Sync active section when user slides/swipes horizontally
  const handleSliderScroll = () => {
    if (isProgrammaticScroll.current || !sliderRef.current) return;
    const { scrollLeft, clientWidth } = sliderRef.current;
    if (clientWidth === 0) return;
    const index = Math.round(scrollLeft / clientWidth);
    if (index >= 0 && index < SECTION_PAGES.length) {
      const target = SECTION_PAGES[index].id;
      if (target !== activeSection) {
        setActiveSection(target);
      }
    }
  };

  const handlePrevPage = () => {
    if (activeIndex > 0) {
      handlePageChange(SECTION_PAGES[activeIndex - 1].id);
    }
  };

  const handleNextPage = () => {
    if (activeIndex < SECTION_PAGES.length - 1) {
      handlePageChange(SECTION_PAGES[activeIndex + 1].id);
    }
  };

  return (
    <div className="min-h-screen min-h-dvh bg-slate-100 flex flex-col font-sans pb-24 no-scrollbar">
      {/* Header */}
      <SkdrHeader
        username={username}
        onLogout={onLogout}
        isOnline={isOnline}
        onNavigateHome={() => {
          setActiveTopMenu("dasbor");
          handlePageChange("ringkasan");
        }}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 no-scrollbar">
        {/* Top Switcher Buttons: DASBOR & TATA KELOLA (sebelum Filter) */}
        <div className="mb-3.5">
          <div
            role="tablist"
            aria-label="Menu Utama SKDR"
            className="inline-flex items-center rounded-full bg-white p-1 border border-slate-200/80 shadow-xs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTopMenu === "dasbor"}
              onClick={() => setActiveTopMenu("dasbor")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTopMenu === "dasbor"
                  ? "bg-[#007067] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid
                className={`w-3.5 h-3.5 ${
                  activeTopMenu === "dasbor" ? "text-white" : "text-slate-500"
                }`}
              />
              <span>DASBOR</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTopMenu === "tata_kelola"}
              onClick={() => setActiveTopMenu("tata_kelola")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTopMenu === "tata_kelola"
                  ? "bg-[#007067] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Shield
                className={`w-3.5 h-3.5 ${
                  activeTopMenu === "tata_kelola" ? "text-white" : "text-slate-500"
                }`}
              />
              <span>TATA KELOLA</span>
            </button>
          </div>
        </div>

        {activeTopMenu === "dasbor" ? (
          <>
            {/* Filter Bar (W1 - W45 2026, Wilayah, Kategori, Sumber, Penyakit, Unit) */}
            <SkdrFilterBar
              sumber={sumber}
              startYear={startYear}
              startWeek={startWeek}
              endYear={endYear}
              endWeek={endWeek}
              selectedProvince={selectedProvince}
              selectedCategory={selectedCategory}
              selectedDisease={selectedDisease}
              selectedKabkota={selectedKabkota}
              selectedUnit={selectedUnit}
              onFilterChange={handleFilterChange}
            />

            {/* Section Navigation Tabs (Sticky bar) */}
            <SectionNav activeTab={activeSection} onTabChange={handlePageChange} />

            {/* Touch-Slideable Carousel Container (Hidden scrollbar + Snap) */}
            <div
              ref={sliderRef}
              onScroll={handleSliderScroll}
              className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {/* TAB 1: Ringkasan */}
              <div className="w-full min-w-full flex-shrink-0 snap-center snap-always space-y-6">
                <ExecutiveSummary
                  sumber={sumber}
                  startYear={startYear}
                  startWeek={startWeek}
                  endYear={endYear}
                  endWeek={endWeek}
                  selectedProvince={selectedProvince}
                  selectedDisease={selectedDisease}
                />
                <DiseaseCarousel
                  sumber={sumber}
                  selectedCategory={selectedCategory}
                  selectedDisease={selectedDisease}
                />
                {sumber !== "pe" ? (
                  <EbsUnitPanel selectedUnitFilter={selectedUnit} />
                ) : null}
              </div>

              {/* TABS 2-9: CFR, Alert, 7-1-7, Laboratorium, Sebaran Wilayah, Tren, Klaster & EPI Curve, NAR-SKDR */}
              {SECTION_PAGES.slice(1).map((page) => (
                <div
                  key={page.id}
                  className="w-full min-w-full flex-shrink-0 snap-center snap-always"
                >
                  <UnderDevelopmentSection
                    title={page.title}
                    description={page.subtitle}
                    onBackToRingkasan={() => handlePageChange("ringkasan")}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <TataKelolaSection username={username} />
        )}
      </main>

      {/* Floating Bottom Pagination & Quick Action Bar */}
      {activeTopMenu === "dasbor" && (
        <div className="fixed bottom-3 left-4 right-4 z-40 max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg p-2.5 flex items-center justify-between gap-2 text-xs">
            {/* Prev Page Button */}
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={activeIndex === 0}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold disabled:opacity-30 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Prev</span>
            </button>

            {/* Pagination Indicators & Page Number */}
            <div className="flex items-center gap-1.5">
              {SECTION_PAGES.map((page, idx) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => handlePageChange(page.id)}
                  aria-label={`Ke halaman ${idx + 1}`}
                  className={`transition-all rounded-full cursor-pointer ${
                    activeSection === page.id
                      ? "w-6 h-2 bg-[#007067]"
                      : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            {/* Next Page Button */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleNextPage}
                disabled={activeIndex === SECTION_PAGES.length - 1}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#007067] hover:bg-[#005e57] text-white font-semibold disabled:opacity-30 cursor-pointer transition-colors"
              >
                <span className="hidden xs:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Quick Actions */}
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1.5 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-slate-100 cursor-pointer"
                title="Segarkan data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={scrollToTop}
                className="p-1.5 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-slate-100 cursor-pointer"
                title="Ke atas"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
