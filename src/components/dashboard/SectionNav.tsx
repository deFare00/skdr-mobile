"use client";

import React from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Radio
} from "lucide-react";

export type DashboardSectionTab =
  | "ringkasan"
  | "tabel_alerts"
  | "kurva_tren"
  | "peta_spasial"
  | "klaster_ebs";

interface SectionNavProps {
  activeTab: DashboardSectionTab;
  onTabChange: (tab: DashboardSectionTab) => void;
}

export default function SectionNav({ activeTab, onTabChange }: SectionNavProps) {
  const tabs = [
    {
      id: "ringkasan" as const,
      num: 1,
      label: "1. Ringkasan & 7-1-7",
      shortLabel: "Ringkasan",
      icon: <LayoutDashboard className="w-3.5 h-3.5 text-[#007067]" />,
    },
    {
      id: "tabel_alerts" as const,
      num: 2,
      label: "2. Sinyal EBS & Tabel",
      shortLabel: "Sinyal EBS",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-red-500" />,
    },
    {
      id: "kurva_tren" as const,
      num: 3,
      label: "3. Kurva & Heatmap",
      shortLabel: "Kurva",
      icon: <TrendingUp className="w-3.5 h-3.5 text-blue-600" />,
    },
    {
      id: "peta_spasial" as const,
      num: 4,
      label: "4. Peta Spasial",
      shortLabel: "Peta",
      icon: <MapPin className="w-3.5 h-3.5 text-teal-600" />,
    },
    {
      id: "klaster_ebs" as const,
      num: 5,
      label: "5. EBS, Klaster & Lab",
      shortLabel: "EBS & Lab",
      icon: <Radio className="w-3.5 h-3.5 text-purple-600" />,
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
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                isActive
                  ? "bg-[#007067] text-white shadow-sm ring-1 ring-[#007067]"
                  : "bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
