"use client";

import React from "react";
import { Clock, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { SKDR_T717_DATA } from "@/data/skdrData";

export default function T717() {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 mb-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-teal-700" />
            <span>Indikator Kecepatan Respons 7-1-7</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Standar global kesiapsiagaan KLB Kementerian Kesehatan RI
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Skor Nasional</span>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            94.6 / 100
          </span>
        </div>
      </div>

      {/* 3 Pillars of 7-1-7 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {SKDR_T717_DATA.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">{item.target}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {item.complianceRate}%
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-[#007067]">
                {item.actualAvg}
              </span>
              <span className="text-[10px] text-slate-500">rata-rata</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${item.complianceRate}%` }}
                className="bg-teal-600 h-full rounded-full"
              />
            </div>

            <p className="text-[10px] text-slate-500 leading-tight pt-0.5">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

