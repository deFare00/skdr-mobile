import React from "react";
import { LayoutGrid, Layers, Activity, ShieldCheck } from "lucide-react";

interface FeatureCardItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: FeatureCardItem[] = [
  {
    icon: <LayoutGrid className="w-5 h-5 text-[#79e27c]" strokeWidth={2.2} />,
    title: "DASBOR",
    description: "Indikator SKDR, penyakit, dan peta sebaran untuk pengguna terdaftar.",
  },
  {
    icon: <Layers className="w-5 h-5 text-[#79e27c]" strokeWidth={2.2} />,
    title: "DASBOR LIMITED",
    description: "Analisis spasial dan matriks analisa untuk pengguna terdaftar.",
  },
  {
    icon: <Activity className="w-5 h-5 text-[#79e27c]" strokeWidth={2.2} />,
    title: "TATA KELOLA",
    description: "Form PE, master data, dan sinkronisasi integrasi.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#79e27c]" strokeWidth={2.2} />,
    title: "AKSES BERBASIS PERAN",
    description: "Setiap akun hanya membuka menu sesuai perannya.",
  },
];

export default function FeatureCards({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3.5 ${className}`}>
      {features.map((item, idx) => (
        <div
          key={idx}
          className="group relative flex flex-col p-4 sm:p-5 rounded-2xl bg-white/[0.09] hover:bg-white/[0.14] border border-white/[0.16] shadow-sm backdrop-blur-md transition-all duration-200"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors">
              {item.icon}
            </div>
            <h3 className="font-bold tracking-wider text-xs sm:text-sm text-white uppercase">
              {item.title}
            </h3>
          </div>
          <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

