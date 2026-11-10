export interface DiseaseAlertItem {
  disease: string;
  code: string;
  category: "Vektor / Zoonotik" | "Bakteri / Pencernaan" | "Respiratori" | "Vaksin / PD3I" | "Lainnya";
  alerts: number;
  cases: number;
  deaths: number;
  klb: number;
  respon24: number;
  verified: number;
  alertLevel: "merah" | "kuning" | "hijau";
  trend: "naik" | "turun" | "stabil";
}

export interface ProvinceAlertItem {
  id: number;
  name: string;
  code: string;
  alerts: number;
  cases: number;
  riskLevel: "Tinggi" | "Sedang" | "Rendah";
  compliance: number; // Kepatuhan pelaporan faskes %
  responTime: string; // Rata-rata jam respon
}

export interface EpicurveWeekPoint {
  week: number;
  ispa: number;
  diare: number;
  dbd: number;
  ili: number;
  malaria: number;
  total: number;
}

export interface KlasterItem {
  id: string;
  title: string;
  disease: string;
  location: string;
  cases: number;
  deaths: number;
  status: "Penyelidikan Aktif" | "Verifikasi Lab" | "Terkendali";
  updatedAt: string;
  score717: string;
}

export interface LabSpecimenItem {
  disease: string;
  tested: number;
  positive: number;
  negative: number;
  pending: number;
  positivityRate: number;
}

export interface EbsSignalItem {
  id: string;
  title: string;
  source: "Laporan Faskes" | "Media Monitoring" | "Rumor Warga" | "Hotline Kemenkes";
  location: string;
  disease: string;
  date: string;
  status: "Terverifikasi" | "Sedang Investigasi" | "Perlu Konfirmasi";
  urgency: "Tinggi" | "Sedang" | "Rendah";
}

export interface T717Metric {
  target: string;
  actualAvg: string;
  complianceRate: number; // %
  status: "Tercapai" | "Mendekati" | "Perlu Perhatian";
  description: string;
}

