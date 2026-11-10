"use client";

import React, { useState, useEffect, useRef } from "react";
import SkdrHeader from "./dashboard/SkdrHeader";
import SkdrFilterBar from "./dashboard/SkdrFilterBar";
import ExecutiveSummary from "./dashboard/ExecutiveSummary";
import T717 from "./dashboard/T717";
import DiseaseCarousel from "./dashboard/DiseaseCarousel";
import AlertSkdrSections from "./dashboard/AlertSkdrSections";
import DiseaseTable from "./dashboard/DiseaseTable";
import EpiCurveSection from "./dashboard/EpiCurveSection";
import TrendHeatmap from "./dashboard/TrendHeatmap";
import SpatialMapSection from "./dashboard/SpatialMapSection";
import EbsPanels from "./dashboard/EbsPanels";
import KlasterLabSection from "./dashboard/KlasterLabSection";
import SectionNav, { DashboardSectionTab } from "./dashboard/SectionNav";
import { RefreshCw, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";

interface MainDashboardProps {
  username?: string;
  onLogout: () => void;
}

const SECTION_PAGES: { id: DashboardSectionTab; title: string; subtitle: string }[] = [
  {
    id: "ringkasan",
    title: "Ringkasan Eksekutif & Indikator 7-1-7",
    subtitle: "KPI utama, capaian 7-1-7, dan penyakit prioritas KLB",
  },
  {
    id: "tabel_alerts",
    title: "Peringatan Dini Sinyal EBS & Tabel 24 Penyakit",
    subtitle: "Daftar sinyal EBS dan kompilasi data kasus PE",
  },
  {
    id: "kurva_tren",
    title: "Kurva Epidemiologi & Matriks Tren",
    subtitle: "Kurva kasus mingguan dan heatmap intensitas lonjakan",
  },
  {
    id: "peta_spasial",
    title: "Peta Spasial Sebaran Wilayah",
    subtitle: "Sebaran risiko sinyal epidemiologi 38 provinsi",
  },
  {
    id: "klaster_ebs",
    title: "Sinyal EBS, Klaster & Laboratorium",
    subtitle: "Surveilans rumor, penyelidikan klaster, dan spesimen NAR",
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

  const currentPageInfo = SECTION_PAGES[activeIndex] || SECTION_PAGES[0];

  return (
    <div className="min-h-screen min-h-dvh bg-slate-100 flex flex-col font-sans pb-24 no-scrollbar">
      {/* Header */}
      <SkdrHeader
        username={username}
        onLogout={onLogout}
        isOnline={isOnline}
        onNavigateHome={() => handlePageChange("ringkasan")}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 no-scrollbar">
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

        {/* Page Header & Pagination Indicator */}
        <div className="p-3 mb-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#007067] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">
                {activeIndex + 1}
              </span>
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                {currentPageInfo.title}
              </h2>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate hidden sm:block">
              {currentPageInfo.subtitle}
            </p>
          </div>

          {/* Quick Page Prev/Next Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={activeIndex === 0}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors"
              title="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>

            {/* Pagination Number Buttons */}
            <div className="hidden xs:flex items-center gap-1">
              {SECTION_PAGES.map((page, idx) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => handlePageChange(page.id)}
                  className={`w-6 h-6 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeSection === page.id
                      ? "bg-[#007067] text-white shadow-xs"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={activeIndex === SECTION_PAGES.length - 1}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors"
              title="Halaman selanjutnya"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>

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
          {/* HALAMAN 1: Ringkasan Eksekutif, Indikator 7-1-7, & Disease Carousel */}
          <div className="w-full min-w-full flex-shrink-0 snap-center snap-always">
            <ExecutiveSummary />
            <T717 />
            <DiseaseCarousel />
          </div>

          {/* HALAMAN 2: Peringatan Dini (Alerts) & Tabel Kompilasi 24 Penyakit */}
          <div className="w-full min-w-full flex-shrink-0 snap-center snap-always">
            <AlertSkdrSections selectedCategory={selectedCategory} />
            <DiseaseTable />
          </div>

          {/* HALAMAN 3: Kurva Epidemiologi (EpiCurve) & Matriks Heatmap Tren */}
          <div className="w-full min-w-full flex-shrink-0 snap-center snap-always">
            <EpiCurveSection />
            <TrendHeatmap />
          </div>

          {/* HALAMAN 4: Peta Spasial Sebaran Wilayah & Tabel Provinsi */}
          <div className="w-full min-w-full flex-shrink-0 snap-center snap-always">
            <SpatialMapSection />
          </div>

          {/* HALAMAN 5: Sinyal EBS, Klaster Kasus & Laboratorium NAR */}
          <div className="w-full min-w-full flex-shrink-0 snap-center snap-always">
            <EbsPanels />
            <KlasterLabSection />
          </div>
        </div>
      </main>

      {/* Floating Bottom Pagination & Quick Action Bar */}
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
    </div>
  );
}
