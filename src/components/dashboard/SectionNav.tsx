"use client";

import React, { useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  Clock,
  Microscope,
  MapPin,
  TrendingUp,
  Layers,
  Database,
} from "lucide-react";

export type DashboardSectionTab =
  | "ringkasan"
  | "cfr"
  | "alert"
  | "t717"
  | "laboratorium"
  | "sebaran_wilayah"
  | "tren"
  | "klaster_epi_curve"
  | "nar_skdr";

interface SectionNavProps {
  activeTab: DashboardSectionTab;
  onTabChange: (tab: DashboardSectionTab) => void;
}

export default function SectionNav({ activeTab, onTabChange }: SectionNavProps) {
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const el = btnRefs.current[activeTab];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeTab]);

  const tabs = [
    {
      id: "ringkasan" as const,
      label: "Ringkasan",
      icon: (active: boolean) => (
        <LayoutDashboard className={`w-3.5 h-3.5 ${active ? "text-white" : "text-[#007067]"}`} />
      ),
    },
    {
      id: "cfr" as const,
      label: "CFR",
      icon: (active: boolean) => (
        <Activity className={`w-3.5 h-3.5 ${active ? "text-white" : "text-rose-500"}`} />
      ),
    },
    {
      id: "alert" as const,
      label: "Alert",
      icon: (active: boolean) => (
        <AlertTriangle className={`w-3.5 h-3.5 ${active ? "text-white" : "text-[#e8710a]"}`} />
      ),
    },
    {
      id: "t717" as const,
      label: "7-1-7",
      icon: (active: boolean) => (
        <Clock className={`w-3.5 h-3.5 ${active ? "text-white" : "text-emerald-600"}`} />
      ),
    },
    {
      id: "laboratorium" as const,
      label: "Laboratorium",
      icon: (active: boolean) => (
        <Microscope className={`w-3.5 h-3.5 ${active ? "text-white" : "text-indigo-600"}`} />
      ),
    },
    {
      id: "sebaran_wilayah" as const,
      label: "Sebaran Wilayah",
      icon: (active: boolean) => (
        <MapPin className={`w-3.5 h-3.5 ${active ? "text-white" : "text-teal-600"}`} />
      ),
    },
    {
      id: "tren" as const,
      label: "Tren",
      icon: (active: boolean) => (
        <TrendingUp className={`w-3.5 h-3.5 ${active ? "text-white" : "text-blue-600"}`} />
      ),
    },
    {
      id: "klaster_epi_curve" as const,
      label: "Klaster & EPI Curve",
      icon: (active: boolean) => (
        <Layers className={`w-3.5 h-3.5 ${active ? "text-white" : "text-amber-600"}`} />
      ),
    },
    {
      id: "nar_skdr" as const,
      label: "NAR-SKDR",
      icon: (active: boolean) => (
        <Database className={`w-3.5 h-3.5 ${active ? "text-white" : "text-purple-600"}`} />
      ),
    },
  ];

  return (
    <div className="sticky top-14 z-20 bg-slate-100/95 backdrop-blur-md py-2 -mx-4 px-4 sm:mx-0 sm:px-0 mb-3">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                btnRefs.current[tab.id] = el;
              }}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                isActive
                  ? "bg-[#007067] text-white shadow-sm ring-1 ring-[#007067]"
                  : "bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.icon(isActive)}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
