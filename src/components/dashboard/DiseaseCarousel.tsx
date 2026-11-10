"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";
import {
  SKDR_MONITORED_DISEASES,
  EBS_UNMAPPED_ALERTS,
  RingkasanDiseaseItem,
  DeltaPair,
  FourWeekDelta,
} from "@/data/skdrRingkasanDetails";

export interface DiseaseCarouselProps {
  sumber?: "all" | "ebs" | "pe";
  selectedCategory?: string;
  selectedDisease?: string;
}

const SPEED = 30; // px per second (leftward continuous marquee)

const SOURCE_COLOR = {
  ebs: "#e8710a",
  pe: "#0a8fa3",
} as const;

const fmt = (n: number): string => (n ?? 0).toLocaleString("id-ID");

const dmy = (iso: string | null): string | null =>
  iso ? iso.split("-").reverse().join("/") : null;

function MiniSpark({ values, color }: { values: number[]; color: string }) {
  const ptsArr = values.length >= 2 ? values : [0, 0];
  const max = Math.max(1, ...ptsArr);
  const w = 96;
  const h = 24;
  const pts = ptsArr
    .map(
      (v, i) =>
        `${((i / Math.max(1, ptsArr.length - 1)) * w).toFixed(1)},${(
          h -
          2 -
          (v / max) * (h - 4)
        ).toFixed(1)}`
    )
    .join(" ");

  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="block"
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function MiniTrend({ d }: { d: FourWeekDelta | null }) {
  if (!d || (d.last4 === 0 && d.prev4 === 0)) {
    return <span className="text-[11px] text-slate-400">&mdash;</span>;
  }
  const up = d.last4 > d.prev4;
  const same = d.last4 === d.prev4;
  return (
    <span
      title={`4 minggu terakhir: ${fmt(d.last4)} · 4 minggu sebelumnya: ${fmt(d.prev4)}`}
      className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
        same ? "text-slate-500" : up ? "text-red-600" : "text-emerald-700"
      }`}
    >
      {same ? (
        "="
      ) : up ? (
        <ArrowUp className="h-3 w-3" />
      ) : (
        <ArrowDown className="h-3 w-3" />
      )}
      <span>{fmt(d.last4)}</span>
    </span>
  );
}

function MiniDelta24({ d }: { d: DeltaPair | null }) {
  if (!d) {
    return <span className="text-[10.5px] text-slate-400">24j &mdash;</span>;
  }
  const diff = d.cur - d.prev;
  return (
    <span
      title={`24 jam terakhir: ${fmt(d.cur)} · 24 jam sebelumnya: ${fmt(d.prev)}`}
      className={`text-[10.5px] font-bold ${
        diff > 0
          ? "text-red-600"
          : diff < 0
          ? "text-emerald-700"
          : "text-slate-500"
      }`}
    >
      24j {diff > 0 ? "+" : ""}
      {fmt(diff)}
    </span>
  );
}

function SourceKey({ source, label }: { source: "ebs" | "pe"; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
      {source === "ebs" ? (
        <span className="h-2.5 w-2.5 rounded-full bg-[#e8710a] shrink-0" />
      ) : (
        <span className="mx-px h-2 w-2 rotate-45 bg-[#0a8fa3] shrink-0" />
      )}
      <span>{label}</span>
    </span>
  );
}

function DiseaseSummaryCard({
  r,
  showEbs,
  showPe,
  onSelect,
}: {
  r: RingkasanDiseaseItem;
  showEbs: boolean;
  showPe: boolean;
  onSelect: (item: RingkasanDiseaseItem) => void;
}) {
  const cfr =
    showPe && r.pe.knownOutcome > 0
      ? (r.pe.deaths / r.pe.knownOutcome) * 100
      : null;

  const last = [
    showEbs ? r.ebs.lastDate : null,
    showPe ? r.pe.lastDate : null,
  ]
    .filter(Boolean)
    .sort()
    .pop() as string | undefined;

  const totalDeaths =
    (showEbs ? r.ebs.deaths : 0) + (showPe ? r.pe.deaths : 0);

  return (
    <button
      type="button"
      onClick={() => onSelect(r)}
      draggable={false}
      data-testid="disease-card"
      className="w-full text-left rounded-[12px] border border-[#e4eae9] bg-white p-3.5 group flex h-full flex-col transition-colors hover:border-[#63d3c5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007067] shadow-2xs cursor-pointer"
    >
      {/* Top Name + Category */}
      <div className="flex items-start justify-between gap-2 w-full">
        <div className="min-w-0 flex-1">
          <div className="truncate font-black text-slate-900 group-hover:text-[#007067] text-sm">
            {r.name}
          </div>
          <div className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-500 mt-0.5">
            {r.category || "TIDAK BERKATEGORI"}
            {r.isZoonotic ? " · ZOONOSIS" : ""}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-[#007067]" />
      </div>

      {/* Alert EBS & Kasus PE Sparkline Boxes */}
      <div className="mt-2.5 grid grid-cols-1 gap-2 w-full">
        {showEbs ? (
          <div className="rounded-lg bg-[#f7f9f9] px-2.5 py-1.5 min-w-0">
            <SourceKey source="ebs" label="Alert EBS" />
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-black leading-none tabular-nums text-slate-900">
                {fmt(r.ebs.alerts)}
              </span>
              <div className="min-w-0 flex-1">
                <MiniSpark
                  values={r.ebs.sparkAlerts}
                  color={SOURCE_COLOR.ebs}
                />
              </div>
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <MiniTrend d={r.ebs.deltaAlerts} />
              <MiniDelta24 d={r.ebs.d24} />
            </div>
          </div>
        ) : null}

        {showPe ? (
          <div className="rounded-lg bg-[#f7f9f9] px-2.5 py-1.5 min-w-0">
            <SourceKey source="pe" label="Kasus PE" />
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-black leading-none tabular-nums text-slate-900">
                {fmt(r.pe.cases)}
              </span>
              <div className="min-w-0 flex-1">
                <MiniSpark values={r.pe.spark} color={SOURCE_COLOR.pe} />
              </div>
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <MiniTrend d={r.pe.delta} />
              <MiniDelta24 d={r.pe.d24} />
            </div>
          </div>
        ) : null}
      </div>

      {/* Metadata Table: Kematian, CFR PE, Provinsi terdampak */}
      <dl className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] w-full">
        <div className="flex justify-between gap-1">
          <dt className="text-slate-500">Kematian</dt>
          <dd className="font-bold tabular-nums text-slate-800">
            {fmt(totalDeaths)}
          </dd>
        </div>
        <div className="flex justify-between gap-1">
          <dt className="text-slate-500">CFR PE</dt>
          <dd className="font-bold tabular-nums text-slate-800">
            {showPe && cfr !== null
              ? `${cfr.toLocaleString("id-ID", { maximumFractionDigits: 1 })}%`
              : "—"}
          </dd>
        </div>
        <div className="col-span-2 flex justify-between gap-1">
          <dt className="text-slate-500">Provinsi terdampak</dt>
          <dd className="font-bold tabular-nums text-slate-800">
            {showEbs ? (
              <span style={{ color: SOURCE_COLOR.ebs }}>
                ● {fmt(r.ebs.provinces)}
              </span>
            ) : null}
            {showEbs && showPe ? " · " : null}
            {showPe ? (
              <span style={{ color: SOURCE_COLOR.pe }}>
                ◆ {fmt(r.pe.provinces)}
              </span>
            ) : null}
          </dd>
        </div>
      </dl>

      {/* Last Date Footer */}
      <div className="mt-auto pt-2 text-[10.5px] text-slate-500 w-full">
        Data terakhir:{" "}
        <span className="font-semibold text-slate-700">
          {last ? dmy(last) : "Data belum tersedia"}
        </span>
      </div>
    </button>
  );
}

export default function DiseaseCarousel({
  sumber = "all",
  selectedCategory = "Semua kategori",
  selectedDisease = "Semua penyakit",
}: DiseaseCarouselProps) {
  const track = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [touchDragging, setTouchDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RingkasanDiseaseItem | null>(
    null
  );

  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const showEbs = sumber !== "pe";
  const showPe = sumber !== "ebs";

  // Filter rows matching global filters if selected
  const filteredRows = SKDR_MONITORED_DISEASES.filter((r) => {
    if (
      selectedDisease &&
      selectedDisease !== "Semua penyakit" &&
      !r.name.toLowerCase().includes(selectedDisease.toLowerCase()) &&
      !selectedDisease.toLowerCase().includes(r.name.toLowerCase())
    ) {
      return false;
    }
    if (selectedCategory && selectedCategory !== "Semua kategori") {
      const cat = selectedCategory.toLowerCase();
      if (cat.includes("zoonosis") && !r.isZoonotic) return false;
      if (cat.includes("vektor") && !r.category.toLowerCase().includes("vector") && !r.category.toLowerCase().includes("mosquito"))
        return false;
      if (cat.includes("respiratori") && !r.category.toLowerCase().includes("respirat") && !r.category.toLowerCase().includes("airborne"))
        return false;
    }
    return true;
  });

  const loop = filteredRows.length > 2;
  const paused = hover || focus || userPaused || touchDragging || !loop;

  // Continuous leftward marquee via requestAnimationFrame (matching official SPEED = 30px/s)
  useEffect(() => {
    if (paused) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const step = (now: number) => {
      const el = track.current;
      if (el && !document.hidden && !drag.current) {
        acc += ((now - last) / 1000) * SPEED;
        const whole = Math.floor(acc);
        if (whole >= 1) {
          acc -= whole;
          el.scrollLeft += whole;
          const half = el.scrollWidth / 2;
          if (half > 0 && el.scrollLeft >= half) {
            el.scrollLeft -= half;
          }
        }
      }
      last = now;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const page = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const w = card ? card.offsetWidth + 12 : 260;
    if (loop && dir === -1 && el.scrollLeft < w) {
      el.scrollLeft += el.scrollWidth / 2;
    }
    el.scrollBy({
      left: dir * w,
      behavior: "smooth",
    });
  };

  const list = loop ? [...filteredRows, ...filteredRows] : filteredRows;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Ringkasan per penyakit"
      data-testid="disease-carousel"
      className="pt-4 min-w-0"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocus(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(false);
      }}
    >
      {/* Section Header */}
      <div className="mb-3 border-b border-[#dde4e3] pb-2 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#047a6f]">
            PENYAKIT DIPANTAU
          </div>
          <h2 className="mt-0.5 text-xl sm:text-2xl font-bold leading-tight tracking-[-0.01em] text-[#064540]">
            Ringkasan per penyakit
          </h2>
        </div>

        {/* Play/Pause, Prev (<), Next (>) Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {loop ? (
            <button
              type="button"
              onClick={() => setUserPaused((u) => !u)}
              aria-label={userPaused ? "Putar animasi" : "Jeda animasi"}
              title={userPaused ? "Putar animasi" : "Jeda animasi"}
              className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
            >
              {userPaused ? (
                <Play className="h-3.5 w-3.5" />
              ) : (
                <Pause className="h-3.5 w-3.5" />
              )}
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => page(-1)}
            aria-label="Sebelumnya"
            data-testid="carousel-prev"
            className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => page(1)}
            aria-label="Berikutnya"
            data-testid="carousel-next"
            className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Marquee Track (Hidden Scrollbar) */}
      <div
        ref={track}
        className="flex gap-3 overflow-x-auto overscroll-x-contain pb-1 no-scrollbar cursor-grab active:cursor-grabbing select-none"
        onTouchStart={() => setTouchDragging(true)}
        onTouchEnd={() => setTimeout(() => setTouchDragging(false), 600)}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !track.current) return;
          drag.current = {
            x: e.clientX,
            left: track.current.scrollLeft,
            moved: false,
          };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || !track.current) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) d.moved = true;
          track.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          setTimeout(() => {
            drag.current = null;
          }, 0);
        }}
        onPointerLeave={() => {
          drag.current = null;
        }}
        onClickCapture={(e) => {
          if (drag.current?.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {list.map((r, i) => (
          <div
            key={`${r.code}-${i}`}
            data-slide={true}
            className="w-[15.5rem] shrink-0 sm:w-[16.5rem]"
            aria-hidden={i >= filteredRows.length ? true : undefined}
          >
            <DiseaseSummaryCard
              r={r}
              showEbs={showEbs}
              showPe={showPe}
              onSelect={setSelectedItem}
            />
          </div>
        ))}
      </div>

      {/* Unmapped EBS note matching screenshot */}
      <p className="mt-2 text-[11px] text-slate-500">
        {fmt(EBS_UNMAPPED_ALERTS)} alert EBS tanpa provinsi tidak tampil di heatmap.
      </p>

      {/* Disease Detail Sheet when tapped */}
      {selectedItem ? (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#047a6f]">
                  {selectedItem.category}
                  {selectedItem.isZoonotic ? " · ZOONOSIS" : ""}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {selectedItem.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Kode: {selectedItem.code}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#f7f9f9] border border-[#e4eae9]">
                <SourceKey source="ebs" label="Alert EBS" />
                <p className="text-xl font-black text-slate-900 mt-1">
                  {fmt(selectedItem.ebs.alerts)}
                </p>
                <p className="text-[11px] text-slate-500">
                  {fmt(selectedItem.ebs.cases)} kasus &bull;{" "}
                  {fmt(selectedItem.ebs.provinces)} prov
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#f7f9f9] border border-[#e4eae9]">
                <SourceKey source="pe" label="Kasus PE" />
                <p className="text-xl font-black text-[#0a8fa3] mt-1">
                  {fmt(selectedItem.pe.cases)}
                </p>
                <p className="text-[11px] text-slate-500">
                  {fmt(selectedItem.pe.deaths)} meninggal &bull;{" "}
                  {fmt(selectedItem.pe.provinces)} prov
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 flex items-center justify-between px-1">
              <span>Data terakhir:</span>
              <span className="font-bold text-slate-800">
                {dmy(selectedItem.pe.lastDate || selectedItem.ebs.lastDate) ||
                  "Data belum tersedia"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="w-full py-2.5 bg-[#007067] hover:bg-[#005e57] text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