// 24 Penyakit Terpantau SKDR Kemenkes RI
export const SKDR_DISEASE_ALERTS: DiseaseAlertItem[] = [
  {
    disease: "Diare Akut",
    code: "DIARE_AKUT",
    category: "Bakteri / Pencernaan",
    alerts: 26577,
    cases: 266952,
    deaths: 11,
    klb: 32,
    respon24: 24555,
    verified: 25682,
    alertLevel: "merah",
    trend: "naik",
  },
  {
    disease: "ISPA (Infeksi Saluran Pernapasan Akut)",
    code: "ISPA",
    category: "Respiratori",
    alerts: 18804,
    cases: 687824,
    deaths: 7,
    klb: 19,
    respon24: 17232,
    verified: 17950,
    alertLevel: "merah",
    trend: "stabil",
  },
  {
    disease: "Demam Berdarah Dengue (DBD)",
    code: "DBD",
    category: "Vektor / Zoonotik",
    alerts: 14468,
    cases: 72450,
    deaths: 18,
    klb: 17,
    respon24: 13789,
    verified: 14102,
    alertLevel: "merah",
    trend: "naik",
  },
  {
    disease: "Rabies / GHPR (Gigitan Hewan Penular Rabies)",
    code: "RABIES",
    category: "Vektor / Zoonotik",
    alerts: 13898,
    cases: 39727,
    deaths: 5,
    klb: 18,
    respon24: 13073,
    verified: 13410,
    alertLevel: "merah",
    trend: "turun",
  },
  {
    disease: "Campak (Suspek)",
    code: "CAMPAK",
    category: "Vaksin / PD3I",
    alerts: 12073,
    cases: 26843,
    deaths: 8,
    klb: 23,
    respon24: 11566,
    verified: 11840,
    alertLevel: "merah",
    trend: "naik",
  },
  {
    disease: "Tifus Abdominalis / Tipes",
    code: "TIFUS",
    category: "Bakteri / Pencernaan",
    alerts: 11931,
    cases: 76437,
    deaths: 6,
    klb: 6,
    respon24: 11316,
    verified: 11620,
    alertLevel: "kuning",
    trend: "stabil",
  },
  {
    disease: "Pneumonia",
    code: "PNEUMONIA",
    category: "Respiratori",
    alerts: 10031,
    cases: 68819,
    deaths: 66,
    klb: 13,
    respon24: 9484,
    verified: 9750,
    alertLevel: "merah",
    trend: "naik",
  },
  {
    disease: "Penyakit Serupa Influenza (ILI)",
    code: "ILI",
    category: "Respiratori",
    alerts: 6743,
    cases: 103165,
    deaths: 0,
    klb: 2,
    respon24: 6297,
    verified: 6510,
    alertLevel: "kuning",
    trend: "stabil",
  },
  {
    disease: "Diare Berdarah / Disentri",
    code: "DISENTRI",
    category: "Bakteri / Pencernaan",
    alerts: 6386,
    cases: 12504,
    deaths: 1,
    klb: 3,
    respon24: 6018,
    verified: 6200,
    alertLevel: "kuning",
    trend: "turun",
  },
  {
    disease: "Malaria (Konfirmasi Lab)",
    code: "MALARIA",
    category: "Vektor / Zoonotik",
    alerts: 5468,
    cases: 79082,
    deaths: 0,
    klb: 40,
    respon24: 4621,
    verified: 4980,
    alertLevel: "merah",
    trend: "naik",
  },
  {
    disease: "Flu Singapura (HFMD)",
    code: "HFMD",
    category: "Vaksin / PD3I",
    alerts: 4045,
    cases: 9027,
    deaths: 1,
    klb: 2,
    respon24: 3893,
    verified: 3950,
    alertLevel: "kuning",
    trend: "stabil",
  },
  {
    disease: "Sindrom Jaundice Akut (Hepatitis)",
    code: "JAUNDICE",
    category: "Bakteri / Pencernaan",
    alerts: 2305,
    cases: 5965,
    deaths: 9,
    klb: 0,
    respon24: 2199,
    verified: 2240,
    alertLevel: "kuning",
    trend: "stabil",
  },
  {
    disease: "Polio / AFP (Lumpuh Layu Akut)",
    code: "AFP_POLIO",
    category: "Vaksin / PD3I",
    alerts: 694,
    cases: 877,
    deaths: 0,
    klb: 1,
    respon24: 668,
    verified: 690,
    alertLevel: "merah",
    trend: "turun",
  },
  {
    disease: "Tetanus",
    code: "TETANUS",
    category: "Vaksin / PD3I",
    alerts: 555,
    cases: 799,
    deaths: 20,
    klb: 0,
    respon24: 519,
    verified: 540,
    alertLevel: "kuning",
    trend: "stabil",
  },
  {
    disease: "Pertusis (Batuk Rejan)",
    code: "PERTUSIS",
    category: "Vaksin / PD3I",
    alerts: 555,
    cases: 874,
    deaths: 1,
    klb: 7,
    respon24: 534,
    verified: 545,
    alertLevel: "kuning",
    trend: "naik",
  },
  {
    disease: "Leptospirosis",
    code: "LEPTO",
    category: "Vektor / Zoonotik",
    alerts: 413,
    cases: 531,
    deaths: 7,
    klb: 0,
    respon24: 392,
    verified: 405,
    alertLevel: "kuning",
    trend: "naik",
  },
  {
    disease: "Difteri (Suspek)",
    code: "DIFTERI",
    category: "Vaksin / PD3I",
    alerts: 212,
    cases: 240,
    deaths: 1,
    klb: 0,
    respon24: 202,
    verified: 210,
    alertLevel: "kuning",
    trend: "turun",
  },
  {
    disease: "COVID-19",
    code: "COVID19",
    category: "Respiratori",
    alerts: 210,
    cases: 6839,
    deaths: 0,
    klb: 0,
    respon24: 191,
    verified: 205,
    alertLevel: "hijau",
    trend: "turun",
  },
  {
    disease: "Meningitis / Ensefalitis",
    code: "MENINGITIS",
    category: "Respiratori",
    alerts: 195,
    cases: 853,
    deaths: 21,
    klb: 0,
    respon24: 181,
    verified: 190,
    alertLevel: "kuning",
    trend: "stabil",
  },
  {
    disease: "Flu Burung (Avian Influenza)",
    code: "FLU_BURUNG",
    category: "Vektor / Zoonotik",
    alerts: 171,
    cases: 1157,
    deaths: 0,
    klb: 0,
    respon24: 162,
    verified: 168,
    alertLevel: "hijau",
    trend: "stabil",
  },
  {
    disease: "Chikungunya",
    code: "CHIKUNGUNYA",
    category: "Vektor / Zoonotik",
    alerts: 122,
    cases: 739,
    deaths: 0,
    klb: 1,
    respon24: 113,
    verified: 120,
    alertLevel: "hijau",
    trend: "turun",
  },
  {
    disease: "Kolera",
    code: "KOLERA",
    category: "Bakteri / Pencernaan",
    alerts: 61,
    cases: 81,
    deaths: 0,
    klb: 0,
    respon24: 57,
    verified: 60,
    alertLevel: "hijau",
    trend: "stabil",
  },
  {
    disease: "Tetanus Neonatorum",
    code: "TN",
    category: "Vaksin / PD3I",
    alerts: 12,
    cases: 66,
    deaths: 0,
    klb: 0,
    respon24: 12,
    verified: 12,
    alertLevel: "hijau",
    trend: "stabil",
  },
  {
    disease: "Antraks",
    code: "ANTRAKS",
    category: "Vektor / Zoonotik",
    alerts: 9,
    cases: 15,
    deaths: 0,
    klb: 3,
    respon24: 8,
    verified: 9,
    alertLevel: "kuning",
    trend: "stabil",
  },
];

