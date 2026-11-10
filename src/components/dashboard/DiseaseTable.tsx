"use client";

import React, { useState } from "react";
import { Table, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { DiseaseAlertItem, SKDR_DISEASE_ALERTS } from "@/data/skdrData";

export default function DiseaseTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;

  const filteredItems = SKDR_DISEASE_ALERTS.filter(
    (d) =>
      d.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Table className="w-4 h-4 text-[#007067]" />
            <span>Tabel Kompilasi 24 Penyakit Potensial KLB</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Data rekapitulasi sinyal EBS, kasus PE, kematian PE, dan kecepatan respon
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari penyakit..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20"
          />
        </div>
      </div>

      {/* Table Container (Slideable horizontally without bulky scrollbars) */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-xs text-slate-700 min-w-[520px]">
          <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">No</th>
              <th className="py-2.5 px-3">Penyakit</th>
              <th className="py-2.5 px-3 text-right">Sinyal EBS</th>
              <th className="py-2.5 px-3 text-right">Kasus PE</th>
              <th className="py-2.5 px-3 text-right">Kematian PE</th>
              <th className="py-2.5 px-3 text-right">CFR</th>
              <th className="py-2.5 px-3 text-center">KLB</th>
              <th className="py-2.5 px-3 text-right">Respon &le; 24 Jam</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.map((item, idx) => {
              const cfr = ((item.deaths / (item.cases || 1)) * 100).toFixed(2);
              const responRate = ((item.respon24 / item.alerts) * 100).toFixed(0);
              const globalIdx = startIndex + idx + 1;

              return (
                <tr key={item.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-400 text-[11px]">
                    {globalIdx}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{item.disease}</div>
                    <div className="text-[10px] text-slate-400">{item.category}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-slate-800">
                    {item.alerts.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-[#007067]">
                    {item.cases.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-rose-600">
                    {item.deaths}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[11px] text-slate-500">
                    {cfr}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.klb > 0 ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-100 text-red-700">
                        {item.klb}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-teal-800">
                    {responRate}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px]">
          Menampilkan <strong>{startIndex + 1}</strong>&ndash;
          <strong>{Math.min(startIndex + itemsPerPage, filteredItems.length)}</strong> dari{" "}
          <strong>{filteredItems.length}</strong> penyakit
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-6 h-6 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-[#007067] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

