"use client";

import React, { useState } from "react";
import {
  Radio,
  Layers,
  Bug,
  Map,
  MapPin,
  Building2,
  Calendar,
  CheckCircle2,
  RotateCcw,
  ChevronDown,
  Filter,
  Check
} from "lucide-react";
import { SKDR_DISEASE_ALERTS, SKDR_PROVINCE_ALERTS } from "@/data/skdrData";

export interface SkdrFilterBarProps {
  sumber?: "all" | "ebs" | "pe";
  startYear?: number;
  startWeek?: number;
  endYear?: number;
  endWeek?: number;
  selectedProvince?: string;
  selectedCategory?: string;
  selectedDisease?: string;
  selectedKabkota?: string;
  selectedUnit?: string;
  onFilterChange: (filters: {
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
  }) => void;
}

export default function SkdrFilterBar({
  sumber = "all",
  startYear = 2026,
  startWeek = 1,
  endYear = 2026,
  endWeek = 45,
  selectedProvince = "Semua provinsi",
  selectedCategory = "Semua kategori",
  selectedDisease = "Semua penyakit",
  selectedKabkota = "Semua kabupaten/kota",
  selectedUnit = "Semua unit pelapor",
  onFilterChange,
}: SkdrFilterBarProps) {
  // Mobile accordion state (default open so user immediately sees the mobile-adapted filters)
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [justApplied, setJustApplied] = useState<boolean>(false);

  // Local draft states
  const [draftSumber, setDraftSumber] = useState<"all" | "ebs" | "pe">(sumber);
  const [draftCategory, setDraftCategory] = useState<string>(selectedCategory);
  const [draftDisease, setDraftDisease] = useState<string>(selectedDisease);
  const [draftProvince, setDraftProvince] = useState<string>(selectedProvince);
  const [draftKabkota, setDraftKabkota] = useState<string>(selectedKabkota);
  const [draftUnit, setDraftUnit] = useState<string>(selectedUnit);
  const [draftStartWeek, setDraftStartWeek] = useState<number>(startWeek);
  const [draftStartYear, setDraftStartYear] = useState<number>(startYear);
  const [draftEndWeek, setDraftEndWeek] = useState<number>(endWeek);
  const [draftEndYear, setDraftEndYear] = useState<number>(endYear);

  const categories = [
    "Semua kategori",
    "Zoonosis (Antraks, Rabies, Leptospirosis, Flu Burung)",
    "PD3I (Campak, Difteri, Pertusis, Polio)",
    "Vektor & Reservoir (DBD, Malaria)",
    "Bakteri & Saluran Cerna (Diare Akut, Kolera)",
    "Respiratori (ISPA, ILI, Pneumonia)",
    "Potensial KLB Lainnya",
  ];

  const kabkotaOptions = [
    "Semua kabupaten/kota",
    "Jakarta Pusat",
    "Jakarta Selatan",
    "Jakarta Timur",
    "Jakarta Barat",
    "Jakarta Utara",
    "Kota Bandung",
    "Kab. Bogor",
    "Kota Surabaya",
    "Kota Semarang",
    "Kota Medan",
    "Kota Makassar",
    "Kota Denpasar",
    "Kota Palembang",
    "Kota Samarinda",
  ];

  const unitOptions = [
    "Semua unit pelapor",
    "Puskesmas",
    "Rumah Sakit",
    "Klinik Pratama & Utama",
    "Laboratorium Kesmas",
    "Dinas Kesehatan Kab/Kota",
    "Dinas Kesehatan Provinsi",
  ];

  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
  const years = [2024, 2025, 2026];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      sumber: draftSumber,
      startYear: draftStartYear,
      startWeek: draftStartWeek,
      endYear: draftEndYear,
      endWeek: draftEndWeek,
      selectedProvince: draftProvince,
      selectedCategory: draftCategory,
      selectedDisease: draftDisease,
      selectedKabkota: draftKabkota,
      selectedUnit: draftUnit,
    });
    setJustApplied(true);
    setTimeout(() => {
      setJustApplied(false);
      // Auto-collapse on mobile after applying so user can view dashboard charts
      if (window.innerWidth < 640) {
        setIsExpanded(false);
      }
    }, 400);
  };

  const handleReset = () => {
    setDraftSumber("all");
    setDraftCategory("Semua kategori");
    setDraftDisease("Semua penyakit");
    setDraftProvince("Semua provinsi");
    setDraftKabkota("Semua kabupaten/kota");
    setDraftUnit("Semua unit pelapor");
    setDraftStartWeek(1);
    setDraftStartYear(2026);
    setDraftEndWeek(45);
    setDraftEndYear(2026);

    onFilterChange({
      sumber: "all",
      startYear: 2026,
      startWeek: 1,
      endYear: 2026,
      endWeek: 45,
      selectedProvince: "Semua provinsi",
      selectedCategory: "Semua kategori",
      selectedDisease: "Semua penyakit",
      selectedKabkota: "Semua kabupaten/kota",
      selectedUnit: "Semua unit pelapor",
    });
  };

  // Typography tokens matching official SKDR
  const lbl =
    "flex h-4 items-center gap-1.5 truncate text-[10.5px] font-extrabold uppercase leading-none tracking-wider text-slate-700 mb-1.5";
  const box =
    "relative h-10 w-full min-w-0 rounded-xl border border-slate-200/90 bg-white hover:border-teal-400 focus-within:border-[#007067] focus-within:ring-2 focus-within:ring-teal-600/20 transition shadow-2xs";
  const sel =
    "h-full w-full truncate appearance-none bg-transparent px-3 text-xs font-bold text-slate-800 outline-none cursor-pointer pr-8 disabled:cursor-not-allowed disabled:text-slate-400";
  const chev =
    "pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400";

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-4 mb-4 transition-all">
      {/* Mobile Header: Filter summary & Collapse / Expand Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-xl bg-teal-50 flex items-center justify-center text-[#007067] flex-shrink-0">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 truncate">
              Filter Parameter SKDR
            </h3>
            <p className="text-[10px] text-slate-500 truncate">
              {draftSumber === "all"
                ? "Semua Sumber"
                : draftSumber === "ebs"
                ? "Sinyal EBS"
                : "Kasus PE"}{" "}
              &bull; M{draftStartWeek}&ndash;M{draftEndWeek} {draftEndYear} &bull;{" "}
              {draftProvince}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all cursor-pointer flex-shrink-0 active:scale-[0.98]"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? "Tutup" : "Ubah"}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Expanded Mobile Filter Form */}
      {isExpanded ? (
        <form onSubmit={handleApply} className="pt-3.5 space-y-3.5 animate-in fade-in duration-150">
          {/* Responsive Mobile Layout: 1 column on mobile, 2 columns on tablet/desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {/* 1. SUMBER DATA (Full width on mobile) */}
            <div className="flex flex-col sm:col-span-2">
              <span className={lbl}>
                <Radio className="h-3.5 w-3.5 text-teal-700" />
                <span>SUMBER DATA</span>
              </span>
              <div
                role="radiogroup"
                aria-label="SUMBER DATA"
                className="grid grid-cols-3 w-full h-10 items-center rounded-xl border border-slate-200/90 bg-white p-0.5 text-xs font-bold shadow-2xs"
              >
                {/* Semua */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={draftSumber === "all"}
                  onClick={() => setDraftSumber("all")}
                  className={`inline-flex items-center justify-center gap-1.5 h-full rounded-lg transition cursor-pointer text-xs ${
                    draftSumber === "all"
                      ? "bg-[#007067] text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Semua
                </button>

                {/* EBS */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={draftSumber === "ebs"}
                  onClick={() => setDraftSumber("ebs")}
                  className={`inline-flex items-center justify-center gap-1.5 h-full rounded-lg transition cursor-pointer text-xs ${
                    draftSumber === "ebs"
                      ? "bg-[#007067] text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full flex-shrink-0 ${
                      draftSumber === "ebs" ? "bg-white" : "bg-[#f97316]"
                    }`}
                  />
                  <span>EBS</span>
                </button>

                {/* Kasus PE */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={draftSumber === "pe"}
                  onClick={() => setDraftSumber("pe")}
                  className={`inline-flex items-center justify-center gap-1.5 h-full rounded-lg transition cursor-pointer text-xs ${
                    draftSumber === "pe"
                      ? "bg-[#007067] text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rotate-45 flex-shrink-0 ${
                      draftSumber === "pe" ? "bg-white" : "bg-[#007067]"
                    }`}
                  />
                  <span>Kasus PE</span>
                </button>
              </div>
            </div>

            {/* 2. KATEGORI PENYAKIT */}
            <div className="flex flex-col">
              <label htmlFor="filter-kategori-mobile" className={lbl}>
                <Layers className="h-3.5 w-3.5 text-teal-700" />
                <span>KATEGORI PENYAKIT</span>
              </label>
              <div className={box}>
                <select
                  id="filter-kategori-mobile"
                  className={sel}
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className={chev} />
              </div>
            </div>

            {/* 3. PENYAKIT */}
            <div className="flex flex-col">
              <label htmlFor="filter-penyakit-mobile" className={lbl}>
                <Bug className="h-3.5 w-3.5 text-teal-700" />
                <span>PENYAKIT</span>
              </label>
              <div className={box}>
                <select
                  id="filter-penyakit-mobile"
                  className={sel}
                  value={draftDisease}
                  onChange={(e) => setDraftDisease(e.target.value)}
                >
                  <option value="Semua penyakit">Semua penyakit</option>
                  {SKDR_DISEASE_ALERTS.map((d) => (
                    <option key={d.code} value={d.disease}>
                      {d.disease}
                    </option>
                  ))}
                </select>
                <ChevronDown className={chev} />
              </div>
            </div>

            {/* 4. PROVINSI */}
            <div className="flex flex-col">
              <label htmlFor="filter-provinsi-mobile" className={lbl}>
                <Map className="h-3.5 w-3.5 text-teal-700" />
                <span>PROVINSI</span>
              </label>
              <div className={box}>
                <select
                  id="filter-provinsi-mobile"
                  className={sel}
                  value={draftProvince}
                  onChange={(e) => setDraftProvince(e.target.value)}
                >
                  <option value="Semua provinsi">Semua provinsi</option>
                  {SKDR_PROVINCE_ALERTS.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className={chev} />
              </div>
            </div>

            {/* 5. KABUPATEN/KOTA */}
            <div className="flex flex-col">
              <label htmlFor="filter-kabkota-mobile" className={lbl}>
                <MapPin className="h-3.5 w-3.5 text-teal-700" />
                <span>KABUPATEN/KOTA</span>
              </label>
              <div className={box}>
                <select
                  id="filter-kabkota-mobile"
                  className={sel}
                  value={draftKabkota}
                  onChange={(e) => setDraftKabkota(e.target.value)}
                >
                  {kabkotaOptions.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <ChevronDown className={chev} />
              </div>
            </div>

            {/* 6. UNIT PELAPOR */}
            <div className="flex flex-col sm:col-span-2">
              <label htmlFor="filter-unit-mobile" className={lbl}>
                <Building2 className="h-3.5 w-3.5 text-teal-700" />
                <span>UNIT PELAPOR</span>
              </label>
              <div className={box}>
                <select
                  id="filter-unit-mobile"
                  className={sel}
                  value={draftUnit}
                  onChange={(e) => setDraftUnit(e.target.value)}
                >
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <ChevronDown className={chev} />
              </div>
            </div>

            {/* 7. PERIODE (MINGGU EPI) - Clean 2x2 range container for mobile */}
            <div className="flex flex-col sm:col-span-2">
              <span className={lbl}>
                <Calendar className="h-3.5 w-3.5 text-teal-700" />
                <span>PERIODE (MINGGU EPI)</span>
              </span>
              <div className="relative h-11 w-full rounded-xl border border-slate-200/90 bg-white shadow-2xs flex items-center px-2 sm:px-3 gap-1">
                {/* Start Week */}
                <div className="relative flex-1">
                  <select
                    aria-label="Minggu awal"
                    value={draftStartWeek}
                    onChange={(e) => setDraftStartWeek(Number(e.target.value))}
                    className="w-full h-8 appearance-none bg-transparent pl-1 pr-4 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    {weeks.map((w) => (
                      <option key={w} value={w}>
                        M{w}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                </div>

                {/* Start Year */}
                <div className="relative flex-1">
                  <select
                    aria-label="Tahun awal"
                    value={draftStartYear}
                    onChange={(e) => setDraftStartYear(Number(e.target.value))}
                    className="w-full h-8 appearance-none bg-transparent pl-1 pr-4 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                </div>

                {/* Separator Dash */}
                <span className="px-1 text-xs font-black text-slate-400 flex-shrink-0">–</span>

                {/* End Week */}
                <div className="relative flex-1">
                  <select
                    aria-label="Minggu akhir"
                    value={draftEndWeek}
                    onChange={(e) => setDraftEndWeek(Number(e.target.value))}
                    className="w-full h-8 appearance-none bg-transparent pl-1 pr-4 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    {weeks.map((w) => (
                      <option key={w} value={w}>
                        M{w}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                </div>

                {/* End Year */}
                <div className="relative flex-1">
                  <select
                    aria-label="Tahun akhir"
                    value={draftEndYear}
                    onChange={(e) => setDraftEndYear(Number(e.target.value))}
                    className="w-full h-8 appearance-none bg-transparent pl-1 pr-4 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: TERAPKAN & Reset (Full Width Mobile Touch Targets) */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Kembalikan ke bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              id="btn-apply-filter"
              className="flex-1 h-11 px-5 rounded-xl bg-[#007067] hover:bg-[#005e57] active:bg-[#004e47] text-white font-black text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-[0.99]"
            >
              {justApplied ? (
                <>
                  <Check className="w-4 h-4 text-white animate-bounce" />
                  <span>DITERAPKAN</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>TERAPKAN</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Collapsed Quick Chips Bar (Saves screen real estate on mobile) */
        <div className="flex items-center pt-2.5 gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#007067] font-bold text-[11px] flex-shrink-0">
            <Radio className="w-3 h-3 text-[#007067]" />
            <span>
              {draftSumber === "all"
                ? "Semua Sumber"
                : draftSumber === "ebs"
                ? "EBS"
                : "Kasus PE"}
            </span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px] flex-shrink-0">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>
              M{draftStartWeek}&ndash;M{draftEndWeek} {draftEndYear}
            </span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium text-[11px] flex-shrink-0 truncate max-w-[160px]">
            <Map className="w-3 h-3 text-slate-500" />
            <span className="truncate">{draftProvince}</span>
          </span>
        </div>
      )}
    </div>
  );
}
