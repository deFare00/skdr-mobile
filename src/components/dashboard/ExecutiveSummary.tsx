"use client";

import React, { useState, useId } from "react";
import { SKDR_RINGKASAN_SUMMARY, Delta24Data } from "@/data/skdrData";

export interface ExecutiveSummaryProps {
  sumber?: "all" | "ebs" | "pe";
  startYear?: number;
  startWeek?: number;
  endYear?: number;
  endWeek?: number;
  selectedProvince?: string;
  selectedDisease?: string;
}

const SRC_COLORS = {
  ebs: "#e8710a",
  pe: "#0a8fa3",
} as const;

const fmt = (n: number): string => (n ?? 0).toLocaleString("id-ID");

const dm = (iso?: string): string =>
  iso ? iso.split("-").reverse().slice(0, 2).join("/") : "";

const dmy = (iso?: string): string =>
  iso ? iso.split("-").reverse().join("/") : "";

/** Smooth path through points (Catmull-Rom -> cubic Bézier), matching SKDR reference chart. */
function smooth(pts: [number, number][]): string {
  if (pts.length < 2) {
    return pts.length ? `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}` : "";
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1: [number, number] = [
      p1[0] + (p2[0] - p0[0]) / 6,
      p1[1] + (p2[1] - p0[1]) / 6,
    ];
    const c2: [number, number] = [
      p2[0] - (p3[0] - p1[0]) / 6,
      p2[1] - (p3[1] - p1[1]) / 6,
    ];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

function SourceKey({
  source,
  label,
  className = "",
}: {
  source: "ebs" | "pe";
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 leading-snug ${className}`}
    >
      {source === "ebs" ? (
        <span className="h-2.5 w-2.5 rounded-full bg-[#e8710a] shrink-0" />
      ) : (
        <span className="mx-px h-2 w-2 rotate-45 bg-[#0a8fa3] shrink-0" />
      )}
      <span>{label}</span>
    </span>
  );
}

function Delta24({ p }: { p?: Delta24Data | null }) {
  if (!p) return null;
  const d = p.cur - p.prev;
  if (d === 0) {
    return (
      <span
        title="24 jam terakhir vs 24 jam sebelumnya"
        data-testid="kpi-d24"
        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500"
      >
        tetap
      </span>
    );
  }
  const up = d > 0;
  const pct =
    p.prev > 0 ? ` (${up ? "+" : "−"}${((Math.abs(d) / p.prev) * 100).toFixed(1)}%)` : "";
  return (
    <span
      data-testid="kpi-d24"
      className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold ${
        up ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {up ? "▲" : "▼"} {up ? "+" : "−"}
      {fmt(Math.abs(d))}
      {pct}
    </span>
  );
}

function KpiSpark({
  src,
  values,
  days,
  className = "h-16",
}: {
  src: "ebs" | "pe";
  values: number[];
  days: string[];
  className?: string;
}) {
  const [hi, setHi] = useState<number | null>(null);
  const uid = useId().replace(/:/g, "");

  if (!values.length) return null;

  const W = 200;
  const H = 60;
  const P = 3;
  const max = Math.max(1, ...values);
  const pts: [number, number][] = values.map((v, i) => [
    P + (i / Math.max(1, values.length - 1)) * (W - 2 * P),
    H - P - (v / max) * (H - 2 * P - 6),
  ]);
  const line = smooth(pts);
  const gid = `kpi-grad-${src}-${uid}`;
  const color = SRC_COLORS[src];
  const k = hi !== null ? hi : values.length - 1;

  const updateIndexFromClientX = (clientX: number, rect: DOMRect) => {
    const fx = (clientX - rect.left) / Math.max(1, rect.width);
    setHi(Math.max(0, Math.min(values.length - 1, Math.round(fx * (values.length - 1)))));
  };

  return (
    <div className="relative min-w-0 flex-1" data-testid="kpi-spark">
      <div
        className={`relative w-full ${className} touch-pan-y select-none`}
        onMouseMove={(e) => updateIndexFromClientX(e.clientX, e.currentTarget.getBoundingClientRect())}
        onMouseLeave={() => setHi(null)}
        onTouchStart={(e) => {
          if (e.touches[0]) {
            updateIndexFromClientX(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
          }
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) {
            updateIndexFromClientX(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
          }
        }}
        onTouchEnd={() => setHi(null)}
        role="img"
        aria-label={`Tren sepanjang periode filter (${days.length} titik)`}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path
            d={`${line} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`}
            fill={`url(#${gid})`}
          />
          <path
            d={line}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {hi !== null ? (
            <line
              x1={pts[k][0]}
              x2={pts[k][0]}
              y1={0}
              y2={H}
              stroke="#cbd5e1"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
        </svg>

        <span
          className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{
            left: `${(pts[k][0] / W) * 100}%`,
            top: `${(pts[k][1] / H) * 100}%`,
            background: color,
          }}
        />

        {hi !== null ? (
          <div
            className="pointer-events-none absolute -top-7 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white shadow"
            data-testid="kpi-spark-tip"
            style={{
              left: `${Math.min(85, Math.max(15, (pts[k][0] / W) * 100))}%`,
            }}
          >
            {dm(days[hi])}: {fmt(values[hi])}
          </div>
        ) : null}
      </div>

      <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
        <span>{dm(days[0])}</span>
        <span>{dm(days[days.length - 1])}</span>
      </div>
    </div>
  );
}

interface KpiRowItem {
  src: "ebs" | "pe";
  label: string;
  value: string;
  tone?: string;
  d24?: Delta24Data;
  spark?: number[];
  sub?: string;
}

function KpiNumber({ r, size }: { r: KpiRowItem; size: string }) {
  return (
    <div className="min-w-0">
      <SourceKey source={r.src} label={r.label} />
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          data-testid="kpi-value"
          className={`font-black leading-none tracking-tight ${size} ${r.tone || "text-slate-900"}`}
        >
          {r.value}
        </span>
        <Delta24 p={r.d24} />
      </div>
      {r.sub ? (
        <div className="mt-1 truncate text-xs text-slate-500" title={r.sub}>
          {r.sub}
        </div>
      ) : null}
    </div>
  );
}

function KpiCard({
  title,
  rows,
  days,
  until,
  testId,
}: {
  title: string;
  rows: KpiRowItem[];
  days: string[];
  until: string;
  testId: string;
}) {
  const dual = rows.length > 1;
  return (
    <article
      data-testid={testId}
      className="relative overflow-hidden rounded-[12px] border border-[#e4eae9] bg-white p-4 flex h-full flex-col shadow-2xs"
    >
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </div>

      {dual ? (
        <div className="mt-2 grid flex-1 grid-cols-2 divide-x divide-slate-200">
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`flex min-w-0 flex-col justify-between gap-2 ${
                i ? "pl-3" : "pr-3"
              }`}
            >
              <KpiNumber r={r} size="text-2xl sm:text-3xl xl:text-4xl" />
              {r.spark && r.spark.length ? (
                <KpiSpark src={r.src} values={r.spark} days={days} className="h-10" />
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 flex flex-1 items-center gap-3 sm:gap-4">
          {rows.map((r) => (
            <React.Fragment key={r.label}>
              <div className="shrink-0 max-w-[58%] sm:max-w-none">
                <KpiNumber r={r} size="text-3xl sm:text-5xl" />
              </div>
              {r.spark && r.spark.length ? (
                <KpiSpark src={r.src} values={r.spark} days={days} className="h-16 sm:h-20" />
              ) : null}
            </React.Fragment>
          ))}
        </div>
      )}

      {days.length ? (
        <div className="mt-2 text-[10px] text-slate-400" data-testid="kpi-until">
          Tren mingguan sepanjang periode filter &middot; data s.d. {dmy(until)}
        </div>
      ) : null}
    </article>
  );
}

export default function ExecutiveSummary({
  sumber = "all",
  startYear = 2026,
  startWeek = 1,
  endYear = 2026,
  endWeek = 45,
  selectedProvince = "Semua provinsi",
  selectedDisease = "Semua penyakit",
}: ExecutiveSummaryProps) {
  const { header, kpi, kpiTrend } = SKDR_RINGKASAN_SUMMARY;
  const days = kpiTrend.days;
  const until = kpiTrend.until;

  const showEbs = sumber !== "pe";
  const showPe = sumber !== "ebs";

  const scopeParts = [
    showPe ? `${fmt(header.individualReports)} laporan kasus individu (PE)` : null,
    showEbs ? `${fmt(header.ebsAlertsZoonosis)} alert EBS zoonosis` : null,
  ].filter(Boolean);

  const areaLabel =
    selectedProvince && selectedProvince !== "Semua provinsi"
      ? selectedProvince
      : header.scope;

  const diseaseLabel = selectedDisease || "Semua penyakit";

  const ebsVerifiedPct = kpi.ebs.alerts
    ? ((kpi.ebs.verified / kpi.ebs.alerts) * 100).toFixed(1).replace(".", ",")
    : "—";
  const peVerifiedPct = kpi.pe.cases
    ? ((kpi.pe.verified / kpi.pe.cases) * 100).toFixed(1).replace(".", ",")
    : "—";

  return (
    <section className="w-full space-y-4">
      {/* Section Header */}
      <header className="mb-3 border-b border-[#dde4e3] pb-2">
        <h2 className="text-2xl font-bold leading-8 tracking-[-0.01em] text-[#064540]">
          Ringkasan
        </h2>
      </header>

      {/* Scope Bar */}
      <p className="border-l-2 border-[#63d3c5] pl-3 text-xs sm:text-sm leading-relaxed text-slate-600">
        Menampilkan {scopeParts.join(" dan ")} &middot; {dmy(header.startDate)} &ndash;{" "}
        {dmy(header.endDate)} (M{startWeek}/{startYear} &ndash; M{endWeek}/{endYear}) &middot;{" "}
        {areaLabel} &middot; {diseaseLabel}
        {showEbs ? (
          <span className="text-slate-500">
            {" "}
            (total seluruh alert EBS: {fmt(header.ebsAlertsAll)})
          </span>
        ) : null}
      </p>

      {/* 4 KPI Cards Grid */}
      <div
        className="grid grid-cols-1 items-stretch gap-3 md:auto-rows-fr md:grid-cols-2"
        data-testid="summary-cards"
      >
        {showEbs ? (
          <KpiCard
            testId="kpi-ebs"
            title="SINYAL EBS"
            days={days}
            until={until}
            rows={[
              {
                src: "ebs",
                label: "Alert EBS",
                value: fmt(kpi.ebs.alerts),
                d24: kpiTrend.ebs.d24.alerts,
                spark: kpiTrend.ebs.alerts,
                sub: `${fmt(kpi.ebs.verified)} terverifikasi · ${fmt(kpi.ebs.cases)} kasus dilaporkan`,
              },
            ]}
          />
        ) : null}

        {showPe ? (
          <KpiCard
            testId="kpi-pe"
            title="KASUS PE"
            days={days}
            until={until}
            rows={[
              {
                src: "pe",
                label: "Laporan individu",
                value: fmt(kpi.pe.cases),
                d24: kpiTrend.pe.d24.cases,
                spark: kpiTrend.pe.cases,
                sub: `${fmt(kpi.pe.verified)} terverifikasi/final`,
              },
            ]}
          />
        ) : null}

        <KpiCard
          testId="kpi-deaths"
          title="KEMATIAN"
          days={days}
          until={until}
          rows={[
            ...(showEbs
              ? [
                  {
                    src: "ebs" as const,
                    label: "Dilaporkan di EBS",
                    value: fmt(kpi.ebs.deaths),
                    tone: "text-red-600",
                    d24: kpiTrend.ebs.d24.deaths,
                    spark: kpiTrend.ebs.deaths,
                  },
                ]
              : []),
            ...(showPe
              ? [
                  {
                    src: "pe" as const,
                    label: "Kasus PE meninggal",
                    value: fmt(kpi.pe.deaths),
                    tone: "text-red-600",
                    d24: kpiTrend.pe.d24.deaths,
                    spark: kpiTrend.pe.deaths,
                  },
                ]
              : []),
          ]}
        />

        <KpiCard
          testId="kpi-regions"
          title="PROVINSI TERDAMPAK"
          days={days}
          until={until}
          rows={[
            ...(showEbs
              ? [
                  {
                    src: "ebs" as const,
                    label: "Provinsi dengan sinyal EBS",
                    value: fmt(kpi.ebs.provinces),
                    d24: kpiTrend.ebs.d24.provinces,
                    spark: kpiTrend.ebs.provinces,
                    sub: `${fmt(kpi.ebs.kabkota)} kab/kota`,
                  },
                ]
              : []),
            ...(showPe
              ? [
                  {
                    src: "pe" as const,
                    label: "Provinsi dengan kasus PE",
                    value: fmt(kpi.pe.provinces),
                    d24: kpiTrend.pe.d24.provinces,
                    spark: kpiTrend.pe.provinces,
                    sub: `${fmt(kpi.pe.kabkota)} kab/kota`,
                  },
                ]
              : []),
          ]}
        />

        {sumber !== "all" ? (
          showEbs ? (
            <KpiCard
              testId="kpi-extra"
              title="ALERT TERVERIFIKASI"
              days={[]}
              until={until}
              rows={[
                {
                  src: "ebs",
                  label: "Persentase terverifikasi",
                  value: `${ebsVerifiedPct}%`,
                  sub: `${fmt(kpi.ebs.verified)} / ${fmt(kpi.ebs.alerts)}`,
                },
              ]}
            />
          ) : (
            <KpiCard
              testId="kpi-extra"
              title="KASUS PE TERVERIFIKASI"
              days={[]}
              until={until}
              rows={[
                {
                  src: "pe",
                  label: "Persentase terverifikasi",
                  value: `${peVerifiedPct}%`,
                  sub: `${fmt(kpi.pe.verified)} / ${fmt(kpi.pe.cases)}`,
                },
              ]}
            />
          )
        ) : null}
      </div>

      {/* Footnote */}
      <p className="text-[11px] leading-relaxed text-slate-500">
        * Satu alert EBS bisa berisi lebih dari satu kasus, jadi jumlah alert tidak sama dengan jumlah kasus. Laporan individu baru mulai dikumpulkan, sehingga angkanya wajar lebih kecil dan berbeda dari angka EBS selama masa transisi. Laporan individu = Form PE dengan status Dikirim, Terverifikasi, atau Final. Definisi alert belum disepakati; sementara 1 laporan EBS = 1 alert.
      </p>
    </section>
  );
}
