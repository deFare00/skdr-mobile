export interface IbsPenyakitOption {
  kode: string;
  kodeSms: string;
  nama: string;
}

export interface IndividuFormValues {
  // Step 1: Unit & Periode
  jenis_unit: string;
  provinsi: string;
  kabkota: string;
  kecamatan: string;
  unit_pelapor: string;
  petugas: string;
  hp_petugas: string;
  tahun: number;
  minggu: number;

  // Step 2: Info Pasien
  nama_pasien: string;
  no_epid: string;
  umur_tahun: string;
  umur_bulan: string;
  umur_hari: string;
  kelamin: string;
  pekerjaan: string;
  alamat: string;

  // Step 3: Penyakit
  penyakit: string; // kode SMS or kode e.g. 'AA', 'A'
  tgl_periksa: string;
  status_akhir: string;
  tgl_meninggal: string;
  status_imunisasi: string;
  keluhan: string;
  lama_sakit: string;
  icdx: string;
  diagnosa: string;

  // Step 4: Pemeriksaan
  tinggi: string;
  berat: string;
  imt: string;
  suhu: string;
  sistole: string;
  diastole: string;
  soap_s: string;
  soap_o: string;
  soap_a: string;
  soap_p: string;
}

export interface IndividuRecord {
  id: number;
  no_laporan: string;
  status: "draf" | "dikirim";
  updated_at: string;
  created_by_name: string;
  data: IndividuFormValues;
}

export interface FormIssue {
  step: "s1" | "s2" | "s3" | "s4";
  key: keyof IndividuFormValues;
  msg: string;
}

export const IBS_PENYAKIT_24: IbsPenyakitOption[] = [
  { kodeSms: "A", kode: "01AWD", nama: "Diare Akut" },
  { kodeSms: "B", kode: "12MAL", nama: "Malaria Konfirmasi" },
  { kodeSms: "C", kode: "16SDF", nama: "Suspek Dengue" },
  { kodeSms: "D", kode: "04ARI", nama: "Pneumonia" },
  { kodeSms: "E", kode: "05BDR", nama: "Diare Berdarah/Disentri" },
  { kodeSms: "F", kode: "21STF", nama: "Suspek Demam Tifoid" },
  { kodeSms: "G", kode: "02JAD", nama: "Sindrom Jaundice Akut" },
  { kodeSms: "H", kode: "25CHK", nama: "Suspek Chikungunya" },
  { kodeSms: "J", kode: "11HAF", nama: "Suspek Flu Burung pada Manusia" },
  { kodeSms: "K", kode: "18MEA", nama: "Suspek Campak" },
  { kodeSms: "L", kode: "07DPR", nama: "Kasus Observasi Difteri" },
  { kodeSms: "M", kode: "13PTS", nama: "Suspek Pertusis" },
  { kodeSms: "N", kode: "03AFP", nama: "Acute Flaccid Paralysis (AFP)" },
  { kodeSms: "P", kode: "08DBT", nama: "Gigitan Hewan Penular Rabies" },
  { kodeSms: "Q", kode: "14ATX", nama: "Suspek Antraks" },
  { kodeSms: "R", kode: "26LPT", nama: "Suspek Leptospirosis" },
  { kodeSms: "S", kode: "15SCR", nama: "Suspek Kolera" },
  { kodeSms: "U", kode: "19MEN", nama: "Suspek Meningitis/Ensefalitis" },
  { kodeSms: "V", kode: "23STN", nama: "Suspek Tetanus Neonatorum" },
  { kodeSms: "W", kode: "20STT", nama: "Suspek Tetanus" },
  { kodeSms: "Y", kode: "24ILI", nama: "ILI (Penyakit Serupa Influenza)" },
  { kodeSms: "Z", kode: "27HFMD", nama: "Suspek HFMD" },
  { kodeSms: "AA", kode: "ISPA", nama: "ISPA" },
  { kodeSms: "AC", kode: "19COV", nama: "COVID-19 Konfirmasi" },
];

export const JENIS_UNIT_OPTIONS = [
  "Puskesmas",
  "Rumah Sakit",
  "Klinik",
  "Dinas Kesehatan Kabupaten/Kota",
  "Dinas Kesehatan Provinsi",
  "Laboratorium",
  "BKK",
  "PHEOC",
];

