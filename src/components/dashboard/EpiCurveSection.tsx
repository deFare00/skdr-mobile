"use client";

import React, { useState } from "react";
import { TrendingUp, BarChart3, Info } from "lucide-react";
import { SKDR_EPICURVE_DATA } from "@/data/skdrData";

export default function EpiCurveSection() {
  const [selectedDiseaseKey, setSelectedDiseaseKey] = useState<"total" | "ispa" | "diare" | "dbd" | "malaria">("total");
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(44);

  const maxVal = Math.max(...SKDR_EPICURVE_DATA.map((d) => d[selectedDiseaseKey]));
  const activeData = SKDR_EPICURVE_DATA.find((d) => d.week === hoveredWeek) || SKDR_EPICURVE_DATA[SKDR_EPICURVE_DATA.length - 1];

  const diseaseLabels = {
    total: "Total Semua Penyakit",
    ispa: "ISPA",
    diare: "Diare Akut",
    dbd: "Demam Berdarah (DBD)",
    malaria: "Malaria",
  };

  const diseaseColors = {
    total: "from-[#007067] to-[#00a39e]",
    ispa: "from-blue-600 to-sky-400",
    diare: "from-amber-600 to-amber-400",
    dbd: "from-rose-600 to-red-400",
    malaria: "from-purple-600 to-indigo-400",
  };

  return (
    <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#007067]" />
            <span>Kurva Epidemiologi (EpiCurve)</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Tren fluktuasi kasus PE mingguan (W36 &ndash; W45 2026)
          </p>
        </div>
      </div>

      {/* Disease Pill Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {(["total", "ispa", "diare", "dbd", "malaria"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedDiseaseKey(key)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex-shrink-0 ${
              selectedDiseaseKey === key
                ? "bg-[#007067] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200/70 text-slate-600"
            }`}
          >
            {diseaseLabels[key]}
          </button>
        ))}
      </div>

      {/* Active Week Tooltip Card */}
      {activeData && (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-800">
              Minggu Epidemiologi ke-{activeData.week} (Tahun 2026)
            </span>
            <p className="text-[11px] text-slate-500">
              {diseaseLabels[selectedDiseaseKey]}:{" "}
              <strong className="text-[#007067]">
                {activeData[selectedDiseaseKey].toLocaleString()} kasus PE
              </strong>
            </p>
          </div>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border text-slate-500 font-semibold">
            Sentuh batang grafik
          </span>
        </div>
      )}

      {/* SVG Bar Chart Visualization */}
      <div className="pt-4 pb-2">
        <div className="h-44 w-full flex items-end justify-between gap-1.5 sm:gap-2 px-1">
          {SKDR_EPICURVE_DATA.map((item) => {
            const heightPct = Math.max(12, Math.round((item[selectedDiseaseKey] / maxVal) * 100));
            const isHovered = hoveredWeek === item.week;

            return (
              <div
                key={item.week}
                onClick={() => setHoveredWeek(item.week)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Bar Value Tooltip on top */}
                <span
                  className={`text-[9px] font-bold mb-1 transition-opacity ${
                    isHovered ? "opacity-100 text-slate-900" : "opacity-0 group-hover:opacity-100 text-slate-400"
                  }`}
                >
                  {(item[selectedDiseaseKey] / 1000).toFixed(0)}k
                </span>

                {/* The Bar */}
                <div className="w-full max-w-[28px] h-full flex items-end">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-lg bg-gradient-to-t ${diseaseColors[selectedDiseaseKey]} transition-all duration-300 ${
                      isHovered ? "ring-2 ring-teal-500 ring-offset-1 scale-105" : "opacity-85 hover:opacity-100"
                    }`}
                  />
                </div>

                {/* Week Label */}
                <span
                  className={`text-[10px] mt-2 font-bold ${
                    isHovered ? "text-[#007067]" : "text-slate-400"
                  }`}
                >
                  W{item.week}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Puncak Kasus: <strong>Minggu 37</strong> (122.211 kasus)</span>
        <span className="text-teal-700 font-semibold">Data Terverifikasi Kemenkes</span>
      </div>
    </div>
  );
}

