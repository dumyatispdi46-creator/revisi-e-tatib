/** APLIKASI TATIB SMAN 1 PRONOJIWO — Backend (Google Apps Script + Google Sheets)
 *  Pasang: Extensions > Apps Script pada Google Sheet kosong, salin Code.gs, SeedData.gs, Index.html.
 *  Deploy > New deployment > Web app (Execute as: Me, Access: Anyone). Data & akun awal dibuat otomatis. */
var H = {
  Users: ['username', 'hash', 'nama', 'nip', 'role', 'kelas', 'aktif'],
  Siswa: ['nis', 'nama', 'jk', 'kelas'],
  Poin: ['id', 'jenis', 'nama', 'poin'],
  Catatan: ['id', 'jenis', 'nis', 'nama', 'kelas', 'poinId', 'uraian', 'poin', 'tanggal', 'oleh', 'periode', 'waktu'],
  Config: ['key', 'value'],
  Penanganan: ['id', 'nis', 'nama', 'kelas', 'tahap', 'poin', 'status', 'tanggal', 'oleh', 'catatan', 'periode', 'waktu']
};
var PERM = {
  admin: ['input', 'rekap', 'poin', 'siswa', 'akun', 'periode', 'hapus'],
  kepsek: ['input', 'rekap'], tu: ['input', 'rekap', 'siswa'], guru: ['input', 'rekap'], walikelas: ['input', 'rekap'],
  waka_humas: ['input', 'rekap'], waka_sarpras: ['input', 'rekap'], waka_kurikulum: ['input', 'rekap']
};
var SEED_POIN = [
  ["Pelanggaran", "Sikap: Tidak membawa buku sesuai jadwal.", 10],
  ["Pelanggaran", "Sikap: Membuat kegaduhan di kelas atau di sekolah.", 10],
  ["Pelanggaran", "Sikap: Mencoret-coret atau mengotori dinding, pintu, meja, kursi, pagar sekolah.", 10],
  ["Pelanggaran", "Sikap: Membawa atau bermain kartu remi dan domino di sekolah.", 10],
  ["Pelanggaran", "Sikap: Bermain bola di koridor dan di dalam kelas.", 10],
  ["Pelanggaran", "Sikap: Menyontek.", 10],
  ["Pelanggaran", "Sikap: Melindungi teman yang bersalah.", 15],
  ["Pelanggaran", "Sikap: Mengoperasikan handphone saat KBM berlangsung, tanpa seizin guru.", 20],
  ["Pelanggaran", "Sikap: Merayakan ulang tahun berlebihan.", 20],
  ["Pelanggaran", "Sikap: Menyalahgunakan uang SPP atau uang sekolah.", 25],
  ["Pelanggaran", "Sikap: Berpacaran di sekolah.", 25],
  ["Pelanggaran", "Sikap: Membawa atau membunyikan petasan.", 30],
  ["Pelanggaran", "Sikap: Memarkir sepeda / motor di luar sekolah", 40],
  ["Pelanggaran", "Sikap: Membuat surat izin palsu", 40],
  ["Pelanggaran", "Sikap: Meloncat jendela dan pagar sekolah.", 40],
  ["Pelanggaran", "Sikap: Merusak sarana dan prasarana sekolah.", 40],
  ["Pelanggaran", "Sikap: Bertindak tidak sopan / melecehkan kepala sekolah, guru, karyawan sekolah, maupun sesama peserta didik.", 50],
  ["Pelanggaran", "Sikap: Mengancam / mengintimidasi teman sekelas / teman sekolah.", 75],
  ["Pelanggaran", "Sikap: Mengancam / mengintimidasi Kepala sekolah, guru, dan karyawan.", 100],
  ["Pelanggaran", "Sikap: Membawa / merokok saat masih mengenakan seragam sekolah.", 100],
  ["Pelanggaran", "Sikap: Menyalahgunakan media sosial yang merugikan pihak lain yang berhubungan dengan sekolah.", 100],
  ["Pelanggaran", "Sikap: Berperilaku jorok atau asusila, baik di dalam maupun di luar sekolah.", 100],
  ["Pelanggaran", "Sikap: Berjudi dalam bentuk apapun di sekolah.", 150],
  ["Pelanggaran", "Sikap: Membawa senjata tajam, senjata api, dsb. di sekolah.", 150],
  ["Pelanggaran", "Sikap: Terlibat langsung maupun tidak langsung perkelahian / tawuran di sekolah, di luar sekolah, atau antar sekolah.", 150],
  ["Pelanggaran", "Sikap: Mengikuti aliran / perkumpulan / geng terlarang / komunitas LGBT dan radikalisme.", 150],
  ["Pelanggaran", "Sikap: Membawa, menggunakan, atau mengedarkan miras dan narkoba.", 250],
  ["Pelanggaran", "Sikap: Membawa dan / membuat VCD porno, buku porno, majalah porno atau sesuatu yang berbau pornografi dan pornoaksi.", 200],
  ["Pelanggaran", "Sikap: Mencuri di sekolah dan di luar sekolah.", 200],
  ["Pelanggaran", "Sikap: Memalsukan stempel sekolah, edaran sekolah, atau tanda tangan Kepala Sekolah, guru, dan karyawan sekolah.", 250],
  ["Pelanggaran", "Sikap: Terlibat tindakan kriminal, mencemarkan nama baik sekolah.", 250],
  ["Pelanggaran", "Sikap: Terbukti hamil atau menghamili.", 500],
  ["Pelanggaran", "Sikap: Terbukti menikah.", 500],
  ["Pelanggaran", "Kerajinan: Datang terlambat.", 10],
  ["Pelanggaran", "Kerajinan: Terlambat masuk kelas melebihi batas waktu normal", 10],
  ["Pelanggaran", "Kerajinan: Tidak mengikuti pelajaran tanpa izin.", 10],
  ["Pelanggaran", "Kerajinan: Meninggalkan kelas tanpa izin.", 10],
  ["Pelanggaran", "Kerajinan: Di kantin saat jam pelajaran.", 10],
  ["Pelanggaran", "Kerajinan: Tidak mengikuti dan melaksanakan piket 7K.", 10],
  ["Pelanggaran", "Kerajinan: Tidur di kelas saat pelajaran berlangsung.", 10],
  ["Pelanggaran", "Kerajinan: Tidak membawa buku yang berkaitan dengan pelajaran.", 10],
  ["Pelanggaran", "Kerajinan: Pulang sebelum waktunya tanpa izin dari sekolah.", 20],
  ["Pelanggaran", "Kerajinan: Tidak masuk sekolah tanpa keterangan.", 20],
  ["Pelanggaran", "Kerajinan: Tidak mengikuti upacara.", 20],
  ["Pelanggaran", "Kerajinan: Tidak mengikuti kegiatan sekolah.", 20],
  ["Pelanggaran", "Kerajinan: Tidak mengikuti kegiatan ekstrakurikuler.", 20],
  ["Pelanggaran", "Kerajinan: Tidak memakai helm (berangkat+pulang sekolah)", 20],
  ["Pelanggaran", "Kerapian: Tidak berseragam sesuai dengan ketentuan.", 10],
  ["Pelanggaran", "Kerapian: Tidak memasukkan baju.", 10],
  ["Pelanggaran", "Kerapian: Melipat lengan baju, baju tidak dikancingkan.", 10],
  ["Pelanggaran", "Kerapian: Seragam yang dicoret-coret.", 10],
  ["Pelanggaran", "Kerapian: Celana atau rok bawah tidak dikelim.", 10],
  ["Pelanggaran", "Kerapian: Celana atau rok sobek.", 10],
  ["Pelanggaran", "Kerapian: Tidak memakai kaos kaki.", 10],
  ["Pelanggaran", "Kerapian: Memakai kaos kaki tidak sesuai ketentuan", 10],
  ["Pelanggaran", "Kerapian: Tidak memakai ikat pinggang.", 10],
  ["Pelanggaran", "Kerapian: Memakai ikat pinggang tidak sesuai dengan ketentuan (hitam)", 10],
  ["Pelanggaran", "Kerapian: Seragam atribut tidak lengkap.", 10],
  ["Pelanggaran", "Kerapian: Tidak memakai sepatu hitam (selain olahraga).", 10],
  ["Pelanggaran", "Kerapian: Rambut diwarnai (putra-putri), berambut panjang terurai (peserta didik putri).", 10],
  ["Pelanggaran", "Kerapian: Memakai make up", 10],
  ["Pelanggaran", "Kerapian: Memakai perhiasan berlebihan", 10],
  ["Pelanggaran", "Kerapian: Tidak memakai seragam olah raga saat jam olah raga", 10],
  ["Penghargaan", "Prestasi tingkat Nasional", 100],
  ["Penghargaan", "Prestasi tingkat Provinsi", 75],
  ["Penghargaan", "Prestasi tingkat Kota/Kabupaten", 50],
  ["Penghargaan", "Prestasi tingkat Kecamatan", 25],
  ["Penghargaan", "Mengikuti lomba sebagai peserta (tidak juara)", 10],
  ["Penghargaan", "Mengikuti pelatihan LDKMS", 15],
  ["Penghargaan", "Diangkat menjadi ketua OSIS", 25],
  ["Penghargaan", "Diangkat menjadi pengurus OSIS", 20],
  ["Penghargaan", "Tidak pernah alpa (bagi siswa yang punya catatan pelanggaran)", 25],
  ["Penghargaan", "Tidak pernah terlambat 1 bulan berturut-turut (bagi siswa yang punya catatan pelanggaran)", 15],
  ["Penghargaan", "Mampu menunjukkan catatan pelajaran lengkap dalam waktu yang ditentukan", 30]
];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index').setTitle('Tatib SMAN 1 Pronojiwo')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
function hash_(p) { return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'tatib|' + p)); }
function uid_() { return Utilities.getUuid().slice(0, 8); }

