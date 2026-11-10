"use client";

import React, { useState } from "react";
import {
  Search,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  X,
  Users,
  HeartCrack,
  Clock,
  CheckCircle2
} from "lucide-react";
import { DiseaseAlertItem, SKDR_DISEASE_ALERTS } from "@/data/skdrData";

interface AlertSkdrSectionsProps {
  selectedCategory: string;
}

export default function AlertSkdrSections({ selectedCategory }: AlertSkdrSectionsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAlertFilter, setActiveAlertFilter] = useState<"all" | "merah" | "kuning" | "hijau">("all");
  const [selectedDisease, setSelectedDisease] = useState<DiseaseAlertItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter items
  const filteredDiseases = SKDR_DISEASE_ALERTS.filter((item) => {
    const matchesSearch =
      item.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Semua Kategori" || item.category === selectedCategory;

    const matchesAlertLevel =
      activeAlertFilter === "all" || item.alertLevel === activeAlertFilter;

    return matchesSearch && matchesCategory && matchesAlertLevel;
  });

  const totalPages = Math.ceil(filteredDiseases.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredDiseases.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (filter: "all" | "merah" | "kuning" | "hijau") => {
    setActiveAlertFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-3 mb-4">
      {/* Header & Section Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Peringatan Dini SKDR (Sinyal EBS &amp; Kasus PE)</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Daftar 24 penyakit berpotensi KLB terpantau
          </p>
        </div>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {filteredDiseases.length} Penyakit
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari penyakit (contoh: DBD, Campak, Diare)..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
            }}
            className="absolute right-2.5 top-2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Alert Level Pill Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => handleFilterChange("all")}
          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex-shrink-0 ${
            activeAlertFilter === "all"
              ? "bg-slate-800 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Semua ({SKDR_DISEASE_ALERTS.length})
        </button>
        <button
          type="button"
          onClick={() => handleFilterChange("merah")}
          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
            activeAlertFilter === "merah"
              ? "bg-red-600 text-white shadow-xs"
              : "bg-white border border-red-200 text-red-700 hover:bg-red-50"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>Sinyal Merah / KLB (7)</span>
        </button>
        <button
          type="button"
          onClick={() => handleFilterChange("kuning")}
          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
            activeAlertFilter === "kuning"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white border border-amber-200 text-amber-800 hover:bg-amber-50"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Waspada (11)</span>
        </button>
        <button
          type="button"
          onClick={() => handleFilterChange("hijau")}
          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
            activeAlertFilter === "hijau"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Terkendali (6)</span>
        </button>
      </div>

      {/* Disease Card List (Paginated) */}
      <div className="space-y-2">
        {currentItems.map((item) => {
          const responRate = ((item.respon24 / item.alerts) * 100).toFixed(0);

          return (
            <div
              key={item.code}
              onClick={() => setSelectedDisease(item)}
              className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-500 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                {/* Status Dot */}
                <div
                  className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                    item.alertLevel === "merah"
                      ? "bg-red-500 shadow-xs shadow-red-500/50"
                      : item.alertLevel === "kuning"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.disease}
                    </h4>
                    {item.klb > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-700 flex-shrink-0">
                        {item.klb} KLB
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">
                      <strong>{item.alerts.toLocaleString()}</strong> sinyal EBS
                    </span>
                    <span>&bull;</span>
                    <span className="text-[#007067] font-semibold">
                      {item.cases.toLocaleString()} kasus PE
                    </span>
                    {item.deaths > 0 && (
                      <>
                        <span>&bull;</span>
                        <span className="text-rose-600 font-semibold">
                          {item.deaths} kematian PE
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right KPI & Arrow */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-400 block">Respon &le; 24j</span>
                  <span className="text-xs font-bold text-teal-700">{responRate}%</span>
                </div>
                <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}

        {filteredDiseases.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <p className="text-xs">Tidak ada penyakit yang sesuai kriteria pencarian.</p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {filteredDiseases.length > itemsPerPage && (
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
          <span className="text-[11px]">
            {startIndex + 1}&ndash;
            {Math.min(startIndex + itemsPerPage, filteredDiseases.length)} dari{" "}
            {filteredDiseases.length} penyakit
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-bold text-slate-700 text-xs">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Disease Detail Bottom Sheet Modal */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-200">
            {/* Header Modal */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                  {selectedDisease.category}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {selectedDisease.disease}
                </h3>
                <p className="text-xs text-slate-500">Kode: {selectedDisease.code}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDisease(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Sinyal EBS Terdeteksi
                </span>
                <p className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedDisease.alerts.toLocaleString()}
                </p>
                <span className="text-[10px] text-red-600 font-semibold">
                  Tingkat: {selectedDisease.alertLevel.toUpperCase()}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100">
                <span className="text-[10px] font-bold text-teal-800 uppercase">
                  Kasus PE Dilaporkan
                </span>
                <p className="text-lg font-black text-[#007067] mt-0.5">
                  {selectedDisease.cases.toLocaleString()}
                </p>
                <span className="text-[10px] text-teal-700">
                  {selectedDisease.trend === "naik" ? "↑ Tren Meningkat" : "↔ Tren Stabil"}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100">
                <span className="text-[10px] font-bold text-rose-800 uppercase">
                  Kematian PE
                </span>
                <p className="text-lg font-black text-rose-600 mt-0.5">
                  {selectedDisease.deaths.toLocaleString()}
                </p>
                <span className="text-[10px] text-rose-700">
                  CFR: {((selectedDisease.deaths / (selectedDisease.cases || 1)) * 100).toFixed(2)}%
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
                <span className="text-[10px] font-bold text-amber-800 uppercase">
                  Peringatan KLB
                </span>
                <p className="text-lg font-black text-amber-700 mt-0.5">
                  {selectedDisease.klb} KLB
                </p>
                <span className="text-[10px] text-amber-800 font-semibold">
                  Status: Terverifikasi
                </span>
              </div>
            </div>

            {/* Respon Cepat 24 Jam Info */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Respon Dalam &le; 24 Jam:</span>
                <span className="font-black text-teal-800">
                  {selectedDisease.respon24.toLocaleString()} / {selectedDisease.alerts.toLocaleString()} sinyal EBS (
                  {((selectedDisease.respon24 / selectedDisease.alerts) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Verifikasi Lapangan:</span>
                <span className="font-bold text-slate-800">
                  {selectedDisease.verified.toLocaleString()} kasus PE
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDisease(null)}
              className="w-full py-2.5 bg-[#007067] hover:bg-[#005e57] text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
