/* =========================================================
   DATA MATERI
   Untuk menambah atau mengubah soal, cukup edit file ini.
   "ikon" adalah nama file di folder assets/icons (tanpa .svg).
   Daftar kode ikon Twemoji: https://github.com/jdecked/twemoji
   ========================================================= */
window.DATA = {

  /* ---------- Ayo Berhitung ---------- */
  berhitung: {
    // benda yang dipakai untuk dihitung
    benda: [
      { ikon: "1f34e", nama: "apel" },
      { ikon: "1f34c", nama: "pisang" },
      { ikon: "1f955", nama: "wortel" },
      { ikon: "1f41f", nama: "ikan" },
      { ikon: "26bd",  nama: "bola" },
      { ikon: "2b50",  nama: "bintang" },
      { ikon: "1f388", nama: "balon" },
      { ikon: "1f34a", nama: "jeruk" },
      { ikon: "1f986", nama: "bebek" },
      { ikon: "1f697", nama: "mobil" }
    ],
    level: [
      { judul: "Hitung 1–5",  ket: "Ada berapa bendanya?", jenis: "hitung", min: 1, maks: 5,  jumlahSoal: 5 },
      { judul: "Hitung 1–10", ket: "Benda lebih banyak!",  jenis: "hitung", min: 4, maks: 10, jumlahSoal: 5 },
      { judul: "Penjumlahan", ket: "Gabungkan bendanya",   jenis: "tambah", maksHasil: 10, jumlahSoal: 5 }
    ]
  },

  /* ---------- Susun Huruf ---------- */
  susunHuruf: {
    level: [
      {
        judul: "Kata pendek", ket: "3–4 huruf", jumlahSoal: 5,
        kata: [
          { kata: "IKAN", ikon: "1f41f" }, { kata: "BUKU", ikon: "1f4d5" },
          { kata: "BOLA", ikon: "26bd" },  { kata: "APEL", ikon: "1f34e" },
          { kata: "SAPI", ikon: "1f404" }, { kata: "TOPI", ikon: "1f9e2" },
          { kata: "KUDA", ikon: "1f40e" }, { kata: "AYAM", ikon: "1f414" },
          { kata: "ROTI", ikon: "1f35e" }, { kata: "SUSU", ikon: "1f95b" }
        ]
      },
      {
        judul: "Kata panjang", ket: "5–6 huruf", jumlahSoal: 5,
        kata: [
          { kata: "KUCING", ikon: "1f431" }, { kata: "RUMAH", ikon: "1f3e0" },
          { kata: "BULAN", ikon: "1f319" },  { kata: "MOBIL", ikon: "1f697" },
          { kata: "PISANG", ikon: "1f34c" }, { kata: "JERUK", ikon: "1f34a" },
          { kata: "GAJAH", ikon: "1f418" },  { kata: "BEBEK", ikon: "1f986" },
          { kata: "ZEBRA", ikon: "1f993" },  { kata: "WORTEL", ikon: "1f955" }
        ]
      }
    ]
  },

  /* ---------- Cocokkan Gambar ---------- */
  cocokkan: {
    level: [
      {
        judul: "Hewan & makanannya", jenis: "pasangan", jumlahRonde: 2, pasanganPerRonde: 4,
        perintah: "Ketuk hewannya, lalu ketuk makanannya!",
        pasangan: [
          { kiri: { ikon: "1f430", nama: "Kelinci" }, kanan: { ikon: "1f955", nama: "Wortel" } },
          { kiri: { ikon: "1f431", nama: "Kucing" },  kanan: { ikon: "1f41f", nama: "Ikan" } },
          { kiri: { ikon: "1f412", nama: "Monyet" },  kanan: { ikon: "1f34c", nama: "Pisang" } },
          { kiri: { ikon: "1f404", nama: "Sapi" },    kanan: { ikon: "1f33f", nama: "Rumput" } },
          { kiri: { ikon: "1f414", nama: "Ayam" },    kanan: { ikon: "1f33d", nama: "Jagung" } },
          { kiri: { ikon: "1f41d", nama: "Lebah" },   kanan: { ikon: "1f33c", nama: "Bunga" } },
          { kiri: { ikon: "1f415", nama: "Anjing" },  kanan: { ikon: "1f9b4", nama: "Tulang" } },
          { kiri: { ikon: "1f42d", nama: "Tikus" },   kanan: { ikon: "1f9c0", nama: "Keju" } }
        ]
      },
      {
        judul: "Benda & warnanya", jenis: "pasangan", jumlahRonde: 2, pasanganPerRonde: 3,
        perintah: "Ketuk bendanya, lalu ketuk warnanya!",
        pasangan: [
          { kiri: { ikon: "1f34e", nama: "Apel" },     kanan: { warna: "#E53950", nama: "Merah" } },
          { kiri: { ikon: "1f34c", nama: "Pisang" },   kanan: { warna: "#FFD43B", nama: "Kuning" } },
          { kiri: { ikon: "1f966", nama: "Brokoli" },  kanan: { warna: "#3DBE5C", nama: "Hijau" } },
          { kiri: { ikon: "1f34a", nama: "Jeruk" },    kanan: { warna: "#FF8C1A", nama: "Oranye" } },
          { kiri: { ikon: "1f347", nama: "Anggur" },   kanan: { warna: "#8E4FD1", nama: "Ungu" } },
          { kiri: { ikon: "1f433", nama: "Paus" },     kanan: { warna: "#2E8BE6", nama: "Biru" } }
        ]
      },
      {
        judul: "Dengar & pilih", jenis: "bunyi", jumlahSoal: 6,
        perintah: "Dengarkan bunyinya, lalu ketuk hewannya!",
        hewan: [
          { ikon: "1f431", nama: "kucing",  bunyi: "Meong, meong!" },
          { ikon: "1f415", nama: "anjing",  bunyi: "Guk, guk, guk!" },
          { ikon: "1f404", nama: "sapi",    bunyi: "Mooo, mooo!" },
          { ikon: "1f414", nama: "ayam",    bunyi: "Kukuruyuuuk!" },
          { ikon: "1f986", nama: "bebek",   bunyi: "Kwek, kwek, kwek!" },
          { ikon: "1f410", nama: "kambing", bunyi: "Embeeek!" }
        ]
      }
    ]
  },

  /* ---------- Kenal Huruf & Angka ---------- */
  kenal: {
    huruf: [
      { h: "A", kata: "Apel",   ikon: "1f34e" }, { h: "B", kata: "Bola",   ikon: "26bd" },
      { h: "C", kata: "Cabai",  ikon: "1f336" }, { h: "D", kata: "Domba",  ikon: "1f411" },
      { h: "E", kata: "Es krim", ikon: "1f366" }, { h: "F", kata: "Foto",  ikon: "1f4f7" },
      { h: "G", kata: "Gajah",  ikon: "1f418" }, { h: "H", kata: "Harimau", ikon: "1f405" },
      { h: "I", kata: "Ikan",   ikon: "1f41f" }, { h: "J", kata: "Jeruk",  ikon: "1f34a" },
      { h: "K", kata: "Kucing", ikon: "1f431" }, { h: "L", kata: "Lebah",  ikon: "1f41d" },
      { h: "M", kata: "Mobil",  ikon: "1f697" }, { h: "N", kata: "Nanas",  ikon: "1f34d" },
      { h: "O", kata: "Orang utan", ikon: "1f9a7" }, { h: "P", kata: "Pisang", ikon: "1f34c" },
      { h: "Q", kata: "Quran",  ikon: "1f4d6" }, { h: "R", kata: "Rumah",  ikon: "1f3e0" },
      { h: "S", kata: "Sapi",   ikon: "1f404" }, { h: "T", kata: "Topi",   ikon: "1f9e2" },
      { h: "U", kata: "Ular",   ikon: "1f40d" }, { h: "V", kata: "Vas",    ikon: "1f3fa" },
      { h: "W", kata: "Wortel", ikon: "1f955" }, { h: "X", kata: "Xilofon", ikon: "1f3b6" },
      { h: "Y", kata: "Yoyo",   ikon: "1fa80" }, { h: "Z", kata: "Zebra",  ikon: "1f993" }
    ],
    angka: [
      { n: 1, kata: "satu" }, { n: 2, kata: "dua" }, { n: 3, kata: "tiga" },
      { n: 4, kata: "empat" }, { n: 5, kata: "lima" }, { n: 6, kata: "enam" },
      { n: 7, kata: "tujuh" }, { n: 8, kata: "delapan" }, { n: 9, kata: "sembilan" },
      { n: 10, kata: "sepuluh" }
    ],
    bendaAngka: ["2b50", "1f34e", "1f388", "26bd", "1f41f", "1f33c", "1f697", "1f34a", "1f986", "1f34c"],
    jumlahSoalTebak: 6
  }
};
