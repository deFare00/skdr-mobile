"use client";

import React, { useState } from "react";
import { FlaskConical, AlertCircle, Microscope, ChevronLeft, ChevronRight } from "lucide-react";
import { SKDR_KLASTER_LIST, SKDR_LAB_SUMMARY } from "@/data/skdrData";

export default function KlasterLabSection() {
  const [activeTab, setActiveTab] = useState<"klaster" | "lab">("klaster");
  const [klasterPage, setKlasterPage] = useState(1);
  const [labPage, setLabPage] = useState(1);

  const klasterPerPage = 3;
  const labPerPage = 3;

  const totalKlasterPages = Math.ceil(SKDR_KLASTER_LIST.length / klasterPerPage);
  const currentKlasterItems = SKDR_KLASTER_LIST.slice(
    (klasterPage - 1) * klasterPerPage,
    klasterPage * klasterPerPage
  );

  const totalLabPages = Math.ceil(SKDR_LAB_SUMMARY.length / labPerPage);
  const currentLabItems = SKDR_LAB_SUMMARY.slice(
    (labPage - 1) * labPerPage,
    labPage * labPerPage
  );

  return (
    <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Klaster Kasus &amp; Hasil Laboratorium
          </h3>
          <p className="text-[11px] text-slate-500">
            Penyelidikan lapangan KLB dan konfirmasi spesimen NAR
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab("klaster")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "klaster"
              ? "bg-white text-[#007067] shadow-xs"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Klaster Lapangan ({SKDR_KLASTER_LIST.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("lab")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "lab"
              ? "bg-white text-[#007067] shadow-xs"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Microscope className="w-3.5 h-3.5" />
          <span>Laboratorium NAR ({SKDR_LAB_SUMMARY.length})</span>
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === "klaster" ? (
        <div className="space-y-2.5">
          {currentKlasterItems.map((kls) => (
            <div
              key={kls.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">
                    {kls.id} &bull; {kls.disease}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                    {kls.title}
                  </h4>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black flex-shrink-0 ${
                    kls.status === "Penyelidikan Aktif"
                      ? "bg-red-100 text-red-700"
                      : kls.status === "Verifikasi Lab"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {kls.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium">{kls.location}</p>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 text-slate-500">
                <span>
                  <strong>{kls.cases} kasus</strong> {kls.deaths > 0 && `(${kls.deaths} meninggal)`}
                </span>
                <span className="text-[10px] text-teal-800 font-semibold">
                  7-1-7: {kls.score717}
                </span>
              </div>
            </div>
          ))}

          {/* Klaster Pagination */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Halaman {klasterPage} dari {totalKlasterPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setKlasterPage((p) => Math.max(1, p - 1))}
                disabled={klasterPage === 1}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setKlasterPage((p) => Math.min(totalKlasterPages, p + 1))}
                disabled={klasterPage === totalKlasterPages}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {currentLabItems.map((lab, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{lab.disease}</h4>
                <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Positivity: {lab.positivityRate}%
                </span>
              </div>

              {/* Progress bar of positive vs negative */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${lab.positivityRate}%` }}
                  className="bg-red-500 h-full"
                  title="Positif"
                />
                <div
                  style={{ width: `${100 - lab.positivityRate}%` }}
                  className="bg-teal-600 h-full"
                  title="Negatif"
                />
              </div>

              <div className="grid grid-cols-4 gap-1 text-center text-[10px] text-slate-500">
                <div>
                  <span className="block font-bold text-slate-800">
                    {lab.tested.toLocaleString()}
                  </span>
                  <span>Diperiksa</span>
                </div>
                <div>
                  <span className="block font-bold text-red-600">
                    {lab.positive.toLocaleString()}
                  </span>
                  <span>Positif</span>
                </div>
                <div>
                  <span className="block font-bold text-teal-700">
                    {lab.negative.toLocaleString()}
                  </span>
                  <span>Negatif</span>
                </div>
                <div>
                  <span className="block font-bold text-amber-600">
                    {lab.pending.toLocaleString()}
                  </span>
                  <span>Proses</span>
                </div>
              </div>
            </div>
          ))}

          {/* Lab Pagination */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Halaman {labPage} dari {totalLabPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLabPage((p) => Math.max(1, p - 1))}
                disabled={labPage === 1}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setLabPage((p) => Math.min(totalLabPages, p + 1))}
                disabled={labPage === totalLabPages}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
