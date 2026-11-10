"use client";

import React, { useState } from "react";
import { MapPin, ShieldAlert, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { SKDR_PROVINCE_ALERTS } from "@/data/skdrData";

export default function SpatialMapSection() {
  const [selectedProvinceId, setSelectedProvinceId] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const activeProvince =
    SKDR_PROVINCE_ALERTS.find((p) => p.id === selectedProvinceId) ||
    SKDR_PROVINCE_ALERTS[0];

  const totalPages = Math.ceil(SKDR_PROVINCE_ALERTS.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProvinces = SKDR_PROVINCE_ALERTS.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#007067]" />
            <span>Peta Spasial Sebaran Sinyal EBS &amp; Kasus PE</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Sebaran risiko sinyal epidemiologi EBS dan kasus PE 38 provinsi di Indonesia
          </p>
        </div>
        <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          38 Provinsi
        </span>
      </div>

      {/* Spatial Visual Map Representation (Indonesia Archipelago) */}
      <div className="relative w-full h-48 sm:h-56 rounded-2xl bg-gradient-to-br from-[#003833] via-[#004e47] to-[#042825] p-4 text-white overflow-hidden flex flex-col justify-between shadow-inner">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#79e27c_1px,transparent_1px)] [background-size:14px_14px]" />

        {/* Top Floating Badge */}
        <div className="relative z-10 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs text-[11px] font-semibold text-white">
            <Layers className="w-3.5 h-3.5 text-[#79e27c]" />
            <span>Layer: Sinyal EBS &amp; Kasus PE</span>
          </span>
          <span className="text-[10px] text-[#79e27c] font-bold">
            Peta Aktif W1 &ndash; W45
          </span>
        </div>

        {/* Stylized Island Region Interactive Hotspots */}
        <div className="relative z-10 my-auto py-2">
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Sumatera */}
            <button
              type="button"
              onClick={() => setSelectedProvinceId(4)}
              className="group p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center cursor-pointer"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 mx-auto mb-1 animate-pulse" />
              <span className="text-[10px] font-bold block text-white/90">Sumatera</span>
              <span className="text-[9px] text-[#79e27c]">17.8k sinyal EBS</span>
            </button>

            {/* Jawa & DKI */}
            <button
              type="button"
              onClick={() => setSelectedProvinceId(1)}
              className="group p-2 rounded-xl bg-teal-600/40 hover:bg-teal-600/60 border border-[#79e27c]/40 transition-all text-center ring-2 ring-[#79e27c]/40 cursor-pointer"
            >
              <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-1 animate-ping" />
              <span className="text-[10px] font-black block text-white">Jawa &amp; DKI</span>
              <span className="text-[9px] text-[#79e27c] font-bold">82.5k sinyal EBS</span>
            </button>

            {/* Kalimantan */}
            <button
              type="button"
              onClick={() => setSelectedProvinceId(11)}
              className="group p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center cursor-pointer"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold block text-white/90">Kalimantan</span>
              <span className="text-[9px] text-white/70">8.9k sinyal EBS</span>
            </button>

            {/* Sulawesi */}
            <button
              type="button"
              onClick={() => setSelectedProvinceId(7)}
              className="group p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center cursor-pointer"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold block text-white/90">Sulawesi</span>
              <span className="text-[9px] text-white/70">10.4k sinyal EBS</span>
            </button>

            {/* Bali & Nusra */}
            <button
              type="button"
              onClick={() => setSelectedProvinceId(12)}
              className="group p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center cursor-pointer"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold block text-white/90">Bali &amp; Nusra</span>
              <span className="text-[9px] text-white/70">5.8k sinyal EBS</span>
            </button>

            {/* Papua */}
            <button
              type="button"
              onClick={() => setSelectedProvinceId(10)}
              className="group p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center cursor-pointer"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 mx-auto mb-1" />
              <span className="text-[10px] font-bold block text-white/90">Papua</span>
              <span className="text-[9px] text-[#79e27c]">6.2k sinyal EBS</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="relative z-10 flex items-center justify-between text-[10px] text-white/75 bg-black/40 -mx-4 -mb-4 px-4 py-2 rounded-b-2xl backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Risiko Tinggi
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Sedang
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Rendah
            </span>
          </div>
        </div>
      </div>

      {/* Selected Province Details Card */}
      {activeProvince && (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                {activeProvince.name}
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  activeProvince.riskLevel === "Tinggi"
                    ? "bg-red-100 text-red-700"
                    : activeProvince.riskLevel === "Sedang"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                Risiko {activeProvince.riskLevel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              <strong>{activeProvince.alerts.toLocaleString()}</strong> sinyal EBS &bull;{" "}
              {activeProvince.cases.toLocaleString()} kasus PE &bull; Kepatuhan {activeProvince.compliance}%
            </p>
          </div>
        </div>
      )}

      {/* Paginated Provinces Table */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Daftar Provinsi &amp; Sinyal EBS
          </h4>
          <span className="text-[11px] text-slate-400">
            Hal {currentPage} dari {totalPages}
          </span>
        </div>

        <div className="space-y-1.5">
          {currentProvinces.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => setSelectedProvinceId(p.id)}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                selectedProvinceId === p.id
                  ? "bg-teal-50/80 border-teal-300 font-semibold text-teal-900"
                  : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-500">
                  {startIndex + idx + 1}
                </span>
                <span>{p.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{p.alerts.toLocaleString()} sinyal EBS</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    p.riskLevel === "Tinggi" ? "bg-red-500" : "bg-amber-400"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
          <span>
            {startIndex + 1}&ndash;
            {Math.min(startIndex + itemsPerPage, SKDR_PROVINCE_ALERTS.length)} dari{" "}
            {SKDR_PROVINCE_ALERTS.length} provinsi
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-bold text-slate-700">{currentPage}</span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
