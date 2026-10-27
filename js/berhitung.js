/* =========================================================
   Modul: Ayo Berhitung
   ========================================================= */
(function () {
  "use strict";
  var K = window.Kancil, D = window.DATA.berhitung;
  var app = document.getElementById("app");
  var PUJIAN = ["Hebat!", "Pintar!", "Benar sekali!", "Keren!", "Mantap!"];

  function terbilang(n) {
    var a = window.DATA.kenal.angka.filter(function (x) { return x.n === n; })[0];
    return a ? a.kata : String(n);
  }

  /* ---------- Menu level ---------- */
  function menu() {
    var h = K.pemandu("Pilih level, ya!", "Pilih level dulu, ya!") + '<div class="pilih-level">';
    D.level.forEach(function (lv, i) {
      h += '<button class="kartu-level" type="button" data-level="' + i + '">' +
        '<span class="angka-level">' + (i + 1) + "</span>" +
        '<span class="teks"><h3>' + lv.judul + "</h3><p>" + lv.ket + "</p></span></button>";
    });
    app.innerHTML = h + "</div>";
    app.querySelectorAll("[data-level]").forEach(function (b) {
      b.onclick = function () { K.efek("klik"); mulai(+b.getAttribute("data-level")); };
    });
  }

  /* ---------- Buat daftar soal ---------- */
  function buatSoal(lv) {
    var soal = [], sebelum = -1;
    for (var i = 0; i < lv.jumlahSoal; i++) {
      var benda = D.benda[K.angkaAcak(0, D.benda.length - 1)];
      var s;
      if (lv.jenis === "hitung") {
        var n;
        do { n = K.angkaAcak(lv.min, lv.maks); } while (n === sebelum);
        sebelum = n;
        s = { jenis: "hitung", jawaban: n, benda: benda, batasAtas: lv.maks + 2 };
      } else {
        var a = K.angkaAcak(1, 5), b = K.angkaAcak(1, Math.min(5, lv.maksHasil - a));
        s = { jenis: "tambah", a: a, b: b, jawaban: a + b, benda: benda, batasAtas: lv.maksHasil + 2 };
      }
      s.pilihan = buatPilihan(s.jawaban, s.batasAtas);
      soal.push(s);
    }
    return soal;
  }

  function buatPilihan(benar, batas) {
    var p = [benar];
    while (p.length < 3) {
      var x = benar + K.angkaAcak(-2, 2);
      if (x >= 1 && x <= batas && p.indexOf(x) === -1) p.push(x);
    }
    return p.sort(function (x, y) { return x - y; });
  }

  /* ---------- Jalannya permainan ---------- */
  var st = null;

  function mulai(levelIdx) {
    st = { level: levelIdx, soal: buatSoal(D.level[levelIdx]), ke: 0, skor: 0, salahDiSoalIni: false };
    tampilSoal();
  }

  function kalimatSoal(s) {
    if (s.jenis === "hitung") return { tampil: "Ada berapa " + s.benda.nama + "?", ucap: "Ada berapa " + s.benda.nama + "?" };
    return {
      tampil: s.a + " tambah " + s.b + ", jadi berapa?",
      ucap: terbilang(s.a) + " " + s.benda.nama + ", tambah " + terbilang(s.b) + " " + s.benda.nama + ". Jadi berapa?"
    };
  }

  function tampilSoal() {
    var s = st.soal[st.ke];
    st.salahDiSoalIni = false;
    st.hitungan = 0;
    var k = kalimatSoal(s);
    var benda = "";
    var no = 0;
    function img() {
      no++;
      return '<img src="assets/icons/' + s.benda.ikon + '.svg" alt="' + s.benda.nama + '" draggable="false" style="animation-delay:' + (no * 0.06) + 's">';
    }
    if (s.jenis === "hitung") {
      for (var i = 0; i < s.jawaban; i++) benda += img();
    } else {
      var g1 = "", g2 = "";
      for (var a = 0; a < s.a; a++) g1 += img();
      for (var b = 0; b < s.b; b++) g2 += img();
      benda = '<div class="grup">' + g1 + '</div><span class="tanda" aria-hidden="true">+</span><div class="grup">' + g2 + "</div>";
    }

    app.innerHTML =
      K.pemandu(k.tampil, k.ucap) +
      K.kemajuan(st.ke, st.soal.length) +
      '<section class="papan">' +
      (s.jenis === "tambah" ? '<div class="soal-angka">' + s.a + " + " + s.b + " = ?</div>" : "") +
      '<div class="kumpulan-benda' + (s.jenis === "tambah" ? " tambah" : "") + '" title="Ketuk bendanya untuk menghitung">' + benda + "</div>" +
      '<div class="pilihan-angka">' +
      s.pilihan.map(function (p) { return '<button type="button" data-jawab="' + p + '" aria-label="' + p + '">' + p + "</button>"; }).join("") +
      "</div>" +
      '<div class="umpan-balik" aria-live="polite"></div>' +
      "</section>";

    // ketuk benda untuk membantu menghitung
    app.querySelectorAll(".kumpulan-benda img").forEach(function (im) {
      im.addEventListener("click", function () {
        if (im.classList.contains("dihitung")) return;
        im.classList.add("dihitung");
        st.hitungan++;
        K.efek("pasang");
        K.ucap(terbilang(st.hitungan));
      });
    });

    app.querySelectorAll("[data-jawab]").forEach(function (b) {
      b.onclick = function () { jawab(b, +b.getAttribute("data-jawab")); };
    });

    setTimeout(function () { K.ucap(k.ucap); }, 350);
  }

  function jawab(tombol, nilai) {
    var s = st.soal[st.ke];
    var ub = app.querySelector(".umpan-balik");
    if (st.terkunci) return;
    if (nilai === s.jawaban) {
      st.terkunci = true;
      if (!st.salahDiSoalIni) st.skor++;
      tombol.classList.add("benar");
      var puji = PUJIAN[K.angkaAcak(0, PUJIAN.length - 1)];
      ub.className = "umpan-balik ok";
      ub.textContent = puji + " Jawabannya " + s.jawaban + ".";
      K.efek("benar");
      K.maskotSenang();
      K.ucap(puji + " Jawabannya " + terbilang(s.jawaban) + ".");
      setTimeout(function () {
        st.terkunci = false;
        st.ke++;
        if (st.ke < st.soal.length) tampilSoal(); else selesai();
      }, 1900);
    } else {
      st.salahDiSoalIni = true;
      tombol.classList.remove("salah"); void tombol.offsetWidth; tombol.classList.add("salah");
      ub.className = "umpan-balik coba";
      ub.textContent = "Coba lagi, ya!";
      K.efek("salah");
      K.ucap("Coba lagi, ya! Ketuk bendanya untuk menghitung.");
    }
  }

  function selesai() {
    var berikut = st.level + 1 < D.level.length ? st.level + 1 : null;
    K.layarHasil(app, {
      modul: "berhitung", benar: st.skor, total: st.soal.length,
      ulang: function () { mulai(st.level); },
      lanjut: berikut !== null ? function () { mulai(berikut); } : null
    });
  }

  menu();
})();