export const PROVINSI_OPTIONS = [
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Banten",
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Sumatera Selatan",
  "Lampung",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Sulawesi Selatan",
  "Sulawesi Utara",
  "Papua",
];

export const KABKOTA_BY_PROVINSI: Record<string, string[]> = {
  "DKI Jakarta": [
    "Kota Administrasi Jakarta Pusat",
    "Kota Administrasi Jakarta Selatan",
    "Kota Administrasi Jakarta Timur",
    "Kota Administrasi Jakarta Barat",
    "Kota Administrasi Jakarta Utara",
    "Kab. Adm. Kepulauan Seribu",
  ],
  "Jawa Barat": ["Kota Bandung", "Kab. Bogor", "Kota Bekasi", "Kota Depok", "Kab. Garut"],
  "Jawa Tengah": ["Kota Semarang", "Kab. Demak", "Kab. Temanggung", "Kota Surakarta"],
  "Jawa Timur": ["Kota Surabaya", "Kab. Malang", "Kab. Sidoarjo"],
};

export const KECAMATAN_OPTIONS = [
  "Cempaka Putih",
  "Gambir",
  "Johar Baru",
  "Kemayoran",
  "Menteng",
  "Sawah Besar",
  "Senen",
  "Tanah Abang",
];

export const UNIT_PELAPOR_OPTIONS = [
  "PKM. KEC. CEMPAKA PUTIH",
  "PKM. KEC. GAMBIR",
  "PKM. KEC. JOHAR BARU",
  "PKM. KEC. KEMAYORAN",
  "PKM. KEC. MENTENG",
  "PKM. KEC. SENEN",
  "PKM. KEC. TANAH ABANG",
  "RSUD TARAKAN",
  "RSCM",
];

export const KELAMIN_OPTIONS = [
  { value: "Pria", label: "Laki-laki (Pria)" },
  { value: "Wanita", label: "Perempuan (Wanita)" },
];

export const PEKERJAAN_OPTIONS = [
  "Dokter Hewan",
  "Karyawan",
  "Mahasiswa",
  "Pekerja Pabrik Makanan Ternak",
  "Pekerja Pabrik Pupuk",
  "Pekerja Pabrik Tekstil",
  "Pekerja Peternakan",
  "Pekerja Tempat Pemotongan Hewan",
  "Pelajar",
  "Petani",
  "Swasta",
  "Tidak Bekerja",
  "Wiraswasta",
  "Lain-lain",
];

export const STATUS_AKHIR_OPTIONS = [
  "Masih Dalam Perawatan",
  "Sakit",
  "Sehat",
  "Meninggal",
];

export const STATUS_IMUNISASI_OPTIONS = [
  "1x",
  "2x",
  "3x",
  "4x",
  "Lengkap",
  "Tidak Lengkap",
  "Tidak Pernah",
  "Tidak Diketahui",
];

