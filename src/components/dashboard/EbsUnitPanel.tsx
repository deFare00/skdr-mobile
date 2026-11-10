"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { SKDR_EBS_UNIT_DATA, KelUnitItem } from "@/data/skdrRingkasanDetails";

export interface EbsUnitPanelProps {
  selectedUnitFilter?: string;
}

const COLORS = [
  "#0f766e", // Puskesmas (dark teal)
  "#2563eb", // Rumah Sakit (blue)
  "#d97706", // Klinik (orange)
  "#7c3aed", // Dinas Kesehatan Kabupaten (purple)
  "#db2777", // BKK (pink/magenta)
  "#65a30d", // Laboratorium (green)
  "#0891b2", // Dinas Kesehatan Provinsi (cyan)
];

const nf = (n: number): string => (n ?? 0).toLocaleString("id-ID");

const pf = (v: number): string =>
  `${v.toLocaleString("id-ID", { maximumFractionDigits: 1 })}%`;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeDonutSlice(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
): string {
  // Clamp almost-full circle so SVG arc renders cleanly
  const clampedEnd = endAngle - startAngle >= 359.9 ? startAngle + 359.9 : endAngle;
  const largeArc = clampedEnd - startAngle <= 180 ? "0" : "1";

  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, clampedEnd);
  const innerEnd = polarToCartesian(cx, cy, innerR, clampedEnd);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);

  return [
    `M ${outerStart.x.toFixed(2)} ${outerStart.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x.toFixed(2)} ${outerEnd.y.toFixed(2)}`,
    `L ${innerEnd.x.toFixed(2)} ${innerEnd.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x.toFixed(2)} ${innerStart.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

function PanelCard({
  title,
  note,
  testId,
  children,
}: {
  title: string;
  note?: string;
  testId: string;
  children: React.ReactNode;
}) {
  return (
    <article
      data-testid={testId}
      className="rounded-[12px] border border-[#e4eae9] bg-white p-4 flex flex-col justify-between shadow-2xs min-w-0"
    >
      <div className="min-w-0">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-3">
          {title}
        </h3>
        {children}
      </div>
      {note ? (
        <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
          {note}
        </p>
      ) : null}
    </article>
  );
}

export default function EbsUnitPanel({
  selectedUnitFilter = "Semua unit pelapor",
}: EbsUnitPanelProps) {
  const [ku, setKu] = useState<string>("");
  const [hoveredSlice, setHoveredSlice] = useState<KelUnitItem | null>(null);

  const { totalReports, kelUnit, units, silent } = SKDR_EBS_UNIT_DATA;

  // Apply either local donut selection or global filter bar selection
  const activeTypeFilter =
    ku ||
    (selectedUnitFilter && selectedUnitFilter !== "Semua unit pelapor"
      ? selectedUnitFilter.replace(" & Utama", "").replace(" Kab/Kota", "")
      : "");

  const filteredUnits = activeTypeFilter
    ? units.filter((u) =>
        u.kel_unit.toLowerCase().includes(activeTypeFilter.toLowerCase())
      )
    : units;

  const filteredSilent = activeTypeFilter
    ? silent.rows.filter((u) =>
        u.kel_unit.toLowerCase().includes(activeTypeFilter.toLowerCase())
      )
    : silent.rows;

  // Build SVG Donut geometry
  const sumReports = kelUnit.reduce((acc, k) => acc + k.reports, 0) || 1;
  let currentAngle = 0;
  const slices = kelUnit.map((item, idx) => {
    const sweep = Math.max(1.2, (item.reports / sumReports) * 360);
    const startAngle = currentAngle;
    const endAngle = Math.min(360, currentAngle + sweep);
    currentAngle += sweep;
    return {
      ...item,
      color: COLORS[idx % COLORS.length],
      path: describeDonutSlice(100, 100, 52, 86, startAngle, endAngle),
      pct: (item.reports * 100) / (totalReports || sumReports),
    };
  });

  const activeTooltipItem =
    hoveredSlice ||
    (ku ? kelUnit.find((k) => k.kel_unit === ku) || null : null);

  return (
    <section className="pt-4 space-y-3" data-testid="ebs-unit">
      {/* Header Row */}
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-800">
          Unit pelapor EBS
        </h2>
        {ku ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
            <span>Jenis unit: {ku}</span>
            <button
              type="button"
              className="ml-0.5 p-0.5 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
              onClick={() => setKu("")}
              aria-label="Hapus filter jenis unit"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ) : null}
      </div>

      {/* 3 Sub-cards */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Card 1: Jenis unit pelapor (Donut + Interactive Legend) */}
        <PanelCard
          title="Jenis unit pelapor"
          testId="ebs-kel-unit"
          note="Klik irisan untuk memfilter peringkat dan unit diam."
        >
          <div className="relative flex flex-col items-center">
            {/* Hover / Active Pill Info */}
            <div className="h-5 mb-1 flex items-center justify-center">
              {activeTooltipItem ? (
                <div className="rounded-md bg-slate-900 px-2.5 py-0.5 text-[10.5px] font-semibold text-white shadow-xs whitespace-nowrap">
                  {activeTooltipItem.kel_unit}: {nf(activeTooltipItem.reports)}{" "}
                  laporan (
                  {pf(
                    (activeTooltipItem.reports * 100) /
                      (totalReports || sumReports)
                  )}
                  )
                </div>
              ) : null}
            </div>

            {/* Interactive SVG Donut */}
            <svg
              viewBox="0 0 200 200"
              className="w-44 h-44 sm:w-48 sm:h-48 select-none"
              role="img"
              aria-label="Diagram donat jenis unit pelapor EBS"
            >
              {slices.map((s) => {
                const isSelected = ku === s.kel_unit;
                const dimmed = !!ku && !isSelected;
                return (
                  <path
                    key={s.kel_unit}
                    d={s.path}
                    fill={s.color}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    opacity={dimmed ? 0.35 : 1}
                    className="cursor-pointer transition-opacity duration-150 hover:opacity-85"
                    onMouseEnter={() => setHoveredSlice(s)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() =>
                      setKu((prev) => (prev === s.kel_unit ? "" : s.kel_unit))
                    }
                  />
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px]">
              {slices.map((s) => {
                const isSelected = ku === s.kel_unit;
                const dimmed = !!ku && !isSelected;
                return (
                  <button
                    key={s.kel_unit}
                    type="button"
                    onClick={() =>
                      setKu((prev) => (prev === s.kel_unit ? "" : s.kel_unit))
                    }
                    className={`inline-flex items-center gap-1.5 cursor-pointer transition-opacity ${
                      dimmed ? "opacity-40" : "opacity-100"
                    } ${isSelected ? "font-bold underline" : "font-medium"}`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span style={{ color: s.color }}>{s.kel_unit}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </PanelCard>

        {/* Card 2: Unit pelapor teraktif */}
        <PanelCard title="Unit pelapor teraktif" testId="ebs-units">
          {!filteredUnits.length ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Tidak ada unit pada filter ini.
            </div>
          ) : (
            <div className="max-h-[260px] overflow-y-auto no-scrollbar">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-1.5 pr-2 text-left">Unit</th>
                    <th className="py-1.5 px-2 text-left">Jenis</th>
                    <th className="py-1.5 px-2 text-right">Laporan</th>
                    <th className="py-1.5 pl-2 text-right">Kasus</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.map((u, i) => (
                    <tr
                      key={`${u.unit}-${i}`}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                    >
                      <td className="py-2 pr-2 min-w-0">
                        <div className="font-semibold text-slate-900 leading-snug">
                          {u.unit}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {u.kabkota}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-slate-600 whitespace-nowrap">
                        {u.kel_unit}
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums text-slate-800">
                        {nf(u.reports)}
                      </td>
                      <td className="py-2 pl-2 text-right font-mono tabular-nums text-slate-800">
                        {nf(u.cases)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PanelCard>

        {/* Card 3: Unit berhenti melapor */}
        <PanelCard
          title={`Unit berhenti melapor (${nf(silent.count)} dari ${nf(
            silent.activeBase
          )} unit aktif)`}
          testId="ebs-silent"
          note={`Unit yang biasanya melapor tetapi tidak mengirim laporan dalam ${silent.silentWeeks} minggu terakhir.`}
        >
          {!filteredSilent.length ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Tidak ada unit yang berhenti melapor.
            </div>
          ) : (
            <div className="max-h-[260px] overflow-y-auto no-scrollbar">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-1.5 pr-2 text-left">Unit</th>
                    <th className="py-1.5 px-2 text-right whitespace-nowrap">
                      Lap. sebelumnya
                    </th>
                    <th className="py-1.5 pl-2 text-right">Terakhir</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSilent.map((u, i) => (
                    <tr
                      key={`${u.unit}-${i}`}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                    >
                      <td className="py-2 pr-2 min-w-0">
                        <div className="font-semibold text-slate-900 leading-snug">
                          {u.unit}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {u.kel_unit} &middot; {u.kabkota}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums text-slate-800">
                        {nf(u.base_reports)}
                      </td>
                      <td className="py-2 pl-2 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap">
                        {u.last}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PanelCard>
      </div>
    </section>
  );
}

