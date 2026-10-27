/* =========================================================
   Modul: Cocokkan Gambar
   Mode "pasangan": ketuk satu kartu, lalu ketuk pasangannya.
   Mode "bunyi"   : dengarkan bunyi, lalu pilih hewannya.
   ========================================================= */
(function () {
  "use strict";
  var K = window.Kancil, D = window.DATA.cocokkan;
  var app = document.getElementById("app");
  var PUJIAN = ["Hebat!", "Pintar!", "Cocok!", "Benar!"];

  function menu() {
    var h = K.pemandu("Pilih permainan, ya!", "Mau main yang mana?") + '<div class="pilih-level">';
    D.level.forEach(function (lv, i) {
      var contoh;
      if (lv.jenis === "pasangan") {
        var p = lv.pasangan[0];
        contoh = K.ikon(p.kiri.ikon) + (p.kanan.ikon ? K.ikon(p.kanan.ikon) : '<span style="width:40px;height:40px;border-radius:50%;background:' + p.kanan.warna + ';margin-left:-8px;display:block"></span>');
      } else {
        contoh = K.ikon("1f50a") + K.ikon(lv.hewan[0].ikon);
      }
      h += '<button class="kartu-level" type="button" data-level="' + i + '">' +
        '<span class="ikon-level">' + contoh + "</span>" +
        '<span class="teks"><h3>' + lv.judul + "</h3><p>" + (lv.jenis === "bunyi" ? "Tebak suara hewan" : "Cari pasangannya") + "</p></span></button>";
    });
    app.innerHTML = h + "</div>";
    app.querySelectorAll("[data-level]").forEach(function (b) {
      b.onclick = function () { K.efek("klik"); mulai(+b.getAttribute("data-level")); };
    });
  }

  var st = null;

  function mulai(levelIdx) {
    var lv = D.level[levelIdx];
    if (lv.jenis === "pasangan") {
      var semua = K.acak(lv.pasangan.map(function (p, i) { return Object.assign({ id: i }, p); }));
      var ronde = [];
      for (var r = 0; r < lv.jumlahRonde; r++) ronde.push(semua.slice(r * lv.pasanganPerRonde, (r + 1) * lv.pasanganPerRonde));
      st = { level: levelIdx, lv: lv, ronde: ronde, ke: 0, totalPasangan: 0, kesalahan: 0 };
      ronde.forEach(function (x) { st.totalPasangan += x.length; });
      tampilRonde();
    } else {
      st = { level: levelIdx, lv: lv, soal: K.acak(lv.hewan).slice(0, lv.jumlahSoal), ke: 0, skor: 0 };
      // jika jumlah soal lebih banyak dari hewan, ulangi daftar
      while (st.soal.length < lv.jumlahSoal) st.soal = st.soal.concat(K.acak(lv.hewan)).slice(0, lv.jumlahSoal);
      tampilBunyi();
    }
  }

  /* ---------- Mode pasangan ---------- */
  function isiKartu(sisi) {
    if (sisi.ikon) return K.ikon(sisi.ikon) + "<span>" + sisi.nama + "</span>";
    return '<span class="warna" style="background:' + sisi.warna + '"></span><span>' + sisi.nama + "</span>";
  }

  function tampilRonde() {
    var pasangan = st.ronde[st.ke];
    st.dipilih = null;
    st.nomor = 0;
    st.sisa = pasangan.length;
    var kiri = K.acak(pasangan), kanan = K.acak(pasangan);
    var totalRonde = st.ronde.length;

    app.innerHTML =
      K.pemandu(st.lv.perintah) +
      (totalRonde > 1 ? K.kemajuan(st.ke, totalRonde) : "") +
      '<section class="papan">' +
      '<div class="kolom-cocok">' +
      '<div class="kolom">' + kiri.map(function (p) {
        return '<button type="button" class="kartu-cocok" data-sisi="kiri" data-id="' + p.id + '" data-nama="' + p.kiri.nama + '">' + isiKartu(p.kiri) + "</button>";
      }).join("") + "</div>" +
      '<div class="kolom">' + kanan.map(function (p) {
        return '<button type="button" class="kartu-cocok" data-sisi="kanan" data-id="' + p.id + '" data-nama="' + p.kanan.nama + '">' + isiKartu(p.kanan) + "</button>";
      }).join("") + "</div>" +
      "</div>" +
      '<div class="umpan-balik" aria-live="polite"></div>' +
      "</section>";

    app.querySelectorAll(".kartu-cocok").forEach(function (k) { k.onclick = function () { pilihKartu(k); }; });
    setTimeout(function () { K.ucap(st.lv.perintah); }, 350);
  }

  function pilihKartu(k) {
    if (k.classList.contains("cocok") || st.terkunci) return;
    var ub = app.querySelector(".umpan-balik");
    K.ucap(k.getAttribute("data-nama"));

    if (!st.dipilih || st.dipilih === k) {
      if (st.dipilih === k) { k.classList.remove("dipilih"); st.dipilih = null; return; }
      k.classList.add("dipilih");
      st.dipilih = k;
      K.efek("klik");
      return;
    }
    // memilih kartu di sisi yang sama: ganti pilihan
    if (st.dipilih.getAttribute("data-sisi") === k.getAttribute("data-sisi")) {
      st.dipilih.classList.remove("dipilih");
      k.classList.add("dipilih");
      st.dipilih = k;
      K.efek("klik");
      return;
    }
    var a = st.dipilih, b = k;
    if (a.getAttribute("data-id") === b.getAttribute("data-id")) {
      st.nomor++;
      [a, b].forEach(function (x) {
        x.classList.remove("dipilih");
        x.classList.add("cocok");
        x.setAttribute("data-pasangan", st.nomor);
        x.setAttribute("aria-disabled", "true");
      });
      st.dipilih = null;
      st.sisa--;
      var puji = PUJIAN[K.angkaAcak(0, PUJIAN.length - 1)];
      ub.className = "umpan-balik ok";
      ub.textContent = puji;
      K.efek("benar");
      K.maskotSenang();
      var kiriNama = (a.getAttribute("data-sisi") === "kiri" ? a : b).getAttribute("data-nama");
      var kananNama = (a.getAttribute("data-sisi") === "kanan" ? a : b).getAttribute("data-nama");
      setTimeout(function () { K.ucap(puji + " " + kiriNama + " dan " + kananNama.toLowerCase() + "."); }, 200);
      if (st.sisa === 0) {
        st.terkunci = true;
        setTimeout(function () {
          st.terkunci = false;
          st.ke++;
          if (st.ke < st.ronde.length) tampilRonde(); else selesaiPasangan();
        }, 1900);
      }
    } else {
      st.kesalahan++;
      st.terkunci = true;
      [a, b].forEach(function (x) { x.classList.remove("dipilih"); x.classList.add("salah-pilih"); });
      ub.className = "umpan-balik coba";
      ub.textContent = "Bukan pasangannya. Coba lagi!";
      K.efek("salah");
      setTimeout(function () { K.ucap("Bukan pasangannya. Coba lagi, ya!"); }, 200);
      st.dipilih = null;
      setTimeout(function () {
        st.terkunci = false;
        [a, b].forEach(function (x) { x.classList.remove("salah-pilih"); });
      }, 600);
    }
  }

  function selesaiPasangan() {
    var benar = Math.max(0, st.totalPasangan - st.kesalahan);
    akhir(benar, st.totalPasangan);
  }

  /* ---------- Mode bunyi ---------- */
  function tampilBunyi() {
    var s = st.soal[st.ke];
    st.salahDiSoalIni = false;
    st.terkunci = false;
    var lain = K.acak(st.lv.hewan.filter(function (h) { return h.nama !== s.nama; })).slice(0, 2);
    var pilihan = K.acak([s].concat(lain));

    app.innerHTML =
      K.pemandu(st.lv.perintah) +
      K.kemajuan(st.ke, st.soal.length) +
      '<section class="papan">' +
      '<button type="button" class="bunyi-besar" data-ucap="' + s.bunyi + '">' + K.ikon("1f50a") + " Dengar bunyi</button>" +
      '<div class="pilihan-gambar">' +
      pilihan.map(function (h) {
        return '<button type="button" data-hewan="' + h.nama + '" aria-label="' + h.nama + '">' + K.ikon(h.ikon, h.nama) + "</button>";
      }).join("") +
      "</div>" +
      '<div class="umpan-balik" aria-live="polite"></div>' +
      "</section>";

    app.querySelectorAll("[data-hewan]").forEach(function (b) {
      b.onclick = function () { jawabBunyi(b, b.getAttribute("data-hewan")); };
    });
    setTimeout(function () { K.ucap("Hewan apa yang bunyinya begini? " + s.bunyi); }, 350);
  }

  function jawabBunyi(tombol, nama) {
    if (st.terkunci) return;
    var s = st.soal[st.ke];
    var ub = app.querySelector(".umpan-balik");
    if (nama === s.nama) {
      st.terkunci = true;
      if (!st.salahDiSoalIni) st.skor++;
      tombol.classList.add("benar");
      ub.className = "umpan-balik ok";
      ub.textContent = "Benar! Itu " + s.nama + ".";
      K.efek("benar");
      K.maskotSenang();
      setTimeout(function () { K.ucap("Benar! Itu suara " + s.nama + ". " + s.bunyi); }, 200);
      setTimeout(function () {
        st.ke++;
        if (st.ke < st.soal.length) tampilBunyi(); else akhir(st.skor, st.soal.length);
      }, 2300);
    } else {
      st.salahDiSoalIni = true;
      tombol.classList.remove("salah"); void tombol.offsetWidth; tombol.classList.add("salah");
      ub.className = "umpan-balik coba";
      ub.textContent = "Itu " + nama + ". Coba lagi!";
      K.efek("salah");
      setTimeout(function () { K.ucap("Itu " + nama + ". Coba lagi, ya!"); }, 200);
    }
  }

  function akhir(benar, total) {
    var berikut = st.level + 1 < D.level.length ? st.level + 1 : null;
    K.layarHasil(app, {
      modul: "cocokkan", benar: benar, total: total,
      ulang: function () { mulai(st.level); },
      lanjut: berikut !== null ? function () { mulai(berikut); } : null,
      teksLanjut: "Permainan berikutnya"
    });
  }

  menu();
})();
