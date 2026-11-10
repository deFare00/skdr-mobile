import React from "react";
import { AlertTriangle, Users, HeartCrack, Flame, CheckCircle2, TrendingUp, ShieldAlert } from "lucide-react";

interface ExecutiveSummaryProps {
  totalAlerts: number;
  totalCases: number;
  totalDeaths: number;
  totalKlb: number;
  totalRespon24: number;
}

export default function ExecutiveSummary({
  totalAlerts = 135938,
  totalCases = 1461866,
  totalDeaths = 182,
  totalKlb = 187,
  totalRespon24 = 125630,
}: Partial<ExecutiveSummaryProps>) {
  const responPct = ((totalRespon24 / totalAlerts) * 100).toFixed(1);

  return (
    <div className="space-y-3 mb-5">
      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Card 1: SINYAL EBS (formerly Total Alerts) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              SINYAL EBS
            </span>
            <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {totalAlerts.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-red-600">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>Alert EBS Terdeteksi</span>
          </div>
        </div>

        {/* Card 2: KASUS PE (formerly Total Kasus) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              KASUS PE
            </span>
            <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center text-[#007067]">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-[#007067] tracking-tight">
              {totalCases.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-teal-700">
            <span>24 Penyakit Terpantau</span>
          </div>
        </div>

        {/* Card 3: KEMATIAN PE (formerly Kematian) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              KEMATIAN PE
            </span>
            <div className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <HeartCrack className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
              {totalDeaths.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">jiwa</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-slate-500">
            <span>CFR: 0.01% · Terlaporkan</span>
          </div>
        </div>

        {/* Card 4: PERINGATAN KLB (formerly Status KLB) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              PERINGATAN KLB
            </span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">
              {totalKlb}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">kejadian</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-amber-700">
            <span>Terverifikasi Lapangan</span>
          </div>
        </div>
      </div>

      {/* Speed & Quality Banner: Respon 24 Jam & Indikator 7-1-7 */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#005e57] to-[#0d4e49] text-white shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#79e27c]" />
            <h4 className="text-xs font-bold tracking-wide uppercase text-white">
              Respons Cepat &le; 24 Jam
            </h4>
          </div>
          <span className="text-xs font-extrabold text-[#79e27c]">
            {responPct}% Tercapai
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-black/25 h-2 rounded-full overflow-hidden p-0.5 mb-2">
          <div
            className="h-full bg-gradient-to-r from-[#79e27c] to-[#22c55e] rounded-full transition-all duration-500"
            style={{ width: `${responPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-white/80">
          <span>
            <strong>{totalRespon24.toLocaleString()}</strong> dari {totalAlerts.toLocaleString()} sinyal EBS direspons
          </span>
          <span className="text-[10px] text-white/60">Target Kemenkes: 90%</span>
        </div>
      </div>
    </div>
  );
}