export const getWeekRangeLabel = (week: number, year: number): string => {
  if (week === 44 && year === 2026) return "1–7 Nov 2026";
  if (week === 45 && year === 2026) return "8–14 Nov 2026";
  // Approximate MMWR Sunday-Saturday label for static helper
  const jan4 = new Date(year, 0, 4);
  const start = new Date(jan4.getTime() + (week - 1) * 7 * 86400000);
  const end = new Date(start.getTime() + 6 * 86400000);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}–${end.getDate()} ${months[end.getMonth()]} ${year}`;
  }
  return `${start.getDate()} ${months[start.getMonth()]}–${end.getDate()} ${months[end.getMonth()]} ${year}`;
};

export const createEmptyIndividuValues = (
  username = "Administrator"
): IndividuFormValues => ({
  jenis_unit: "Puskesmas",
  provinsi: "DKI Jakarta",
  kabkota: "Kota Administrasi Jakarta Pusat",
  kecamatan: "",
  unit_pelapor: "PKM. KEC. CEMPAKA PUTIH",
  petugas: username === "admin" ? "Administrator" : username,
  hp_petugas: "",
  tahun: 2026,
  minggu: 44,

  nama_pasien: "",
  no_epid: "",
  umur_tahun: "",
  umur_bulan: "",
  umur_hari: "",
  kelamin: "",
  pekerjaan: "",
  alamat: "",

  penyakit: "",
  tgl_periksa: "",
  status_akhir: "",
  tgl_meninggal: "",
  status_imunisasi: "",
  keluhan: "",
  lama_sakit: "",
  icdx: "",
  diagnosa: "",

  tinggi: "",
  berat: "",
  imt: "",
  suhu: "",
  sistole: "",
  diastole: "",
  soap_s: "",
  soap_o: "",
  soap_a: "",
  soap_p: "",
});

export function formatPenyakitLabel(kodeSms: string): string {
  const found = IBS_PENYAKIT_24.find(
    (p) => p.kodeSms === kodeSms || p.kode === kodeSms
  );
  return found ? `${found.kodeSms} — ${found.nama}` : kodeSms || "—";
}

export function formatUmurRingkas(d: IndividuFormValues): string {
  const parts: string[] = [];
  if (Number(d.umur_tahun) > 0) parts.push(`${Number(d.umur_tahun)} th`);
  if (Number(d.umur_bulan) > 0) parts.push(`${Number(d.umur_bulan)} bl`);
  if (Number(d.umur_hari) > 0) parts.push(`${Number(d.umur_hari)} hr`);
  return parts.length ? parts.join(" ") : "—";
}

export function computeImt(tinggiStr: string, beratStr: string): string {
  const t = Number(String(tinggiStr || "").replace(",", "."));
  const b = Number(String(beratStr || "").replace(",", "."));
  if (!Number.isFinite(t) || !Number.isFinite(b) || t <= 0 || b <= 0) return "";
  const val = Math.round((b / (t / 100) ** 2) * 10) / 10;
  return Number.isFinite(val) ? String(val) : "";
}

export function getImtCategory(imtStr: string): string {
  const v = Number(String(imtStr || "").replace(",", "."));
  if (!Number.isFinite(v) || v <= 0) return "";
  if (v < 18.5) return "Berat badan kurang";
  if (v < 25) return "Normal";
  if (v < 27) return "Berat badan lebih";
  return "Obesitas";
}

export function validateIndividuValues(d: IndividuFormValues): {
  errors: FormIssue[];
  stepProgress: {
    id: "s1" | "s2" | "s3" | "s4" | "s5";
    done: number;
    total: number;
    errCount: number;
  }[];
  totalDone: number;
  totalRequired: number;
  pct: number;
} {
  const errors: FormIssue[] = [];
  const req = (
    step: "s1" | "s2" | "s3" | "s4",
    key: keyof IndividuFormValues,
    label: string
  ) => {
    const val = d[key];
    if (val === null || val === undefined || String(val).trim() === "") {
      errors.push({ step, key, msg: `${label} wajib diisi` });
      return false;
    }
    return true;
  };

  // Step 1: 7 wajib (jenis_unit, provinsi, kabkota, unit_pelapor, petugas, tahun, minggu)
  const s1Checks = [
    req("s1", "jenis_unit", "Jenis Unit"),
    req("s1", "provinsi", "Provinsi"),
    req("s1", "kabkota", "Kab/Kota"),
    req("s1", "unit_pelapor", "Puskesmas/Unit"),
    req("s1", "petugas", "Nama Petugas"),
    Boolean(d.tahun),
    Boolean(d.minggu),
  ];

  // Step 2: 3 wajib (nama_pasien, umur, kelamin)
  const hasNama = req("s2", "nama_pasien", "Nama Pasien");
  const hasKelamin = req("s2", "kelamin", "Jenis Kelamin");
  const th = Number(d.umur_tahun || 0);
  const bl = Number(d.umur_bulan || 0);
  const hr = Number(d.umur_hari || 0);
  const hasAnyUmur =
    d.umur_tahun !== "" || d.umur_bulan !== "" || d.umur_hari !== "";
  const hasPositiveUmur = th > 0 || bl > 0 || hr > 0;
  if (!hasAnyUmur) {
    errors.push({
      step: "s2",
      key: "umur_tahun",
      msg: "Umur wajib diisi (tahun, bulan, atau hari)",
    });
  } else if (!hasPositiveUmur) {
    errors.push({
      step: "s2",
      key: "umur_tahun",
      msg: "Umur tidak boleh 0 semua — isi bulan/hari untuk bayi",
    });
  }

  // Step 3: 2 wajib (penyakit, tgl_periksa) + tgl_meninggal if Meninggal
  const hasPenyakit = req("s3", "penyakit", "Penyakit Agregat");
  const hasTgl = req("s3", "tgl_periksa", "Tanggal Pemeriksaan");
  let s3Total = 2;
  let s3Done = (hasPenyakit ? 1 : 0) + (hasTgl ? 1 : 0);
  if (d.status_akhir === "Meninggal") {
    s3Total = 3;
    if (req("s3", "tgl_meninggal", "Tanggal Meninggal")) s3Done++;
  }

  const s1Done = s1Checks.filter(Boolean).length;
  const s2Done =
    (hasNama ? 1 : 0) + (hasKelamin ? 1 : 0) + (hasPositiveUmur ? 1 : 0);

  const totalRequired = 7 + 3 + s3Total;
  const totalDone = s1Done + s2Done + s3Done;
  const pct = Math.round((totalDone / totalRequired) * 100);

  const stepErrs = (step: "s1" | "s2" | "s3" | "s4") =>
    errors.filter((e) => e.step === step).length;

  return {
    errors,
    stepProgress: [
      { id: "s1", done: s1Done, total: 7, errCount: stepErrs("s1") },
      { id: "s2", done: s2Done, total: 3, errCount: stepErrs("s2") },
      { id: "s3", done: s3Done, total: s3Total, errCount: stepErrs("s3") },
      { id: "s4", done: 0, total: 0, errCount: 0 },
      { id: "s5", done: totalDone, total: totalRequired, errCount: errors.length },
    ],
    totalDone,
    totalRequired,
    pct,
  };
}

export const INITIAL_INDIVIDU_RECORDS: IndividuRecord[] = [
  {
    id: 2,
    no_laporan: "IND-2026-000002",
    status: "draf",
    updated_at: "2026-11-10 07:30",
    created_by_name: "Administrator",
    data: {
      ...createEmptyIndividuValues("Administrator"),
      nama_pasien: "Budi Contoh Uji",
      umur_tahun: "8",
      kelamin: "Pria",
      pekerjaan: "Pelajar",
      penyakit: "AA",
      tgl_periksa: "2026-11-05",
      status_akhir: "Sakit",
      keluhan: "Batuk, pilek, demam ringan 2 hari",
      lama_sakit: "2 hari",
      icdx: "J06.9",
      diagnosa: "ISPA Akut",
      tinggi: "128",
      berat: "26",
      imt: "15.9",
      suhu: "37.6",
      soap_s: "Pasien anak mengeluh batuk dan demam 2 hari.",
      soap_o: "Nadi 92x/menit, suhu 37.6 °C, faring hiperemis ringan.",
      soap_a: "Infeksi Saluran Pernapasan Akut (ISPA)",
      soap_p: "Terapi simptomatis, edukasi hidrasi dan etika batuk.",
    },
  },
  {
    id: 1,
    no_laporan: "IND-2026-000001",
    status: "draf",
    updated_at: "2026-11-10 07:29",
    created_by_name: "Administrator",
    data: {
      ...createEmptyIndividuValues("Administrator"),
      nama_pasien: "Siti Contoh Uji",
      umur_tahun: "25",
      kelamin: "Wanita",
      pekerjaan: "Karyawan",
      penyakit: "A",
      tgl_periksa: "2026-11-05",
      status_akhir: "Masih Dalam Perawatan",
      keluhan: "BAB cair > 4 kali sehari disertai mual",
      lama_sakit: "2 hari",
      icdx: "A09",
      diagnosa: "Gastroenteritis / Diare Akut",
      tinggi: "160",
      berat: "54",
      imt: "21.1",
      suhu: "37.2",
      sistole: "110",
      diastole: "75",
      soap_s: "Pasien dewasa mengeluh diare cair sejak kemarin.",
      soap_o: "Turgor kulit baik, bising usus meningkat.",
      soap_a: "Diare Akut tanpa dehidrasi berat",
      soap_p: "Oralit, zinc, edukasi higiene sanitasi makanan.",
    },
  },
];
