/* =========================================================
   Modul: Kenal Huruf & Angka
   Tab Huruf : ketuk huruf untuk mendengar & melihat contohnya
   Tab Angka : ketuk angka untuk melihat jumlah bendanya
   Tab Tebak : kuis kecil "Mana huruf B?"
   ========================================================= */
(function () {
  "use strict";
  var K = window.Kancil, D = window.DATA.kenal;
  var app = document.getElementById("app");
  var tab = "huruf";

  function kerangka() {
    var tabs = [
      { id: "huruf", label: "Huruf", ikon: "1f524" },
      { id: "angka", label: "Angka", ikon: "1f522" },
      { id: "tebak", label: "Tebak", ikon: "1f9e9" }
    ];
    return '<div class="tab-kenal" role="tablist">' + tabs.map(function (t) {
      return '<button type="button" role="tab" data-tab="' + t.id + '" aria-selected="' + (t.id === tab) + '">' +
        K.ikon(t.ikon) + t.label + "</button>";
    }).join("") + "</div>";
  }

  function pasangTab() {
    app.querySelectorAll("[data-tab]").forEach(function (b) {
      b.onclick = function () { K.efek("klik"); tab = b.getAttribute("data-tab"); tampil(); };
    });
  }

  function tampil() {
    if (tab === "huruf") tampilHuruf(0, false);
    else if (tab === "angka") tampilAngka(0, false);
    else mulaiTebak();
  }

  /* ---------- Huruf ---------- */
  function tampilHuruf(idx, bicara) {
    var x = D.huruf[idx];
    app.innerHTML =
      K.pemandu("Ketuk huruf untuk mendengarnya!", "Ketuk huruf untuk mendengar bunyinya!") +
      kerangka() +
      '<section class="papan">' +
      '<div class="kartu-tampil" aria-live="polite">' +
      '<div class="besar">' + x.h + "<small>" + x.h.toLowerCase() + "</small></div>" +
      '<button type="button" class="contoh" style="border:none;background:none;cursor:pointer" data-ucap="' + x.h + " untuk " + x.kata + '">' +
      K.ikon(x.ikon, x.kata) + "<span><b>" + x.kata.charAt(0) + "</b>" + x.kata.slice(1).toLowerCase() + "</span></button>" +
      "</div>" +
      '<div class="kisi-huruf">' + D.huruf.map(function (h, i) {
        return '<button type="button" data-i="' + i + '" class="' + (i === idx ? "aktif" : "") + '" aria-label="Huruf ' + h.h + '">' + h.h + "</button>";
      }).join("") + "</div></section>";
    pasangTab();
    app.querySelectorAll(".kisi-huruf [data-i]").forEach(function (b) {
      b.onclick = function () { tampilHuruf(+b.getAttribute("data-i"), true); };
    });
    if (bicara) { K.efek("klik"); K.ucap(x.h + ". " + x.h + " untuk " + x.kata + "."); }
  }

  /* ---------- Angka ---------- */
  function tampilAngka(idx, bicara) {
    var x = D.angka[idx];
    var ikonBenda = D.bendaAngka[idx % D.bendaAngka.length];
    var deret = "";
    for (var i = 0; i < x.n; i++) deret += '<img src="assets/icons/' + ikonBenda + '.svg" alt="" style="animation-delay:' + (i * 0.07) + 's">';
    app.innerHTML =
      K.pemandu("Ketuk angka untuk menghitung!", "Ketuk angka, lalu hitung bendanya!") +
      kerangka() +
      '<section class="papan">' +
      '<div class="kartu-tampil" aria-live="polite">' +
      '<div class="besar">' + x.n + "</div>" +
      '<div class="contoh"><div class="deret" aria-label="' + x.n + ' benda">' + deret + "</div><span><b>" + x.kata + "</b></span></div>" +
      "</div>" +
      '<div class="kisi-huruf" style="grid-template-columns:repeat(5,1fr)">' + D.angka.map(function (a, i) {
        return '<button type="button" data-i="' + i + '" class="' + (i === idx ? "aktif" : "") + '" aria-label="Angka ' + a.n + '">' + a.n + "</button>";
      }).join("") + "</div></section>";
    pasangTab();
    app.querySelectorAll(".kisi-huruf [data-i]").forEach(function (b) {
      b.onclick = function () { tampilAngka(+b.getAttribute("data-i"), true); };
    });
    if (bicara) { K.efek("klik"); K.ucap(x.kata); }
  }

  /* ---------- Tebak ---------- */
  var st = null;

  function mulaiTebak() {
    var soal = [];
    for (var i = 0; i < D.jumlahSoalTebak; i++) {
      if (i % 2 === 0) {
        var h = D.huruf[K.angkaAcak(0, D.huruf.length - 1)];
        var lainH = K.acak(D.huruf.filter(function (x) { return x.h !== h.h; })).slice(0, 3).map(function (x) { return x.h; });
        soal.push({ jenis: "huruf", jawaban: h.h, pilihan: K.acak([h.h].concat(lainH)), tanya: "Mana huruf " + h.h + "?" });
      } else {
        var a = D.angka[K.angkaAcak(0, D.angka.length - 1)];
        var lainA = K.acak(D.angka.filter(function (x) { return x.n !== a.n; })).slice(0, 3).map(function (x) { return String(x.n); });
        soal.push({ jenis: "angka", jawaban: String(a.n), pilihan: K.acak([String(a.n)].concat(lainA)), tanya: "Mana angka " + a.kata + "?" });
      }
    }
    st = { soal: soal, ke: 0, skor: 0 };
    tampilTebak();
  }

  function tampilTebak() {
    var s = st.soal[st.ke];
    st.salahDiSoalIni = false;
    st.terkunci = false;
    app.innerHTML =
      K.pemandu(s.tanya) +
      kerangka() +
      K.kemajuan(st.ke, st.soal.length) +
      '<section class="papan">' +
      '<div class="pilihan-angka empat">' + s.pilihan.map(function (p) {
        return '<button type="button" data-jawab="' + p + '" style="font-family:var(--isi)">' + p + "</button>";
      }).join("") + "</div>" +
      '<div class="umpan-balik" aria-live="polite"></div></section>';
    pasangTab();
    app.querySelectorAll("[data-jawab]").forEach(function (b) {
      b.onclick = function () { jawab(b, b.getAttribute("data-jawab")); };
    });
    setTimeout(function () { K.ucap(s.tanya); }, 350);
  }

  function jawab(tombol, nilai) {
    if (st.terkunci) return;
    var s = st.soal[st.ke];
    var ub = app.querySelector(".umpan-balik");
    if (nilai === s.jawaban) {
      st.terkunci = true;
      if (!st.salahDiSoalIni) st.skor++;
      tombol.classList.add("benar");
      ub.className = "umpan-balik ok";
      ub.textContent = "Hebat! Benar!";
      K.efek("benar");
      K.maskotSenang();
      K.ucap("Hebat! Benar!");
      setTimeout(function () {
        st.ke++;
        if (st.ke < st.soal.length) tampilTebak();
        else {
          K.layarHasil(app, { modul: "kenal", benar: st.skor, total: st.soal.length, ulang: mulaiTebak, lanjut: null });
        }
      }, 1600);
    } else {
      st.salahDiSoalIni = true;
      tombol.classList.remove("salah"); void tombol.offsetWidth; tombol.classList.add("salah");
      ub.className = "umpan-balik coba";
      ub.textContent = "Coba lagi, ya!";
      K.efek("salah");
      K.ucap("Coba lagi, ya! " + s.tanya);
    }
  }

  tampil();
})();