// Data Indikator Kecepatan Respons 7-1-7 (Target Global Kemenkes)
export const SKDR_T717_DATA: T717Metric[] = [
  {
    target: "7 Hari Deteksi",
    actualAvg: "3.6 Hari",
    complianceRate: 94.2,
    status: "Tercapai",
    description: "Waktu dari munculnya gejala pertama hingga terdeteksi di fasilitas pelayanan kesehatan.",
  },
  {
    target: "1 Hari Notifikasi",
    actualAvg: "8.4 Jam",
    complianceRate: 98.1,
    status: "Tercapai",
    description: "Waktu dari deteksi kasus terduga hingga terlaporkan ke Dinas Kesehatan / SKDR Pusat.",
  },
  {
    target: "7 Hari Respons Awal",
    actualAvg: "3.2 Hari",
    complianceRate: 91.5,
    status: "Tercapai",
    description: "Waktu dari notifikasi hingga dimulainya investigasi lapangan dan tindakan pengendalian awal.",
  },
];

// Data Sebaran Provinsi
export const SKDR_PROVINCE_ALERTS: ProvinceAlertItem[] = [
  { id: 1, name: "Jawa Barat", code: "32", alerts: 27814, cases: 298450, riskLevel: "Tinggi", compliance: 98.4, responTime: "4.2 Jam" },
  { id: 2, name: "Jawa Timur", code: "35", alerts: 23640, cases: 245120, riskLevel: "Tinggi", compliance: 97.9, responTime: "5.1 Jam" },
  { id: 3, name: "Jawa Tengah", code: "33", alerts: 19850, cases: 210890, riskLevel: "Tinggi", compliance: 98.7, responTime: "4.0 Jam" },
  { id: 4, name: "Sumatera Utara", code: "12", alerts: 12430, cases: 134200, riskLevel: "Tinggi", compliance: 94.5, responTime: "8.3 Jam" },
  { id: 5, name: "DKI Jakarta", code: "31", alerts: 11200, cases: 142100, riskLevel: "Tinggi", compliance: 99.2, responTime: "2.5 Jam" },
  { id: 6, name: "Banten", code: "36", alerts: 8940, cases: 94100, riskLevel: "Sedang", compliance: 96.2, responTime: "6.0 Jam" },
  { id: 7, name: "Sulawesi Selatan", code: "73", alerts: 7820, cases: 82300, riskLevel: "Sedang", compliance: 95.8, responTime: "7.4 Jam" },
  { id: 8, name: "Sumatera Selatan", code: "16", alerts: 5410, cases: 58200, riskLevel: "Sedang", compliance: 93.9, responTime: "9.2 Jam" },
  { id: 9, name: "Lampung", code: "18", alerts: 4980, cases: 51200, riskLevel: "Sedang", compliance: 95.1, responTime: "8.0 Jam" },
  { id: 10, name: "Papua & Papua Tengah", code: "91", alerts: 4120, cases: 48900, riskLevel: "Tinggi", compliance: 86.4, responTime: "18.5 Jam" },
  { id: 11, name: "Kalimantan Barat", code: "61", alerts: 3890, cases: 41200, riskLevel: "Sedang", compliance: 92.8, responTime: "10.2 Jam" },
  { id: 12, name: "Bali", code: "51", alerts: 3200, cases: 35100, riskLevel: "Rendah", compliance: 99.0, responTime: "3.1 Jam" },
  { id: 13, name: "DI Yogyakarta", code: "34", alerts: 2654, cases: 28406, riskLevel: "Rendah", compliance: 99.4, responTime: "2.8 Jam" },
];

