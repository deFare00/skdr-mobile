"use client";

import React from "react";
import { Grid, Info } from "lucide-react";
import { SKDR_HEATMAP_DATA } from "@/data/skdrData";

export default function TrendHeatmap() {
  const weeks = [38, 39, 40, 41, 42, 43, 44, 45];

  // Helper to color cells based on value
  const getCellColor = (val: number) => {
    if (val >= 50) return "bg-red-500 text-white font-bold";
    if (val >= 25) return "bg-amber-400 text-slate-900 font-semibold";
    if (val >= 10) return "bg-yellow-300 text-slate-900";
    if (val >= 4) return "bg-teal-200 text-teal-900";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 mb-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Grid className="w-4 h-4 text-[#007067]" />
            <span>Matriks Heatmap Tren Mingguan (W38 &ndash; W45)</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Intensitas lonjakan kasus PE per penyakit (skala ribuan kasus)
          </p>
        </div>
        <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-bold">
          8 Minggu
        </span>
      </div>

      {/* Heatmap Grid (Scrollable horizontally without bulky scrollbars) */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-xs text-left min-w-[480px]">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase">
              <th className="py-2 px-2 font-bold">Penyakit</th>
              {weeks.map((w) => (
                <th key={w} className="py-2 px-1.5 text-center font-bold">
                  W{w}
                </th>
              ))}
              <th className="py-2 px-2 text-right font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {SKDR_HEATMAP_DATA.map((row) => (
              <tr key={row.disease} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2 px-2 font-bold text-slate-800 text-[11px] truncate max-w-[120px]">
                  {row.disease}
                </td>
                {row.values.map((v, i) => (
                  <td key={i} className="py-1 px-1 text-center">
                    <div
                      className={`w-full py-1 rounded text-[10px] ${getCellColor(
                        v
                      )}`}
                    >
                      {v}k
                    </div>
                  </td>
                ))}
                <td className="py-2 px-2 text-right">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                      row.trend === "Tinggi"
                        ? "bg-red-100 text-red-700"
                        : row.trend === "Meningkat"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {row.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-2">
          <span>Intensitas:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-100 border" /> &lt;4k
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-teal-200" /> &ge;4k
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-400" /> &ge;25k
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-red-500" /> &ge;50k
          </span>
        </div>
        <span>Data Waspada KLB</span>
      </div>
    </div>
  );
}

