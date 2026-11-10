"use client";

import React, { useState, useEffect } from "react";
import {
  FilePlus2,
  RefreshCw,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  IndividuFormValues,
  IndividuRecord,
  INITIAL_INDIVIDU_RECORDS,
  formatPenyakitLabel,
  formatUmurRingkas,
  getWeekRangeLabel,
  validateIndividuValues,
} from "@/data/formIndividuData";
import FormIndividuModal from "./FormIndividuModal";

const STORAGE_KEY = "skdr_mobile_form_individu_v1";

const nowWibString = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
};

const SEX_SHORT: Record<string, string> = {
  Pria: "L",
  Wanita: "P",
};

interface FormIndividuSectionProps {
  username?: string;
}

export default function FormIndividuSection({
  username = "Administrator",
}: FormIndividuSectionProps) {
  const [records, setRecords] = useState<IndividuRecord[]>(
    INITIAL_INDIVIDU_RECORDS
  );
  const [hydrated, setHydrated] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draf" | "dikirim">(
    "all"
  );
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [refreshing, setRefreshing] = useState(false);

  // Modal state
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "create" | "edit" | "view";
    record: IndividuRecord | null;
  }>({ open: false, mode: "create", record: null });

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<IndividuRecord | null>(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string>("");

  // Load persisted CRUD data on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecords(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
    setHydrated(true);
  }, []);

  // Persist CRUD updates
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records, hydrated]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2800);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 350);
  };

  const generateNextNumber = (list: IndividuRecord[]) => {
    const maxId = list.reduce((m, r) => Math.max(m, r.id), 0);
    const nextId = maxId + 1;
    return {
      id: nextId,
      no: `IND-2026-${String(nextId).padStart(6, "0")}`,
    };
  };

  const handleSaveDraft = (values: IndividuFormValues, existingId?: number) => {
    const updatedAt = nowWibString();
    const author = username === "admin" ? "Administrator" : username;

    if (existingId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === existingId
            ? { ...r, status: "draf", updated_at: updatedAt, data: values }
            : r
        )
      );
      showToast("Draf pasien berhasil diperbarui");
    } else {
      const { id, no } = generateNextNumber(records);
      const created: IndividuRecord = {
        id,
        no_laporan: no,
        status: "draf",
        updated_at: updatedAt,
        created_by_name: author,
        data: values,
      };
      setRecords((prev) => [created, ...prev]);
      showToast(`Draf ${no} berhasil disimpan`);
    }
    setModalState({ open: false, mode: "create", record: null });
  };

  const handleSubmitReport = (
    values: IndividuFormValues,
    existingId?: number
  ) => {
    const updatedAt = nowWibString();
    const author = username === "admin" ? "Administrator" : username;

    if (existingId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === existingId
            ? { ...r, status: "dikirim", updated_at: updatedAt, data: values }
            : r
        )
      );
      showToast("Laporan pasien berhasil dikirim");
    } else {
      const { id, no } = generateNextNumber(records);
      const created: IndividuRecord = {
        id,
        no_laporan: no,
        status: "dikirim",
        updated_at: updatedAt,
        created_by_name: author,
        data: values,
      };
      setRecords((prev) => [created, ...prev]);
      showToast(`Laporan ${no} berhasil dikirim`);
    }
    setModalState({ open: false, mode: "create", record: null });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setRecords((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    showToast(`Draf ${deleteTarget.no_laporan} dihapus`);
    setDeleteTarget(null);
  };

  // Counts by status
  const allCount = records.length;
  const drafCount = records.filter((r) => r.status === "draf").length;
  const sentCount = records.filter((r) => r.status === "dikirim").length;

  // Filtered list
  const filtered = records.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      r.no_laporan.toLowerCase().includes(q) ||
      r.data.nama_pasien.toLowerCase().includes(q) ||
      r.data.no_epid.toLowerCase().includes(q) ||
      r.data.diagnosa.toLowerCase().includes(q) ||
      formatPenyakitLabel(r.data.penyakit).toLowerCase().includes(q) ||
      r.data.unit_pelapor.toLowerCase().includes(q) ||
      r.data.kabkota.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * perPage;
  const pageItems = filtered.slice(startIdx, startIdx + perPage);

  return (
    <section className="space-y-4">
      {/* Header matching screenshot #1 adapted for mobile */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#dde4e3] pb-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#047a6f]">
            SKDR-IBS &middot; FORM INDIVIDU
          </div>
          <h2 className="mt-0.5 text-xl sm:text-2xl font-bold text-[#064540]">
            Form Individu
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Data per pasien (SKDR-IBS) &mdash; penyakit agregat, pemeriksaan,
            dan catatan SOAP.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Muat ulang</span>
          </button>

          <button
            type="button"
            data-testid="lap-add"
            onClick={() =>
              setModalState({ open: true, mode: "create", record: null })
            }
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#007067] hover:bg-[#005e57] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-xs cursor-pointer transition-colors active:scale-[0.99]"
          >
            <FilePlus2 className="h-4 w-4" />
            <span>PASIEN BARU</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMsg ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      ) : null}

      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-[#e4eae9] bg-white p-3 shadow-2xs space-y-2.5 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nomor, pasien, No Epid, diagnosa, unit..."
            className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#007067] focus:bg-white"
          />
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            {(
              [
                { id: "all", label: "Semua", count: allCount },
                { id: "draf", label: "Draf", count: drafCount },
                { id: "dikirim", label: "Terkirim", count: sentCount },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setStatusFilter(s.id);
                  setPage(1);
                }}
                className={`rounded-full border px-3 py-1 text-[11px] font-bold transition cursor-pointer ${
                  statusFilter === s.id
                    ? "border-[#007067] bg-[#007067] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {s.label} {s.count}
              </button>
            ))}
          </div>

          <div className="text-xs font-medium text-slate-500">
            Total:{" "}
            <span className="font-bold text-slate-800">{filtered.length}</span>
          </div>
        </div>
      </div>

      {/* Patient Cards List (Mobile-aligned CRUD view matching all columns from reference) */}
      <div className="space-y-2.5">
        {pageItems.length === 0 ? (
          <div className="rounded-2xl border border-[#e4eae9] bg-white p-8 text-center text-xs text-slate-400 shadow-2xs">
            Belum ada data pasien yang sesuai filter pencarian.
          </div>
        ) : (
          pageItems.map((r) => {
            const val = validateIndividuValues(r.data);
            const isDraft = r.status === "draf";
            const sexShort = r.data.kelamin
              ? SEX_SHORT[r.data.kelamin] || r.data.kelamin
              : null;
            const umurStr = formatUmurRingkas(r.data);
            const subIdentity = [
              sexShort,
              umurStr !== "—" ? umurStr : null,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <article
                key={r.id}
                className="rounded-2xl border border-[#e4eae9] bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5"
              >
                {/* Top Row: Nomor + Status + Kelengkapan */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <button
                    type="button"
                    onClick={() =>
                      setModalState({
                        open: true,
                        mode: isDraft ? "edit" : "view",
                        record: r,
                      })
                    }
                    className="font-mono text-xs font-bold text-[#007067] hover:underline cursor-pointer"
                  >
                    {r.no_laporan}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                        isDraft
                          ? "border-slate-200 bg-slate-50 text-slate-600"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {isDraft ? "Draf" : "Terkirim"}
                    </span>

                    {val.errors.length === 0 ? (
                      <span className="text-[10.5px] font-bold text-emerald-600">
                        Lengkap
                      </span>
                    ) : (
                      <span className="text-[10.5px] font-bold text-amber-600">
                        {val.errors.length} belum valid
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Content: Pasien + Penyakit + Tgl + Periode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {r.data.nama_pasien || "—"}
                    </div>
                    {subIdentity && (
                      <div className="text-[11px] text-slate-500">
                        {subIdentity}
                        {r.data.no_epid ? ` · Epid: ${r.data.no_epid}` : ""}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="font-bold text-slate-800">
                      {formatPenyakitLabel(r.data.penyakit)}
                    </div>
                    {r.data.status_akhir === "Meninggal" && (
                      <span className="text-[10.5px] font-bold text-red-600">
                        Meninggal
                      </span>
                    )}
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Periksa:{" "}
                      <span className="font-mono font-semibold text-slate-700">
                        {r.data.tgl_periksa || "—"}
                      </span>{" "}
                      &middot; Minggu {r.data.minggu}/{r.data.tahun} (
                      {getWeekRangeLabel(r.data.minggu, r.data.tahun)})
                    </div>
                  </div>
                </div>

                {/* Unit & Wilayah */}
                <div className="rounded-xl bg-[#f7f9f9] px-3 py-2 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">
                    {r.data.unit_pelapor}
                  </span>{" "}
                  &middot; {r.data.kabkota} &middot; Petugas:{" "}
                  {r.data.petugas || "—"}
                </div>

                {/* Footer Row: Diperbarui + CRUD Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="text-[10.5px] text-slate-400">
                    <span className="font-mono text-slate-500">
                      {r.updated_at} WIB
                    </span>{" "}
                    &middot; {r.created_by_name}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setModalState({ open: true, mode: "view", record: r })
                      }
                      title="Lihat (hanya baca)"
                      aria-label={`Lihat ${r.no_laporan}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>

                    {isDraft && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setModalState({
                              open: true,
                              mode: "edit",
                              record: r,
                            })
                          }
                          title="Edit / Lanjutkan"
                          aria-label={`Edit ${r.no_laporan}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-teal-200 bg-teal-50/40 text-[#007067] hover:bg-teal-50 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(r)}
                          title="Hapus draf"
                          aria-label={`Hapus ${r.no_laporan}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50/40 text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      <div className="rounded-2xl border border-[#e4eae9] bg-white px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Total <strong>{filtered.length}</strong> data &middot; Halaman{" "}
            <strong>{safePage}</strong> dari <strong>{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1">
            <span>Tampilkan</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-1.5 py-0.5 text-xs font-bold text-slate-700 outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>/ halaman</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="w-7 h-7 rounded-lg bg-[#007067] text-white font-bold flex items-center justify-center text-xs">
            {safePage}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            aria-label="Halaman selanjutnya"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Pop-up Form Individu Wizard (Create / Edit / View) */}
      <FormIndividuModal
        isOpen={modalState.open}
        mode={modalState.mode}
        initialRecord={modalState.record}
        username={username}
        onClose={() =>
          setModalState({ open: false, mode: "create", record: null })
        }
        onSaveDraft={handleSaveDraft}
        onSubmitReport={handleSubmitReport}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Hapus Draf Pasien?
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {deleteTarget.no_laporan}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data pasien{" "}
              <strong>{deleteTarget.data.nama_pasien || "ini"}</strong> (
              {formatPenyakitLabel(deleteTarget.data.penyakit)})? Tindakan ini
              tidak dapat dibatalkan.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Hapus Draf
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