// Kurva Epidemiologi Mingguan
export const SKDR_EPICURVE_DATA: EpicurveWeekPoint[] = [
  { week: 36, ispa: 60688, diare: 25857, dbd: 6800, ili: 11133, malaria: 8284, total: 112762 },
  { week: 37, ispa: 71738, diare: 24791, dbd: 7120, ili: 10141, malaria: 8421, total: 122211 },
  { week: 38, ispa: 66757, diare: 23894, dbd: 7450, ili: 9903, malaria: 8589, total: 116593 },
  { week: 39, ispa: 48040, diare: 24443, dbd: 7890, ili: 7873, malaria: 8939, total: 97185 },
  { week: 40, ispa: 40486, diare: 46232, dbd: 8240, ili: 6162, malaria: 8208, total: 109328 },
  { week: 41, ispa: 52140, diare: 28120, dbd: 8650, ili: 7420, malaria: 7910, total: 104240 },
  { week: 42, ispa: 58900, diare: 29400, dbd: 9100, ili: 8120, malaria: 8100, total: 113620 },
  { week: 43, ispa: 64200, diare: 27800, dbd: 8950, ili: 8650, malaria: 8400, total: 118000 },
  { week: 44, ispa: 59400, diare: 26500, dbd: 8700, ili: 8200, malaria: 8250, total: 111050 },
  { week: 45, ispa: 18648, diare: 10115, dbd: 3200, ili: 4100, malaria: 2391, total: 38454 },
];

// Sinyal Event-Based Surveillance (EBS)
export const SKDR_EBS_SIGNALS: EbsSignalItem[] = [
  {
    id: "EBS-2026-118",
    title: "Klaster DBD 14 Kasus dalam 3 Hari di RW 04",
    source: "Laporan Faskes",
    location: "Puskesmas Cilandak, Jakarta Selatan",
    disease: "Demam Berdarah Dengue",
    date: "09 Nov 2026, 11:20 WIB",
    status: "Terverifikasi",
    urgency: "Tinggi",
  },
  {
    id: "EBS-2026-117",
    title: "Lonjakan Diare Massal di Lingkungan Pesantren",
    source: "Rumor Warga",
    location: "Puskesmas Sukasari, Kab. Bandung",
    disease: "Diare Akut",
    date: "08 Nov 2026, 17:40 WIB",
    status: "Sedang Investigasi",
    urgency: "Tinggi",
  },
  {
    id: "EBS-2026-116",
    title: "Gigitan Anjing Liar pada 3 Anak di Pasar Tradisional",
    source: "Hotline Kemenkes",
    location: "Puskesmas Ruteng, Kab. Manggarai",
    disease: "Rabies / GHPR",
    date: "08 Nov 2026, 09:15 WIB",
    status: "Terverifikasi",
    urgency: "Tinggi",
  },
  {
    id: "EBS-2026-115",
    title: "Kenaikan Kasus Demam & Ruam pada Balita",
    source: "Laporan Faskes",
    location: "Puskesmas Karanganyar, Kab. Demak",
    disease: "Campak (Suspek)",
    date: "07 Nov 2026, 14:30 WIB",
    status: "Sedang Investigasi",
    urgency: "Sedang",
  },
  {
    id: "EBS-2026-114",
    title: "Pemberitaan Media: Dugaan Keracunan Makanan Hajatan",
    source: "Media Monitoring",
    location: "Puskesmas Mandau, Kab. Bengkalis",
    disease: "Kolera / Diare Akut",
    date: "06 Nov 2026, 16:00 WIB",
    status: "Terverifikasi",
    urgency: "Sedang",
  },
  {
    id: "EBS-2026-113",
    title: "Kasus Demam Pasca Banjir Luapan Sungai",
    source: "Laporan Faskes",
    location: "Puskesmas Genuk, Kota Semarang",
    disease: "Leptospirosis",
    date: "05 Nov 2026, 10:45 WIB",
    status: "Perlu Konfirmasi",
    urgency: "Sedang",
  },
];

