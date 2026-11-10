"use client";

import React from "react";
import { Flame, TrendingUp, AlertTriangle, ChevronRight, Activity } from "lucide-react";
import { SKDR_DISEASE_ALERTS } from "@/data/skdrData";

export default function DiseaseCarousel() {
  // Take top 8 priority outbreak diseases
  const priorityDiseases = SKDR_DISEASE_ALERTS.slice(0, 8);

  return (
    <div className="space-y-2.5 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Penyakit Prioritas Potensial KLB</span>
          </h3>
          <p className="text-[10px] text-slate-500">
            Geser horizontal untuk melihat indikator sinyal EBS &amp; kasus PE
          </p>
        </div>
        <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
          Geser &harr;
        </span>
      </div>

      {/* Horizontal Carousel (Hidden scrollbar + smooth sliding) */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {priorityDiseases.map((item) => (
          <div
            key={item.code}
            className="w-[185px] sm:w-[200px] flex-shrink-0 snap-start p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-500 hover:shadow-sm transition-all space-y-2"
          >
            <div className="flex items-start justify-between gap-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide truncate max-w-[120px]">
                {item.category}
              </span>
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  item.alertLevel === "merah"
                    ? "bg-red-500 shadow-xs shadow-red-500/50"
                    : "bg-amber-500"
                }`}
              />
            </div>

            <div>
              <h4 className="text-xs font-black text-slate-900 truncate" title={item.disease}>
                {item.disease}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {item.alerts.toLocaleString()} sinyal EBS
              </p>
            </div>

            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <div>
                <span className="text-slate-400 block">Kasus PE:</span>
                <span className="font-extrabold text-[#007067]">
                  {item.cases.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Status KLB:</span>
                <span className="font-extrabold text-red-600">
                  {item.klb > 0 ? `${item.klb} KLB` : "Nihil"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

