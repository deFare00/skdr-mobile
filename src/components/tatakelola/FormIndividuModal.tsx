"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Check,
  ChevronsRight,
  TriangleAlert,
  ArrowLeft,
  ArrowRight,
  Send,
  ClipboardList,
  CircleAlert,
  Lock,
} from "lucide-react";
import {
  IndividuFormValues,
  IndividuRecord,
  IBS_PENYAKIT_24,
  JENIS_UNIT_OPTIONS,
  PROVINSI_OPTIONS,
  KABKOTA_BY_PROVINSI,
  KECAMATAN_OPTIONS,
  UNIT_PELAPOR_OPTIONS,
  KELAMIN_OPTIONS,
  PEKERJAAN_OPTIONS,
  STATUS_AKHIR_OPTIONS,
  STATUS_IMUNISASI_OPTIONS,
  createEmptyIndividuValues,
  computeImt,
  getImtCategory,
  getWeekRangeLabel,
  formatPenyakitLabel,
  formatUmurRingkas,
  validateIndividuValues,
} from "@/data/formIndividuData";

interface FormIndividuModalProps {
  isOpen: boolean;
  mode: "create" | "edit" | "view";
  initialRecord?: IndividuRecord | null;
  username?: string;
  onClose: () => void;
  onSaveDraft: (values: IndividuFormValues, existingId?: number) => void;
  onSubmitReport: (values: IndividuFormValues, existingId?: number) => void;
}

const STEP_META = [
  { id: "s1" as const, title: "Unit & Periode" },
  { id: "s2" as const, title: "Info Pasien" },
  { id: "s3" as const, title: "Penyakit" },
  { id: "s4" as const, title: "Pemeriksaan" },
  { id: "s5" as const, title: "Tinjau & Kirim" },
];

const AutoBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-1.5 py-0.5 text-[9.5px] font-bold text-[#007067]">
    <span className="w-1.5 h-1.5 rounded-full bg-[#007067]" />
    Otomatis
  </span>
);

