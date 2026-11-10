"use client";

import React from "react";
import { ArrowLeft, Wrench } from "lucide-react";

interface UnderDevelopmentSectionProps {
  title: string;
  description: string;
  onBackToRingkasan: () => void;
  buttonLabel?: string;
}

export default function UnderDevelopmentSection({
  title,
  description,
  onBackToRingkasan,
  buttonLabel = "Kembali ke Ringkasan",
}: UnderDevelopmentSectionProps) {
  return (
    <section className="w-full space-y-4">
      {/* Section Header matching Ringkasan styling */}
      <header className="mb-3 border-b border-[#dde4e3] pb-2">
        <h2 className="text-2xl font-bold leading-8 tracking-[-0.01em] text-[#064540]">
          {title}
        </h2>
      </header>

      {/* Empty / Under Development Card */}
      <div className="rounded-[12px] border border-[#e4eae9] bg-white px-5 py-10 sm:py-14 text-center shadow-2xs flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-[#ecfaf8] border border-[#cff3ee] flex items-center justify-center text-[#007067]">
          <Wrench className="w-6 h-6" />
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-amber-700">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Sedang Dalam Perkembangan</span>
        </span>

        <h3 className="mt-3 text-base sm:text-lg font-extrabold text-slate-900">
          Tab {title} Sedang Dalam Perkembangan
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
          {description}
        </p>

        <button
          type="button"
          onClick={onBackToRingkasan}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#007067] hover:bg-[#005e57] active:bg-[#004e47] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{buttonLabel}</span>
        </button>
      </div>
    </section>
  );
}