function sh_(n) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), s = ss.getSheetByName(n);
  if (s) return s;
  s = ss.insertSheet(n);
  s.getRange(1, 1, 1, H[n].length).setValues([H[n]]).setFontWeight('bold').setBackground('#0b5cab').setFontColor('#fff');
  s.getRange(1, 1, s.getMaxRows(), H[n].length).setNumberFormat('@');
  s.setFrozenRows(1);
  seed_(n, s);
  return s;
}
function put_(s, n, rows) { if (rows.length) s.getRange(2, 1, rows.length, H[n].length).setValues(rows); }
function seed_(n, s) {
  if (n === 'Users') {
    var u = [['Dumyati', hash_('111333'), 'Dumyati, S.Pd.I., Gr.', '198506242023211009', 'admin', '', 'Y'],
      ['kepsek', hash_('12345'), SEED_KEPSEK[0], SEED_KEPSEK[1], 'kepsek', '', 'Y']];
    SEED_WALI.forEach(function (w) {
      u.push(['wali_' + w[0].toLowerCase().replace('-', ''), hash_('12345'), w[1], w[2], 'walikelas', w[0], 'Y']);
    });
    put_(s, n, u);
  } else if (n === 'Siswa') {
    put_(s, n, SEED_SISWA.map(function (r) { return [r[1], r[2], r[3], r[0]]; }));
  } else if (n === 'Poin') {
    put_(s, n, SEED_POIN.map(function (p) { return [uid_(), p[0], p[1], p[2]]; }));
  } else if (n === 'Config') {
    put_(s, n, [['tahun', '2026/2027'], ['semester', 'Ganjil']]);
  }
}
function rows_(n) {
  var s = sh_(n), v = s.getDataRange().getValues(), h = H[n], tz = Session.getScriptTimeZone();
  return v.slice(1).filter(function (r) { return r[0] !== ''; }).map(function (r) {
    var o = {};
    h.forEach(function (k, i) { o[k] = r[i] instanceof Date ? Utilities.formatDate(r[i], tz, 'yyyy-MM-dd') : String(r[i]); });
    return o;
  });
}
function save_(n, list) {
  var s = sh_(n), h = H[n], last = s.getLastRow();
  if (last > 1) s.getRange(2, 1, last - 1, h.length).clearContent();
  put_(s, n, list.map(function (o) { return h.map(function (k) { return o[k] == null ? '' : String(o[k]); }); }));
}
function cfg_() { var c = {}; rows_('Config').forEach(function (r) { c[r.key] = r.value; }); return c; }
function periode_() { var c = cfg_(); return c.tahun + ' ' + c.semester; }

