/* =========================================================
   Fungsi bersama untuk semua halaman:
   ikon, suara (pembaca teks + efek), bintang, confetti, acak.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Penyimpanan aman (localStorage bisa diblokir) ---------- */
  var simpan = {
    ambil: function (kunci, bawaan) {
      try {
        var v = localStorage.getItem("kancil:" + kunci);
        return v === null ? bawaan : JSON.parse(v);
      } catch (e) { return bawaan; }
    },
    taruh: function (kunci, nilai) {
      try { localStorage.setItem("kancil:" + kunci, JSON.stringify(nilai)); } catch (e) { /* abaikan */ }
    }
  };

  /* ---------- Ikon ---------- */
  function ikon(kode, alt, kelas) {
    return '<img src="assets/icons/' + kode + '.svg" alt="' + (alt || "") + '"' +
      (kelas ? ' class="' + kelas + '"' : "") + ' draggable="false">';
  }

  /* ---------- Suara: pembaca teks (bahasa Indonesia) ---------- */
  var suaraID = null;
  function cariSuara() {
    if (!("speechSynthesis" in window)) return;
    var semua = window.speechSynthesis.getVoices() || [];
    suaraID =
      semua.filter(function (s) { return /^id([-_]|$)/i.test(s.lang); })[0] ||
      semua.filter(function (s) { return /indonesia/i.test(s.name); })[0] ||
      null;
  }
  if ("speechSynthesis" in window) {
    cariSuara();
    window.speechSynthesis.onvoiceschanged = cariSuara;
  }

  function senyap() { return simpan.ambil("senyap", false); }

  function ucap(teks, selesai) {
    if (senyap() || !("speechSynthesis" in window)) { if (selesai) setTimeout(selesai, 300); return; }
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(teks);
      u.lang = "id-ID";
      if (suaraID) u.voice = suaraID;
      u.rate = 0.88;
      u.pitch = 1.15;
      if (selesai) u.onend = selesai;
      window.speechSynthesis.speak(u);
    } catch (e) { if (selesai) selesai(); }
  }

  /* ---------- Efek suara dengan Web Audio (tanpa file) ---------- */
  var ctx = null;
  function audio() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function nada(frek, mulai, lama, jenis, volume) {
    var a = audio(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain(), t = a.currentTime + mulai;
    o.type = jenis || "sine";
    o.frequency.setValueAtTime(frek, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(volume || 0.18, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + lama);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + lama + 0.05);
  }
  function efek(jenis) {
    if (senyap()) return;
    try {
      if (jenis === "benar") { [523, 659, 784].forEach(function (f, i) { nada(f, i * 0.1, 0.28, "triangle"); }); }
      else if (jenis === "salah") { nada(311, 0, 0.22, "sine", 0.15); nada(233, 0.16, 0.3, "sine", 0.15); }
      else if (jenis === "klik") { nada(880, 0, 0.08, "sine", 0.08); }
      else if (jenis === "pasang") { nada(660, 0, 0.1, "triangle", 0.1); }
      else if (jenis === "menang") {
        [523, 659, 784, 1047, 784, 1047].forEach(function (f, i) { nada(f, i * 0.13, 0.32, "triangle", 0.16); });
      }
    } catch (e) { /* abaikan */ }
  }

  /* ---------- Bintang ---------- */
  function bintang(modul) { return simpan.ambil("bintang:" + modul, 0); }
  function totalBintang() {
    return ["berhitung", "huruf", "cocokkan", "kenal"].reduce(function (n, m) { return n + bintang(m); }, 0);
  }
  function tambahBintang(modul, n) {
    simpan.taruh("bintang:" + modul, bintang(modul) + (n || 1));
    perbaruiBintang();
    var pil = document.querySelector(".pil-bintang");
    if (pil) { pil.classList.remove("goyang"); void pil.offsetWidth; pil.classList.add("goyang"); }
  }
  function perbaruiBintang() {
    document.querySelectorAll("[data-bintang]").forEach(function (el) {
      var m = el.getAttribute("data-bintang");
      el.textContent = m === "total" ? totalBintang() : bintang(m);
    });
  }

  /* ---------- Confetti ---------- */
  function confetti() {
    var warna = ["#FF8C42", "#3FA7F5", "#4CC98A", "#9B6BF2", "#FFC93C", "#FF8FA3"];
    var wadah = document.createElement("div");
    wadah.className = "confetti";
    wadah.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 70; i++) {
      var p = document.createElement("i");
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = warna[i % warna.length];
      p.style.animationDuration = 1.8 + Math.random() * 1.8 + "s";
      p.style.animationDelay = Math.random() * 0.6 + "s";
      p.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      if (i % 3 === 0) p.style.borderRadius = "50%";
      wadah.appendChild(p);
    }
    document.body.appendChild(wadah);
    setTimeout(function () { wadah.remove(); }, 4500);
  }

  /* ---------- Acak ---------- */
  function acak(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function angkaAcak(min, maks) { return min + Math.floor(Math.random() * (maks - min + 1)); }

  /* ---------- Maskot bereaksi ---------- */
  function maskotSenang() {
    var m = document.querySelector(".pemandu .maskot");
    if (!m) return;
    m.src = "assets/images/kancil-senang.svg";
    m.classList.remove("lompat"); void m.offsetWidth; m.classList.add("lompat");
    clearTimeout(m._t);
    m._t = setTimeout(function () { m.src = "assets/images/kancil.svg"; }, 1300);
  }

  /* ---------- Layar hasil akhir ---------- */
  var PUJIAN = ["Hebat sekali!", "Luar biasa!", "Pintar!", "Keren!"];
  function layarHasil(wadah, opsi) {
    // opsi: { modul, benar, total, ulang: fn, lanjut: fn|null, teksLanjut }
    var rasio = opsi.benar / opsi.total;
    var dapat = rasio >= 0.9 ? 3 : rasio >= 0.6 ? 2 : 1;
    var judul = dapat === 3 ? PUJIAN[angkaAcak(0, PUJIAN.length - 1)] : dapat === 2 ? "Bagus!" : "Terus berlatih, ya!";
    var bintangHtml = "";
    for (var i = 0; i < 3; i++) {
      bintangHtml += '<img src="assets/icons/2b50.svg" alt="" class="' + (i < dapat ? "" : "redup") +
        '" style="animation-delay:' + (0.2 + i * 0.25) + 's">';
    }
    wadah.innerHTML =
      '<section class="papan hasil" aria-live="polite">' +
      '<img class="maskot" src="assets/images/kancil-senang.svg" alt="Kancil gembira">' +
      "<h2>" + judul + "</h2>" +
      "<p>Kamu menjawab benar " + opsi.benar + " dari " + opsi.total + " soal.</p>" +
      '<div class="deret-bintang" aria-label="Kamu mendapat ' + dapat + ' bintang">' + bintangHtml + "</div>" +
      '<div class="aksi">' +
      (opsi.lanjut ? '<button class="tombol" data-aksi="lanjut">' + (opsi.teksLanjut || "Level berikutnya") + "</button>" : "") +
      '<button class="tombol putih" data-aksi="ulang">' + ikon("1f504") + " Main lagi</button>" +
      '<a class="tombol putih" href="index.html">' + ikon("1f3e0") + " Beranda</a>" +
      "</div></section>";
    tambahBintang(opsi.modul, dapat);
    efek("menang");
    confetti();
    setTimeout(function () { ucap(judul + " Kamu mendapat " + dapat + " bintang!"); }, 500);
    wadah.querySelector('[data-aksi="ulang"]').onclick = function () { efek("klik"); opsi.ulang(); };
    var l = wadah.querySelector('[data-aksi="lanjut"]');
    if (l) l.onclick = function () { efek("klik"); opsi.lanjut(); };
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- Bagian pemandu (Kancil + gelembung bicara) ---------- */
  function pemandu(teksTampil, teksUcap) {
    return '<div class="pemandu">' +
      '<img class="maskot" src="assets/images/kancil.svg" alt="Kancil">' +
      '<div class="gelembung"><button class="tombol-dengar" type="button" data-ucap="' +
      (teksUcap || teksTampil).replace(/"/g, "&quot;") + '">' +
      ikon("1f50a", "Dengarkan") + "<span>" + teksTampil + "</span></button></div></div>";
  }

  /* ---------- Titik kemajuan ---------- */
  function kemajuan(ke, total) {
    var h = '<div class="kemajuan" aria-label="Soal ' + (ke + 1) + ' dari ' + total + '">';
    for (var i = 0; i < total; i++) h += '<span class="' + (i < ke ? "selesai" : i === ke ? "sekarang" : "") + '"></span>';
    return h + "</div>";
  }

  /* ---------- Tombol suara on/off & tombol dengar ---------- */
  function aturTombolSuara() {
    var t = document.getElementById("tombol-suara");
    if (!t) return;
    function gambar() {
      var mati = senyap();
      t.innerHTML = ikon(mati ? "1f507" : "1f50a", "");
      t.setAttribute("aria-label", mati ? "Nyalakan suara" : "Matikan suara");
      t.setAttribute("aria-pressed", mati ? "true" : "false");
    }
    gambar();
    t.addEventListener("click", function () {
      simpan.taruh("senyap", !senyap());
      if (senyap() && "speechSynthesis" in window) window.speechSynthesis.cancel();
      gambar();
      efek("klik");
    });
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-ucap]");
    if (b) ucap(b.getAttribute("data-ucap"));
  });

  document.addEventListener("DOMContentLoaded", function () {
    aturTombolSuara();
    perbaruiBintang();
  });

  window.Kancil = {
    simpan: simpan, ikon: ikon, ucap: ucap, efek: efek,
    bintang: bintang, tambahBintang: tambahBintang, perbaruiBintang: perbaruiBintang,
    confetti: confetti, acak: acak, angkaAcak: angkaAcak,
    maskotSenang: maskotSenang, layarHasil: layarHasil, pemandu: pemandu, kemajuan: kemajuan
  };
})();
