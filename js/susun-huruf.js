/* =========================================================
   Modul: Susun Huruf
   Ketuk huruf untuk mengisi kotak. Ketuk kotak untuk
   mengembalikan hurufnya.
   ========================================================= */
(function () {
  "use strict";
  var K = window.Kancil, D = window.DATA.susunHuruf;
  var app = document.getElementById("app");
  var PUJIAN = ["Hebat!", "Pintar!", "Benar sekali!", "Keren!"];

  function menu() {
    var h = K.pemandu("Pilih level, ya!", "Pilih level dulu, ya!") + '<div class="pilih-level">';
    D.level.forEach(function (lv, i) {
      var contoh = lv.kata.slice(0, 3).map(function (k) { return K.ikon(k.ikon); }).join("");
      h += '<button class="kartu-level" type="button" data-level="' + i + '">' +
        '<span class="ikon-level">' + contoh + "</span>" +
        '<span class="teks"><h3>' + lv.judul + "</h3><p>" + lv.ket + "</p></span></button>";
    });
    app.innerHTML = h + "</div>";
    app.querySelectorAll("[data-level]").forEach(function (b) {
      b.onclick = function () { K.efek("klik"); mulai(+b.getAttribute("data-level")); };
    });
  }

  var st = null;

  function mulai(levelIdx) {
    var lv = D.level[levelIdx];
    st = { level: levelIdx, soal: K.acak(lv.kata).slice(0, lv.jumlahSoal), ke: 0, skor: 0 };
    tampilSoal();
  }

  function acakHuruf(kata) {
    var huruf = kata.split(""), hasil;
    var coba = 0;
    do { hasil = K.acak(huruf); coba++; } while (hasil.join("") === kata && coba < 20);
    return hasil;
  }

  function tampilSoal() {
    var s = st.soal[st.ke];
    st.sempurna = true;
    st.terkunci = false;
    st.isi = new Array(s.kata.length).fill(null); // isi[i] = indeks ubin
    st.ubin = acakHuruf(s.kata);
    var namaKecil = s.kata.toLowerCase();

    app.innerHTML =
      K.pemandu("Susun huruf menjadi kata!", "Gambar apa ini? Susun hurufnya menjadi kata " + namaKecil + ".") +
      K.kemajuan(st.ke, st.soal.length) +
      '<section class="papan">' +
      '<img class="gambar-soal" src="assets/icons/' + s.ikon + '.svg" alt="Gambar ' + namaKecil + '" data-ucap="' + namaKecil + '" style="cursor:pointer">' +
      '<div class="petunjuk-kata">' + s.kata.length + " huruf</div>" +
      '<div class="slot-huruf" aria-label="Kotak jawaban"></div>' +
      '<div class="kotak-huruf" aria-label="Pilihan huruf"></div>' +
      '<div class="umpan-balik" aria-live="polite"></div>' +
      '<div class="aksi-bawah">' +
      '<button class="tombol putih kecil" type="button" data-aksi="hapus">' + K.ikon("1f504") + " Ulangi</button>" +
      '<button class="tombol putih kecil" type="button" data-aksi="bantu">' + K.ikon("1f4a1") + " Bantuan</button>" +
      "</div></section>";

    gambarUlang();
    app.querySelector('[data-aksi="hapus"]').onclick = function () { if (st.terkunci) return; K.efek("klik"); kosongkan(); };
    app.querySelector('[data-aksi="bantu"]').onclick = bantuan;
    setTimeout(function () { K.ucap("Gambar apa ini? Susun hurufnya menjadi kata " + namaKecil + "."); }, 350);
  }

  function gambarUlang() {
    var s = st.soal[st.ke];
    var slot = app.querySelector(".slot-huruf"), kotak = app.querySelector(".kotak-huruf");
    slot.innerHTML = st.isi.map(function (u, i) {
      return '<button type="button" data-slot="' + i + '" class="' + (u === null ? "" : "isi") + '" aria-label="' +
        (u === null ? "Kotak kosong" : "Huruf " + st.ubin[u]) + '">' + (u === null ? "" : st.ubin[u]) + "</button>";
    }).join("");
    kotak.innerHTML = st.ubin.map(function (h, i) {
      var dipakai = st.isi.indexOf(i) !== -1;
      return '<button type="button" data-ubin="' + i + '" class="' + (dipakai ? "terpakai" : "") + '" aria-label="Huruf ' + h + '"' +
        (dipakai ? ' tabindex="-1"' : "") + ">" + h + "</button>";
    }).join("");

    slot.querySelectorAll("[data-slot]").forEach(function (b) {
      b.onclick = function () {
        if (st.terkunci) return;
        var i = +b.getAttribute("data-slot");
        if (st.isi[i] === null) return;
        st.isi[i] = null;
        K.efek("klik");
        gambarUlang();
      };
    });
    kotak.querySelectorAll("[data-ubin]").forEach(function (b) {
      b.onclick = function () {
        if (st.terkunci) return;
        var u = +b.getAttribute("data-ubin");
        var kosong = st.isi.indexOf(null);
        if (kosong === -1 || st.isi.indexOf(u) !== -1) return;
        st.isi[kosong] = u;
        K.efek("pasang");
        K.ucap(st.ubin[u]);
        gambarUlang();
        if (st.isi.indexOf(null) === -1) periksa();
      };
    });
    void s;
  }

  function kosongkan() {
    st.isi = st.isi.map(function () { return null; });
    gambarUlang();
  }

  function bantuan() {
    if (st.terkunci) return;
    var s = st.soal[st.ke];
    st.sempurna = false;
    // cari kotak pertama yang kosong atau salah
    for (var i = 0; i < s.kata.length; i++) {
      var u = st.isi[i];
      if (u === null || st.ubin[u] !== s.kata[i]) {
        if (u !== null) st.isi[i] = null;
        // cari ubin bebas dengan huruf yang benar
        for (var j = 0; j < st.ubin.length; j++) {
          if (st.ubin[j] === s.kata[i] && st.isi.indexOf(j) === -1) {
            // jika ubin itu dipakai di kotak lain, lepaskan dulu
            st.isi[i] = j;
            break;
          }
        }
        if (st.isi[i] === null) {
          // huruf yang benar sedang dipakai di kotak yang salah: pindahkan
          for (var k = 0; k < st.isi.length; k++) {
            var uk = st.isi[k];
            if (uk !== null && k !== i && st.ubin[uk] === s.kata[i] && st.ubin[uk] !== s.kata[k]) {
              st.isi[k] = null; st.isi[i] = uk; break;
            }
          }
        }
        K.efek("pasang");
        K.ucap(s.kata[i]);
        gambarUlang();
        if (st.isi.indexOf(null) === -1) periksa();
        return;
      }
    }
  }

  function periksa() {
    var s = st.soal[st.ke];
    var jawaban = st.isi.map(function (u) { return st.ubin[u]; }).join("");
    var slot = app.querySelector(".slot-huruf");
    var ub = app.querySelector(".umpan-balik");
    st.terkunci = true;
    if (jawaban === s.kata) {
      if (st.sempurna) st.skor++;
      slot.classList.add("benar-semua");
      var puji = PUJIAN[K.angkaAcak(0, PUJIAN.length - 1)];
      ub.className = "umpan-balik ok";
      ub.textContent = puji + " " + s.kata;
      K.efek("benar");
      K.maskotSenang();
      setTimeout(function () { K.ucap(puji + " " + s.kata.toLowerCase() + "!"); }, 250);
      setTimeout(function () {
        st.ke++;
        if (st.ke < st.soal.length) tampilSoal(); else selesai();
      }, 2100);
    } else {
      st.sempurna = false;
      slot.classList.add("salah-semua");
      ub.className = "umpan-balik coba";
      ub.textContent = "Belum tepat. Coba lagi, ya!";
      K.efek("salah");
      K.ucap("Belum tepat. Coba lagi, ya!");
      setTimeout(function () {
        st.terkunci = false;
        // kembalikan hanya huruf yang salah posisinya
        st.isi = st.isi.map(function (u, i) { return st.ubin[u] === s.kata[i] ? u : null; });
        gambarUlang();
      }, 900);
    }
  }

  function selesai() {
    var berikut = st.level + 1 < D.level.length ? st.level + 1 : null;
    K.layarHasil(app, {
      modul: "huruf", benar: st.skor, total: st.soal.length,
      ulang: function () { mulai(st.level); },
      lanjut: berikut !== null ? function () { mulai(berikut); } : null
    });
  }

  menu();
})();