// Klaster Kasus Lapangan
export const SKDR_KLASTER_LIST: KlasterItem[] = [
  {
    id: "KLS-2026-042",
    title: "Klaster DBD RW 04 Cilandak",
    disease: "Demam Berdarah Dengue",
    location: "Puskesmas Cilandak, Jakarta Selatan",
    cases: 14,
    deaths: 0,
    status: "Penyelidikan Aktif",
    updatedAt: "09 Nov 2026, 09:30 WIB",
    score717: "2-0.5-2 Hari",
  },
  {
    id: "KLS-2026-041",
    title: "Klaster Diare Massal SDN 01 Sukasari",
    disease: "Diare Akut",
    location: "Puskesmas Sukasari, Kab. Bandung",
    cases: 23,
    deaths: 0,
    status: "Verifikasi Lab",
    updatedAt: "08 Nov 2026, 16:15 WIB",
    score717: "1-0.2-1 Hari",
  },
  {
    id: "KLS-2026-040",
    title: "Klaster Suspek Campak Desa Karanganyar",
    disease: "Campak (Suspek)",
    location: "Puskesmas Karanganyar, Kab. Demak",
    cases: 8,
    deaths: 1,
    status: "Penyelidikan Aktif",
    updatedAt: "08 Nov 2026, 11:00 WIB",
    score717: "3-1-3 Hari",
  },
  {
    id: "KLS-2026-039",
    title: "Klaster Malaria Tambang Rakyat",
    disease: "Malaria Falciparum",
    location: "Puskesmas Timika, Kab. Mimika",
    cases: 31,
    deaths: 0,
    status: "Terkendali",
    updatedAt: "06 Nov 2026, 14:20 WIB",
    score717: "4-1-4 Hari",
  },
  {
    id: "KLS-2026-038",
    title: "Klaster Difteri Desa Sukajaya",
    disease: "Difteri Suspek",
    location: "Puskesmas Sukajaya, Kab. Bogor",
    cases: 4,
    deaths: 1,
    status: "Verifikasi Lab",
    updatedAt: "04 Nov 2026, 15:40 WIB",
    score717: "2-0.4-2 Hari",
  },
];

// Laboratorium Rujukan & Integrasi NAR
export const SKDR_LAB_SUMMARY: LabSpecimenItem[] = [
  { disease: "Demam Berdarah (NS1/IgM/IgG)", tested: 18450, positive: 9225, negative: 8100, pending: 1125, positivityRate: 50.0 },
  { disease: "Campak / Rubela (Serologi)", tested: 6840, positive: 2180, negative: 4120, pending: 540, positivityRate: 31.8 },
  { disease: "Malaria (Mikroskopis / RDT)", tested: 24100, positive: 7920, negative: 15980, pending: 200, positivityRate: 32.8 },
  { disease: "Difteri (Kultur Swab Tenggorok)", tested: 410, positive: 38, negative: 320, pending: 52, positivityRate: 9.3 },
  { disease: "Leptospirosis (MAT / Rapid)", tested: 890, positive: 215, negative: 610, pending: 65, positivityRate: 24.1 },
  { disease: "Polio (Isolasi Virus Feses)", tested: 694, positive: 3, negative: 671, pending: 20, positivityRate: 0.4 },
];

// Matriks Heatmap Tren Mingguan (8 Minggu Terakhir W38-W45 x 6 Penyakit Utama)
export const SKDR_HEATMAP_DATA = [
  { disease: "ISPA", values: [66, 48, 40, 52, 58, 64, 59, 18], trend: "Tinggi", color: "bg-red-500" },
  { disease: "Diare Akut", values: [23, 24, 46, 28, 29, 27, 26, 10], trend: "Tinggi", color: "bg-amber-500" },
  { disease: "DBD", values: [7, 7, 8, 8, 9, 8, 8, 3], trend: "Meningkat", color: "bg-rose-500" },
  { disease: "Rabies / GHPR", values: [4, 4, 4, 3, 4, 4, 3, 1], trend: "Stabil", color: "bg-orange-500" },
  { disease: "Campak", values: [2, 3, 3, 2, 3, 3, 2, 1], trend: "Meningkat", color: "bg-purple-500" },
  { disease: "Tifus", values: [7, 6, 6, 6, 6, 6, 6, 2], trend: "Stabil", color: "bg-yellow-500" },
  { disease: "Pneumonia", values: [7, 6, 6, 7, 7, 7, 6, 2], trend: "Tinggi", color: "bg-red-600" },
  { disease: "Malaria", values: [8, 8, 8, 7, 8, 8, 8, 2], trend: "Stabil", color: "bg-emerald-600" },
];

