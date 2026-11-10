"use client";

import React, { useState } from "react";
import { Radio, AlertTriangle, ChevronLeft, ChevronRight, MapPin, Calendar, Clock } from "lucide-react";
import { SKDR_EBS_SIGNALS } from "@/data/skdrData";

export default function EbsPanels() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(SKDR_EBS_SIGNALS.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = SKDR_EBS_SIGNALS.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 mb-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>Sinyal Surveilans Berbasis Kejadian (EBS)</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Deteksi dini rumor, media monitoring, dan laporan masyarakat
          </p>
        </div>
        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
          Real-Time
        </span>
      </div>

      {/* Signal Items List */}
      <div className="space-y-2.5">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-400 transition-all space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {item.id} &bull; Sumber: {item.source}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  item.urgency === "Tinggi"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                Urgensi {item.urgency}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              {item.title}
            </h4>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{item.location}</span>
              </span>
              <span>&bull;</span>
              <span className="font-semibold text-teal-800">{item.disease}</span>
              <span>&bull;</span>
              <span className="text-slate-400">{item.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px]">
          Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> ({SKDR_EBS_SIGNALS.length} sinyal EBS)
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

