"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  ClipboardCheck,
  Radio,
  Table,
  Utensils,
} from "lucide-react";
import FormIndividuSection from "./FormIndividuSection";
import UnderDevelopmentSection from "../dashboard/UnderDevelopmentSection";

export type TataKelolaTab =
  | "form_individu"
  | "form_pe"
  | "laporan_ebs"
  | "entri_agregat"
  | "gizi_mbg";

interface TataKelolaTabMeta {
  id: TataKelolaTab;
  label: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const TATA_KELOLA_TABS: TataKelolaTabMeta[] = [
  {
    id: "form_individu",
    label: "Form Individu",
    desc: "Data per pasien (SKDR-IBS) — penyakit agregat, pemeriksaan, dan catatan SOAP.",
    Icon: Stethoscope,
  },
  {
    id: "form_pe",
    label: "Form PE",
    desc: "Formulir Penyelidikan Epidemiologi (PE) kasus potensial KLB dan pelacakan kontak erat di lapangan.",
    Icon: ClipboardCheck,
  },
  {
    id: "laporan_ebs",
    label: "Laporan EBS",
    desc: "Pengelolaan laporan Event-Based Surveillance (EBS), verifikasi sinyal dini, dan respons cepat unit pelapor.",
    Icon: Radio,
  },
  {
    id: "entri_agregat",
    label: "Entri Data Agregat",
    desc: "Rekapitulasi dan entri data mingguan agregat 24 penyakit potensial KLB per minggu epidemiologi.",
    Icon: Table,
  },
  {
    id: "gizi_mbg",
    label: "Pengawasan Gizi MBG",
    desc: "Pemantauan keamanan pangan, pelaporan keracunan pangan, dan pengawasan program Makan Bergizi Gratis (MBG).",
    Icon: Utensils,
  },
];

interface TataKelolaSectionProps {
  username?: string;
}

export default function TataKelolaSection({
  username = "Administrator",
}: TataKelolaSectionProps) {
  const [activeTab, setActiveTab] = useState<TataKelolaTab>("form_individu");

  const currentTabMeta =
    TATA_KELOLA_TABS.find((t) => t.id === activeTab) || TATA_KELOLA_TABS[0];

  return (
    <div className="space-y-3">
      {/* Sub-navigation tabs for Tata Kelola (sticky on mobile scroll) */}
      <div className="sticky top-[57px] z-30 -mx-3 px-3 py-1.5 bg-[#F4F7F6]/95 backdrop-blur-md">
        <div
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
          role="tablist"
          aria-label="Navigasi Tata Kelola"
        >
          {TATA_KELOLA_TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold transition-all border ${
                  isActive
                    ? "bg-[#006B6B] text-white border-[#006B6B] shadow-sm shadow-teal-900/15"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 active:scale-[0.98]"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-teal-100" : "text-slate-400"
                  }`}
                />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content */}
      {activeTab === "form_individu" ? (
        <FormIndividuSection username={username} />
      ) : (
        <UnderDevelopmentSection
          title={currentTabMeta.label}
          description={currentTabMeta.desc}
          buttonLabel="Kembali ke Form Individu"
          onBackToRingkasan={() => setActiveTab("form_individu")}
        />
      )}
    </div>
  );
}