const toIsoOffset = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function FormIndividuModal({
  isOpen,
  mode,
  initialRecord,
  username = "Administrator",
  onClose,
  onSaveDraft,
  onSubmitReport,
}: FormIndividuModalProps) {
  const isViewOnly = mode === "view" || initialRecord?.status === "dikirim";

  const [stepIdx, setStepIdx] = useState<number>(0);
  const [values, setValues] = useState<IndividuFormValues>(
    createEmptyIndividuValues(username)
  );
  const [showErrors, setShowErrors] = useState<boolean>(false);

  // Sync state when modal opens
  useEffect(() => {
    if (!isOpen) return;
    if (initialRecord) {
      setValues({ ...initialRecord.data });
      setStepIdx(mode === "view" ? 4 : 0);
    } else {
      setValues(createEmptyIndividuValues(username));
      setStepIdx(0);
    }
    setShowErrors(false);
  }, [isOpen, initialRecord, mode, username]);

  if (!isOpen) return null;

  const updateField = <K extends keyof IndividuFormValues>(
    key: K,
    val: IndividuFormValues[K]
  ) => {
    if (isViewOnly) return;
    setValues((prev) => {
      const next = { ...prev, [key]: val };
      if (key === "tinggi" || key === "berat") {
        next.imt = computeImt(
          key === "tinggi" ? String(val) : next.tinggi,
          key === "berat" ? String(val) : next.berat
        );
      }
      if (key === "provinsi") {
        const kabs = KABKOTA_BY_PROVINSI[String(val)] || [
          `Kota/Kab. di ${val}`,
        ];
        next.kabkota = kabs[0];
        next.kecamatan = "";
      }
      if (key === "status_akhir" && val !== "Meninggal") {
        next.tgl_meninggal = "";
      }
      return next;
    });
  };

  const { errors, stepProgress, totalDone, totalRequired, pct } =
    validateIndividuValues(values);

  const stepIndexMap: Record<string, number> = {
    s1: 0,
    s2: 1,
    s3: 2,
    s4: 3,
    s5: 4,
  };

  const jumpToFirstInvalid = () => {
    if (!errors.length) return;
    const first = errors[0];
    setStepIdx(stepIndexMap[first.step] ?? 0);
    setShowErrors(true);
  };

  const handleSubmit = () => {
    if (errors.length > 0) {
      setShowErrors(true);
      jumpToFirstInvalid();
      return;
    }
    onSubmitReport(values, initialRecord?.id);
  };

  const fieldCls =
    "w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#007067] focus:ring-2 focus:ring-teal-600/20 disabled:bg-slate-50 disabled:text-slate-500";
  const labelCls =
    "flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-1";
  const sectionCardCls =
    "rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3.5";

  const fieldError = (key: keyof IndividuFormValues) =>
    showErrors ? errors.find((e) => e.key === key)?.msg : undefined;

  const kabkotaChoices =
    KABKOTA_BY_PROVINSI[values.provinsi] ||
    (values.kabkota ? [values.kabkota] : ["Kota/Kabupaten Utama"]);

  const imtCat = getImtCategory(values.imt);
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#f7f9f9] w-full sm:max-w-2xl h-[93dvh] sm:h-auto sm:max-h-[90dvh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer shrink-0"
              aria-label="Tutup form"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#047a6f]">
                SKDR-IBS &middot; FORM INDIVIDU
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                Form Individu (IBS)
              </h3>
              <p className="text-[10.5px] text-slate-500 truncate">
                {initialRecord
                  ? `${initialRecord.no_laporan} · ${
                      initialRecord.status === "dikirim"
                        ? "Terkirim (Hanya baca)"
                        : "Mode Edit Draf"
                    }`
                  : "Draf baru (nomor dibuat saat pertama tersimpan)"}
              </p>
            </div>
          </div>

          {!isViewOnly && (
            <button
              type="button"
              onClick={() => onSaveDraft(values, initialRecord?.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer shrink-0"
            >
              <Save className="w-3.5 h-3.5 text-[#007067]" />
              <span className="hidden min-[380px]:inline">Simpan Draf</span>
            </button>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 sm:p-5 space-y-4">
          {/* Progress & 5-Step Stepper Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500">
                KEMAJUAN
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-600">
                  {totalDone}/{totalRequired} wajib terisi &middot; {pct}%
                </span>
                {!isViewOnly && (
                  <button
                    type="button"
                    onClick={jumpToFirstInvalid}
                    disabled={errors.length === 0}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10.5px] font-bold transition cursor-pointer ${
                      errors.length > 0
                        ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default"
                    }`}
                  >
                    {errors.length > 0 ? (
                      <>
                        <ChevronsRight className="w-3 h-3" />
                        <span>Isian belum valid ({errors.length})</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Semua isian valid</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Gradient Progress Bar */}
            <div className="flex items-center gap-2.5">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background:
                      "linear-gradient(90deg, #0060A9, #00A3AD, #10b981)",
                  }}
                />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-700 w-9 text-right">
                {pct}%
              </span>
            </div>

            {/* 5-Step Horizontal Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {STEP_META.map((st, idx) => {
                const prog = stepProgress[idx];
                const isDone = prog.errCount === 0;
                const isActive = idx === stepIdx;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStepIdx(idx)}
                    className={`relative flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition cursor-pointer shrink-0 ${
                      isActive
                        ? "border-[#007067] bg-teal-50/70 ring-1 ring-[#007067]/30"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`relative flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold shrink-0 ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isActive
                          ? "bg-[#007067] text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      ) : (
                        idx + 1
                      )}
                      {!isDone && (
                        <span className="absolute -right-1.5 -top-1.5 inline-flex items-center rounded-full bg-amber-500 px-1 text-[8.5px] font-bold leading-3.5 text-white shadow">
                          {prog.errCount}
                        </span>
                      )}
                    </span>
                    <div className="leading-tight pr-1">
                      <div
                        className={`text-[11px] font-bold whitespace-nowrap ${
                          isActive ? "text-[#007067]" : "text-slate-800"
                        }`}
                      >
                        {st.title}
                      </div>
                      <div
                        className={`text-[9.5px] whitespace-nowrap ${
                          isDone ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {st.id === "s5"
                          ? isDone
                            ? "siap dikirim"
                            : "periksa"
                          : prog.total
                          ? `${prog.done}/${prog.total} wajib`
                          : "tanpa isian wajib"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 1: Unit & Periode */}
          {stepIdx === 0 && (
            <div className="space-y-4">
              <div className={sectionCardCls}>
                <h4 className="text-sm font-extrabold text-[#064540] border-b border-slate-100 pb-2">
                  Unit pelapor
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={labelCls}>
                      <span>
                        Jenis Unit<span className="text-red-500">*</span>
                      </span>
                      <AutoBadge />
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={values.jenis_unit}
                      onChange={(e) => updateField("jenis_unit", e.target.value)}
                      className={fieldCls}
                    >
                      {JENIS_UNIT_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Biasanya Puskesmas. (Form resmi: Id Unit)
                    </p>
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span>
                        Provinsi<span className="text-red-500">*</span>
                      </span>
                      <AutoBadge />
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={values.provinsi}
                      onChange={(e) => updateField("provinsi", e.target.value)}
                      className={fieldCls}
                    >
                      {PROVINSI_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span>
                        Kab/Kota<span className="text-red-500">*</span>
                      </span>
                      <AutoBadge />
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={values.kabkota}
                      onChange={(e) => updateField("kabkota", e.target.value)}
                      className={fieldCls}
                    >
                      {kabkotaChoices.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span>Kecamatan</span>
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={values.kecamatan}
                      onChange={(e) => updateField("kecamatan", e.target.value)}
                      className={fieldCls}
                    >
                      <option value="">Cari kecamatan...</option>
                      {KECAMATAN_OPTIONS.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Opsional &mdash; mempersempit daftar Puskesmas.
                    </p>
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span>
                        Puskesmas/Unit<span className="text-red-500">*</span>
                      </span>
                      <AutoBadge />
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={values.unit_pelapor}
                      onChange={(e) =>
                        updateField("unit_pelapor", e.target.value)
                      }
                      className={fieldCls}
                    >
                      {UNIT_PELAPOR_OPTIONS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span>
                        Nama Petugas<span className="text-red-500">*</span>
                      </span>
                      <AutoBadge />
                    </label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={values.petugas}
                      onChange={(e) => updateField("petugas", e.target.value)}
                      className={fieldCls}
                      placeholder="Nama petugas pelapor"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Default nama akun Anda.
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls}>
                      <span>Telp Petugas</span>
                    </label>
                    <input
                      type="tel"
                      disabled={isViewOnly}
                      value={values.hp_petugas}
                      onChange={(e) =>
                        updateField("hp_petugas", e.target.value)
                      }
                      className={fieldCls}
                      placeholder="08xx atau +628xx"
                    />
                  </div>
                </div>
              </div>

              <div className={sectionCardCls}>
                <h4 className="text-sm font-extrabold text-[#064540] border-b border-slate-100 pb-2">
                  Periode
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={labelCls}>
                      <span>
                        Tahun<span className="text-red-500">*</span>
                      </span>
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={values.tahun}
                      onChange={(e) =>
                        updateField("tahun", Number(e.target.value))
                      }
                      className={fieldCls}
                    >
                      <option value={2026}>2026</option>
                      <option value={2025}>2025</option>
                      <option value={2024}>2024</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span>
                        Minggu Epid<span className="text-red-500">*</span>
                      </span>
                      <AutoBadge />
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={values.minggu}
                      onChange={(e) =>
                        updateField("minggu", Number(e.target.value))
                      }
                      className={fieldCls}
                    >
                      {weeks.map((w) => (
                        <option key={w} value={w}>
                          Minggu {w} ({getWeekRangeLabel(w, values.tahun)})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Default: minggu laporan berjalan. Tanggal Pemeriksaan
                      sebaiknya di dalam minggu ini.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Info Pasien */}
          {stepIdx === 1 && (
            <div className={sectionCardCls}>
              <h4 className="text-sm font-extrabold text-[#064540] border-b border-slate-100 pb-2">
                Identitas pasien
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className={labelCls}>
                    <span>
                      Nama Pasien<span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    disabled={isViewOnly}
                    value={values.nama_pasien}
                    onChange={(e) => updateField("nama_pasien", e.target.value)}
                    className={`${fieldCls} ${
                      fieldError("nama_pasien") ? "border-red-400" : ""
                    }`}
                    placeholder="Masukkan nama lengkap pasien"
                  />
                  {fieldError("nama_pasien") && (
                    <p className="text-[10.5px] text-red-600 font-semibold mt-1">
                      {fieldError("nama_pasien")}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>
                    <span>No Epid</span>
                  </label>
                  <input
                    type="text"
                    disabled={isViewOnly}
                    value={values.no_epid}
                    onChange={(e) => updateField("no_epid", e.target.value)}
                    className={fieldCls}
                    placeholder="Nomor epidemiologi (bila ada)"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Opsional &mdash; nomor epidemiologi bila sudah ada.
                  </p>
                </div>

                {/* Umur: tahun / bulan / hari */}
                <div>
                  <label className={labelCls}>
                    <span>
                      Umur<span className="text-red-500">*</span>
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={150}
                        disabled={isViewOnly}
                        value={values.umur_tahun}
                        onChange={(e) =>
                          updateField("umur_tahun", e.target.value)
                        }
                        placeholder="—"
                        className={`${fieldCls} pr-10 text-center`}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
                        tahun
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={11}
                        disabled={isViewOnly}
                        value={values.umur_bulan}
                        onChange={(e) =>
                          updateField("umur_bulan", e.target.value)
                        }
                        placeholder="—"
                        className={`${fieldCls} pr-10 text-center`}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
                        bulan
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        disabled={isViewOnly}
                        value={values.umur_hari}
                        onChange={(e) =>
                          updateField("umur_hari", e.target.value)
                        }
                        placeholder="—"
                        className={`${fieldCls} pr-8 text-center`}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
                        hari
                      </span>
                    </div>
                  </div>
                  {fieldError("umur_tahun") ? (
                    <p className="text-[10.5px] text-red-600 font-semibold mt-1">
                      {fieldError("umur_tahun")}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                      Isi minimal satu: tahun, bulan, atau hari. Bayi &lt; 1
                      tahun: kosongkan/0 tahun lalu isi bulan atau hari.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>
                    <span>
                      Jenis Kelamin<span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    disabled={isViewOnly}
                    value={values.kelamin}
                    onChange={(e) => updateField("kelamin", e.target.value)}
                    className={`${fieldCls} ${
                      fieldError("kelamin") ? "border-red-400" : ""
                    }`}
                  >
                    <option value="">- Pilih -</option>
                    {KELAMIN_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {fieldError("kelamin") && (
                    <p className="text-[10.5px] text-red-600 font-semibold mt-1">
                      {fieldError("kelamin")}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>
                    <span>Pekerjaan</span>
                  </label>
                  <select
                    disabled={isViewOnly}
                    value={values.pekerjaan}
                    onChange={(e) => updateField("pekerjaan", e.target.value)}
                    className={fieldCls}
                  >
                    <option value="">- Pilih -</option>
                    {PEKERJAAN_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>
                    <span>Alamat</span>
                  </label>
                  <textarea
                    rows={3}
                    maxLength={500}
                    disabled={isViewOnly}
                    value={values.alamat}
                    onChange={(e) => updateField("alamat", e.target.value)}
                    placeholder="Alamat domisili pasien (jalan, RT/RW, desa/kelurahan)..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#007067] focus:ring-2 focus:ring-teal-600/20 disabled:bg-slate-50"
                  />
                  <div className="text-right text-[10px] text-slate-400">
                    {values.alamat.length}/500
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Penyakit */}
          {stepIdx === 2 && (
            <div className="space-y-4">
              <div className={sectionCardCls}>
                <h4 className="text-sm font-extrabold text-[#064540] border-b border-slate-100 pb-2">
                  Penyakit agregat &amp; pemeriksaan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>
                      <span>
                        Penyakit Agregat<span className="text-red-500">*</span>
                      </span>
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={values.penyakit}
                      onChange={(e) => updateField("penyakit", e.target.value)}
                      className={`${fieldCls} ${
                        fieldError("penyakit") ? "border-red-400" : ""
                      }`}
                    >
                      <option value="">
                        Cari dari 24 penyakit (nama atau kode)...
                      </option>
                      {IBS_PENYAKIT_24.map((p) => (
                        <option key={p.kodeSms} value={p.kodeSms}>
                          {p.kodeSms} &mdash; {p.nama}
                        </option>
                      ))}
                    </select>
                    {fieldError("penyakit") ? (
                      <p className="text-[10.5px] text-red-600 font-semibold mt-1">
                        {fieldError("penyakit")}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-1">
                        Salah satu dari 24 penyakit tabel agregat IBS (kode SMS
                        &mdash; nama).
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span>
                        Tanggal Pemeriksaan
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="date"
                      disabled={isViewOnly}
                      value={values.tgl_periksa}
                      onChange={(e) =>
                        updateField("tgl_periksa", e.target.value)
                      }
                      className={`${fieldCls} ${
                        fieldError("tgl_periksa") ? "border-red-400" : ""
                      }`}
                    />
                    {!isViewOnly && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {[
                          { label: "Hari ini", offset: 0 },
                          { label: "Kemarin", offset: 1 },
                          { label: "2 hari lalu", offset: 2 },
                        ].map((s) => (
                          <button
                            key={s.label}
                            type="button"
                            onClick={() =>
                              updateField("tgl_periksa", toIsoOffset(s.offset))
                            }
                            className="rounded-full border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 cursor-pointer"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {fieldError("tgl_periksa") && (
                      <p className="text-[10.5px] text-red-600 font-semibold mt-1">
                        {fieldError("tgl_periksa")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span>Status Akhir</span>
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={values.status_akhir}
                      onChange={(e) =>
                        updateField("status_akhir", e.target.value)
                      }
                      className={fieldCls}
                    >
                      <option value="">- Pilih -</option>
                      {STATUS_AKHIR_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {values.status_akhir === "Meninggal" && (
                    <div>
                      <label className={labelCls}>
                        <span>
                          Tanggal Meninggal
                          <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <input
                        type="date"
                        disabled={isViewOnly}
                        value={values.tgl_meninggal}
                        onChange={(e) =>
                          updateField("tgl_meninggal", e.target.value)
                        }
                        className={`${fieldCls} ${
                          fieldError("tgl_meninggal") ? "border-red-400" : ""
                        }`}
                      />
                      {fieldError("tgl_meninggal") && (
                        <p className="text-[10.5px] text-red-600 font-semibold mt-1">
                          {fieldError("tgl_meninggal")}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className={labelCls}>
                      <span>Status Imunisasi</span>
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={values.status_imunisasi}
                      onChange={(e) =>
                        updateField("status_imunisasi", e.target.value)
                      }
                      className={fieldCls}
                    >
                      <option value="">- Pilih -</option>
                      {STATUS_IMUNISASI_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className={sectionCardCls}>
                <h4 className="text-sm font-extrabold text-[#064540] border-b border-slate-100 pb-2">
                  Keluhan &amp; diagnosa
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={labelCls}>
                      <span>Keluhan Utama</span>
                    </label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={values.keluhan}
                      onChange={(e) => updateField("keluhan", e.target.value)}
                      className={fieldCls}
                      placeholder="Contoh: demam 3 hari, mual"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span>Lama Sakit</span>
                    </label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={values.lama_sakit}
                      onChange={(e) =>
                        updateField("lama_sakit", e.target.value)
                      }
                      className={fieldCls}
                      placeholder="Contoh: 3 hari"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span>ICD-X</span>
                    </label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={values.icdx}
                      onChange={(e) => updateField("icdx", e.target.value)}
                      className={fieldCls}
                      placeholder="Contoh: A09"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Opsional &mdash; kode ICD-10.
                    </p>
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span>Diagnosa</span>
                    </label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={values.diagnosa}
                      onChange={(e) => updateField("diagnosa", e.target.value)}
                      className={fieldCls}
                      placeholder="Diagnosis klinis pasien"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Pemeriksaan (Tanda vital + SOAP) */}
          {stepIdx === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Semua opsional. Angka desimal boleh pakai koma (36,5).
              </p>

              <div className={sectionCardCls}>
                <h4 className="text-sm font-extrabold text-[#064540] border-b border-slate-100 pb-2">
                  Tanda vital &amp; antropometri
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Tinggi Badan</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        disabled={isViewOnly}
                        value={values.tinggi}
                        onChange={(e) => updateField("tinggi", e.target.value)}
                        className={`${fieldCls} pr-9`}
                        placeholder="—"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
                        cm
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Berat Badan</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        disabled={isViewOnly}
                        value={values.berat}
                        onChange={(e) => updateField("berat", e.target.value)}
                        className={`${fieldCls} pr-9`}
                        placeholder="—"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
                        kg
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className={labelCls}>
                      <span>IMT</span>
                      {imtCat && (
                        <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[9.5px] font-bold text-[#007067]">
                          {imtCat}
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={values.imt}
                        className={`${fieldCls} pr-12 bg-slate-50 text-slate-600`}
                        placeholder="Otomatis"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> kg/m²
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Suhu</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        disabled={isViewOnly}
                        value={values.suhu}
                        onChange={(e) => updateField("suhu", e.target.value)}
                        className={`${fieldCls} pr-9`}
                        placeholder="—"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
                        °C
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Sistole</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        disabled={isViewOnly}
                        value={values.sistole}
                        onChange={(e) => updateField("sistole", e.target.value)}
                        className={`${fieldCls} pr-12`}
                        placeholder="—"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
                        mmHg
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Diastole</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        disabled={isViewOnly}
                        value={values.diastole}
                        onChange={(e) =>
                          updateField("diastole", e.target.value)
                        }
                        className={`${fieldCls} pr-12`}
                        placeholder="—"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
                        mmHg
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={sectionCardCls}>
                <h4 className="text-sm font-extrabold text-[#064540] border-b border-slate-100 pb-2">
                  Catatan SOAP
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={labelCls}>SOAP Subjective</label>
                    <textarea
                      rows={2}
                      maxLength={500}
                      disabled={isViewOnly}
                      value={values.soap_s}
                      onChange={(e) => updateField("soap_s", e.target.value)}
                      placeholder="Keluhan menurut pasien..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#007067]"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>SOAP Objective</label>
                    <textarea
                      rows={2}
                      maxLength={500}
                      disabled={isViewOnly}
                      value={values.soap_o}
                      onChange={(e) => updateField("soap_o", e.target.value)}
                      placeholder="Hasil pemeriksaan fisik/penunjang..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#007067]"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>SOAP Assessment</label>
                    <textarea
                      rows={2}
                      maxLength={500}
                      disabled={isViewOnly}
                      value={values.soap_a}
                      onChange={(e) => updateField("soap_a", e.target.value)}
                      placeholder="Penilaian / diagnosis kerja..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#007067]"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>SOAP Planning</label>
                    <textarea
                      rows={2}
                      maxLength={500}
                      disabled={isViewOnly}
                      value={values.soap_p}
                      onChange={(e) => updateField("soap_p", e.target.value)}
                      placeholder="Rencana terapi / rujukan / edukasi..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#007067]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Tinjau & Kirim */}
          {stepIdx === 4 && (
            <div className="space-y-3.5">
              {/* Status Laporan Summary Card */}
              <div className={sectionCardCls}>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <ClipboardList className="w-4 h-4 text-[#007067]" />
                    <span>Status laporan</span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      initialRecord?.status === "dikirim"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {initialRecord
                      ? initialRecord.status === "dikirim"
                        ? "Terkirim"
                        : "Draf"
                      : "Belum tersimpan"}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <dt className="text-[10px] text-slate-400">Nomor</dt>
                    <dd className="font-mono font-bold text-[#007067]">
                      {initialRecord?.no_laporan || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-400">Kelengkapan</dt>
                    <dd className="font-bold text-slate-800">
                      {totalDone}/{totalRequired} wajib
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-400">Periode</dt>
                    <dd className="font-semibold text-slate-700">
                      Minggu {values.minggu}/{values.tahun} (
                      {getWeekRangeLabel(values.minggu, values.tahun)})
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-400">Petugas</dt>
                    <dd className="font-semibold text-slate-700">
                      {values.petugas || "—"}
                    </dd>
                  </div>
                </dl>

                {errors.length > 0 && !isViewOnly && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                      <CircleAlert className="w-4 h-4 shrink-0" />
                      <span>
                        {errors.length} isian wajib belum lengkap sebelum dikirim:
                      </span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-amber-800">
                      {errors.map((e) => (
                        <li key={e.key}>
                          <button
                            type="button"
                            onClick={() => {
                              setStepIdx(stepIndexMap[e.step] ?? 0);
                              setShowErrors(true);
                            }}
                            className="underline font-semibold hover:text-amber-950 cursor-pointer text-left"
                          >
                            &bull; {e.msg} (Klik untuk isi)
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Preview Summary Cards */}
              <div className={sectionCardCls}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ringkasan Pasien &amp; Diagnosa
                </h4>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <dt className="text-[10px] text-slate-400">Nama Pasien</dt>
                    <dd className="font-bold text-slate-900">
                      {values.nama_pasien || "—"}{" "}
                      <span className="font-normal text-slate-500">
                        ({values.kelamin || "—"} &middot;{" "}
                        {formatUmurRingkas(values)})
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-400">
                      Penyakit Agregat
                    </dt>
                    <dd className="font-bold text-[#007067]">
                      {formatPenyakitLabel(values.penyakit)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-400">
                      Tanggal Pemeriksaan
                    </dt>
                    <dd className="font-mono font-semibold text-slate-800">
                      {values.tgl_periksa || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-400">
                      Status Akhir / Imunisasi
                    </dt>
                    <dd className="font-semibold text-slate-800">
                      {values.status_akhir || "—"} /{" "}
                      {values.status_imunisasi || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-400">
                      Unit Pelapor &amp; Wilayah
                    </dt>
                    <dd className="font-semibold text-slate-800">
                      {values.unit_pelapor} &middot; {values.kabkota}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-400">
                      Tanda Vital &amp; Diagnosa
                    </dt>
                    <dd className="font-semibold text-slate-800">
                      {values.tinggi ? `TB ${values.tinggi}cm ` : ""}
                      {values.berat ? `BB ${values.berat}kg ` : ""}
                      {values.imt ? `(IMT ${values.imt}) ` : ""}
                      {values.diagnosa || values.keluhan || "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Footer Buttons inside Modal */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            disabled={stepIdx === 0}
            onClick={() => setStepIdx((s) => Math.max(0, s - 1))}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sebelumnya</span>
          </button>

          <span className="text-[11px] font-semibold text-slate-500">
            {stepIdx + 1}/{STEP_META.length} &middot; {pct}%
          </span>

          {stepIdx < STEP_META.length - 1 ? (
            <button
              type="button"
              onClick={() => setStepIdx((s) => Math.min(4, s + 1))}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#007067] hover:bg-[#005e57] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs cursor-pointer"
            >
              <span>{stepIdx === 3 ? "Tinjau" : "Berikutnya"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : isViewOnly ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#007067] hover:bg-[#005e57] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs cursor-pointer"
            >
              <span>Tutup</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#007067] hover:bg-[#005e57] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Laporan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