export interface Delta24Data {
  cur: number;
  prev: number;
}

export interface RingkasanSummaryData {
  header: {
    individualReports: number;
    ebsAlertsZoonosis: number;
    ebsAlertsAll: number;
    startDate: string;
    endDate: string;
    scope: string;
  };
  kpi: {
    ebs: {
      alerts: number;
      cases: number;
      deaths: number;
      provinces: number;
      kabkota: number;
      verified: number;
    };
    pe: {
      cases: number;
      deaths: number;
      provinces: number;
      kabkota: number;
      verified: number;
    };
  };
  kpiTrend: {
    bucket: "week" | "day";
    until: string;
    days: string[];
    ebs: {
      alerts: number[];
      cases: number[];
      deaths: number[];
      provinces: number[];
      d24: {
        alerts: Delta24Data;
        cases: Delta24Data;
        deaths: Delta24Data;
        provinces: Delta24Data;
      };
    };
    pe: {
      cases: number[];
      deaths: number[];
      provinces: number[];
      d24: {
        cases: Delta24Data;
        deaths: Delta24Data;
        provinces: Delta24Data;
      };
    };
  };
}

// Data resmi Ringkasan KPI & Tren Mingguan (M1/2026 - M45/2026)
export const SKDR_RINGKASAN_SUMMARY: RingkasanSummaryData = {
  header: {
    individualReports: 29,
    ebsAlertsZoonosis: 648,
    ebsAlertsAll: 42959,
    startDate: "2026-01-04",
    endDate: "2026-11-14",
    scope: "Indonesia",
  },
  kpi: {
    ebs: {
      alerts: 42959,
      cases: 84909,
      deaths: 323,
      provinces: 37,
      kabkota: 394,
      verified: 39702,
    },
    pe: {
      cases: 29,
      deaths: 0,
      provinces: 1,
      kabkota: 1,
      verified: 29,
    },
  },
  kpiTrend: {
    bucket: "week",
    until: "2026-10-12",
    days: [
      "2026-01-04", "2026-01-11", "2026-01-18", "2026-01-25", "2026-02-01",
      "2026-02-08", "2026-02-15", "2026-02-22", "2026-03-01", "2026-03-08",
      "2026-03-15", "2026-03-22", "2026-03-29", "2026-04-05", "2026-04-12",
      "2026-04-19", "2026-04-26", "2026-05-03", "2026-05-10", "2026-05-17",
      "2026-05-24", "2026-05-31", "2026-06-07", "2026-06-14", "2026-06-21",
      "2026-06-28", "2026-07-05", "2026-07-12", "2026-07-19", "2026-07-26",
      "2026-08-02", "2026-08-09", "2026-08-16", "2026-08-23", "2026-08-30",
      "2026-09-06", "2026-09-13", "2026-09-20", "2026-09-27", "2026-10-04",
      "2026-10-11", "2026-10-18", "2026-10-25", "2026-11-01", "2026-11-08",
    ],
    ebs: {
      alerts: [
        2652, 2815, 3973, 4079, 4010, 3956, 3193, 4325, 4127, 4211, 2793, 2796,
        0, 29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      cases: [
        5092, 4974, 8150, 9312, 8297, 8587, 6245, 8500, 7696, 7862, 5308, 4815,
        0, 71, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      deaths: [
        21, 13, 24, 25, 28, 57, 20, 45, 25, 21, 12, 32, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      provinces: [
        33, 35, 36, 34, 35, 34, 33, 33, 34, 36, 34, 33, 0, 8, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      d24: {
        alerts: { cur: 0, prev: 0 },
        cases: { cur: 0, prev: 0 },
        deaths: { cur: 0, prev: 0 },
        provinces: { cur: 0, prev: 0 },
      },
    },
    pe: {
      cases: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 0, 0, 0, 0,
      ],
      deaths: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      provinces: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
      ],
      d24: {
        cases: { cur: 0, prev: 0 },
        deaths: { cur: 0, prev: 0 },
        provinces: { cur: 0, prev: 0 },
      },
    },
  },
};