function api(r) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); return route_(r); }
  catch (e) { return { err: String(e.message || e) }; }
  finally { try { lock.releaseLock(); } catch (x) {} }
}
function need_(u, p) { if (PERM[u.role].indexOf(p) < 0) throw new Error('Anda tidak memiliki akses untuk fitur ini.'); }
function pub_(u) { return { username: u.username, nama: u.nama, nip: u.nip, role: u.role, kelas: u.kelas, aktif: u.aktif }; }

function route_(r) {
  var a = r.a, d = r.d || {};
  if (a === 'login') {
    var u = rows_('Users').filter(function (x) { return x.username.toLowerCase() === String(d.u).toLowerCase(); })[0];
    if (!u || u.hash !== hash_(d.p)) throw new Error('Username atau password salah.');
    if (u.aktif !== 'Y') throw new Error('Akun dinonaktifkan.');
    var t = Utilities.getUuid();
    CacheService.getScriptCache().put('s_' + t, u.username, 21600);
    return { t: t };
  }
  var un = CacheService.getScriptCache().get('s_' + r.t);
  var me = rows_('Users').filter(function (x) { return x.username === un && x.aktif === 'Y'; })[0];
  if (!me) throw new Error('SESI_HABIS');
  var wali = me.role === 'walikelas';

  if (a === 'boot') {
    var sis = rows_('Siswa'), cat = cfg_();
    var us = rows_('Users'), kep = us.filter(function (x) { return x.role === 'kepsek'; })[0];
    var wm = {}; us.filter(function (x) { return x.role === 'walikelas'; }).forEach(function (x) { wm[x.kelas] = x.nama; });
    return { user: pub_(me), perms: PERM[me.role], periode: { tahun: cat.tahun, semester: cat.semester },
      siswa: sis, poin: rows_('Poin'), wali: wm, kepsek: kep ? { nama: kep.nama, nip: kep.nip } : {} };
  }
  if (a === 'pwd') {
    var us2 = rows_('Users'); us2.forEach(function (x) { if (x.username === me.username) x.hash = hash_(d.p); });
    save_('Users', us2); return { ok: 1 };
  }
  if (a === 'catatan') {
    need_(me, 'rekap');
    var c = rows_('Catatan');
    if (wali) c = c.filter(function (x) { return x.kelas === me.kelas; });
    return { rows: c };
  }
  if (a === 'addCatatan') {
    need_(me, 'input');
    var sis2 = rows_('Siswa'), pn = rows_('Poin'), per = periode_(), out = [], now = new Date().toISOString();
    d.nis.forEach(function (nis) {
      var s = sis2.filter(function (x) { return x.nis === nis; })[0];
      if (!s) return;
      d.poinIds.forEach(function (pid) {
        var p = pn.filter(function (x) { return x.id === pid && x.jenis === d.jenis; })[0];
        if (p) out.push([uid_(), d.jenis, s.nis, s.nama, s.kelas, p.id, p.nama, p.poin, d.tanggal, me.nama, per, now]);
      });
    });
    if (!out.length) throw new Error('Tidak ada data yang valid untuk disimpan.');
    var cs = sh_('Catatan'); cs.getRange(cs.getLastRow() + 1, 1, out.length, H.Catatan.length).setValues(out);
    return { n: out.length };
  }
  if (a === 'delCatatan') {
    var all = rows_('Catatan'), ids = d.ids;
    var keep = all.filter(function (x) { return !(ids.indexOf(x.id) >= 0 && (me.role === 'admin' || x.oleh === me.nama)); });
    save_('Catatan', keep); return { n: all.length - keep.length };
  }
  if (a === 'resetPoin') {
    need_(me, 'poin');
    save_('Poin', SEED_POIN.map(function (p) { return { id: uid_(), jenis: p[0], nama: p[1], poin: p[2] }; })); return { ok: 1 };
  }
  if (a === 'penanganan') {
    need_(me, 'rekap');
    var pr = rows_('Penanganan');
    if (wali) pr = pr.filter(function (x) { return x.kelas === me.kelas; });
    return { rows: pr };
  }
  if (a === 'savePenanganan') {
    need_(me, 'rekap');
    if (['Belum Ditangani', 'Sedang Ditangani', 'Sudah Ditangani'].indexOf(d.status) < 0) throw new Error('Status tidak valid.');
    if (wali && d.kelas !== me.kelas) throw new Error('Hanya untuk kelas Anda.');
    var pl = rows_('Penanganan'), ex2 = pl.filter(function (x) { return x.nis === d.nis && x.tahap === d.tahap; })[0];
    var rec = ex2 || { id: uid_(), nis: d.nis, nama: d.nama, kelas: d.kelas, tahap: d.tahap };
    if (!ex2) pl.push(rec);
    rec.poin = d.poin; rec.status = d.status; rec.tanggal = d.tanggal; rec.oleh = me.nama; rec.catatan = d.catatan || '';
    rec.periode = periode_(); rec.waktu = new Date().toISOString();
    save_('Penanganan', pl); return { ok: 1 };
  }
  if (a === 'savePoin') {
    need_(me, 'poin');
    var ps = rows_('Poin');
    if (d.id) ps.forEach(function (x) { if (x.id === d.id) { x.jenis = d.jenis; x.nama = d.nama; x.poin = d.poin; } });
    else ps.push({ id: uid_(), jenis: d.jenis, nama: d.nama, poin: d.poin });
    save_('Poin', ps); return { ok: 1 };
  }
  if (a === 'delPoin') {
    need_(me, 'poin'); save_('Poin', rows_('Poin').filter(function (x) { return d.ids.indexOf(x.id) < 0; })); return { ok: 1 };
  }
  if (a === 'saveSiswa') {
    need_(me, 'siswa');
    var ss = rows_('Siswa');
    if (d.old) ss.forEach(function (x) { if (x.nis === d.old) { x.nis = d.nis; x.nama = d.nama; x.jk = d.jk; x.kelas = d.kelas; } });
    else {
      if (ss.some(function (x) { return x.nis === d.nis; })) throw new Error('NISN sudah terdaftar.');
      ss.push({ nis: d.nis, nama: d.nama, jk: d.jk, kelas: d.kelas });
    }
    save_('Siswa', ss); return { ok: 1 };
  }
  if (a === 'delSiswa') {
    need_(me, 'siswa'); save_('Siswa', rows_('Siswa').filter(function (x) { return d.nis.indexOf(x.nis) < 0; })); return { ok: 1 };
  }
  if (a === 'users') { need_(me, 'akun'); return { rows: rows_('Users').map(pub_) }; }
  if (a === 'saveUser') {
    need_(me, 'akun');
    var uu = rows_('Users'), ex = uu.filter(function (x) { return x.username === d.username; })[0];
    if (d.isNew && ex) throw new Error('Username sudah dipakai.');
    if (!d.isNew && !ex) throw new Error('Akun tidak ditemukan.');
    var o = ex || { username: d.username, hash: '' };
    if (!ex) uu.push(o);
    o.nama = d.nama; o.nip = d.nip; o.role = d.role; o.kelas = d.role === 'walikelas' ? d.kelas : ''; o.aktif = d.aktif;
    if (d.password) o.hash = hash_(d.password);
    if (!o.hash) throw new Error('Password wajib diisi untuk akun baru.');
    if (!uu.some(function (x) { return x.role === 'admin' && x.aktif === 'Y'; })) throw new Error('Minimal harus ada satu admin aktif.');
    save_('Users', uu); return { ok: 1 };
  }
  if (a === 'delUser') {
    need_(me, 'akun');
    if (d.username === me.username) throw new Error('Tidak dapat menghapus akun sendiri.');
    save_('Users', rows_('Users').filter(function (x) { return x.username !== d.username; })); return { ok: 1 };
  }
  if (a === 'setPeriode') {
    need_(me, 'periode'); save_('Config', [{ key: 'tahun', value: d.tahun }, { key: 'semester', value: d.semester }]); return { ok: 1 };
  }
  if (a === 'hapusData') {
    need_(me, 'hapus');
    var cc = rows_('Catatan'), kp = cc.filter(function (x) {
      return d.scope === 'periode' ? x.periode !== d.periode : !(x.tanggal >= d.from && x.tanggal <= d.to);
    });
    save_('Catatan', kp); return { n: cc.length - kp.length };
  }
  throw new Error('Aksi tidak dikenal.');
}
