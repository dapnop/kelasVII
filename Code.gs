/**
 * Code.gs
 * Backend Google Apps Script untuk "Kuis Diagnostik Pengolahan Data".
 *
 * CARA PAKAI:
 * 1. Buka Google Spreadsheet yang ingin dijadikan tempat rekap nilai.
 * 2. Klik menu Extensions > Apps Script (Ekstensi > Apps Script).
 * 3. Hapus isi file "Code.gs" bawaan, lalu tempel (paste) seluruh isi file ini.
 * 4. Buat file HTML baru (File > New > HTML file), beri nama persis: Index
 *    lalu tempel isi file Index.html yang saya buatkan.
 * 5. Klik Deploy > New deployment > pilih tipe "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone (atau sesuai kebutuhan sekolah)
 * 6. Klik Deploy, lalu buka URL Web App yang diberikan. Kuis akan tampil
 *    dan setiap hasil pengerjaan otomatis tersimpan sebagai baris baru
 *    di sheet "Hasil Kuis" pada Spreadsheet ini.
 */

const NAMA_SHEET = 'Hasil Kuis';

/**
 * Dipanggil otomatis saat Web App diakses lewat browser (GET request).
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Kuis Diagnostik Pengolahan Data')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Dipanggil dari sisi client (index.html) lewat google.script.run
 * untuk menyimpan satu baris hasil kuis siswa.
 *
 * @param {Object} data - payload hasil kuis dari client
 * @return {Object} status penyimpanan
 */
function simpanHasilKuis(data) {
  try {
    const sheet = getOrCreateSheet_();
    sheet.appendRow([
      new Date(),
      data.nama_lengkap || '',
      data.kelas || '',
      data.jawaban_1 || '',
      data.jawaban_2 || '',
      data.jawaban_3 || '',
      data.jawaban_4 || '',
      data.jawaban_5 || '',
      data.skor
    ]);
    return { isOk: true };
  } catch (err) {
    return { isOk: false, error: err.message };
  }
}

/**
 * Mengambil sheet "Hasil Kuis". Jika belum ada, sheet baru dibuat
 * beserta baris judul kolomnya.
 */
function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(NAMA_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(NAMA_SHEET);
    sheet.appendRow([
      'Waktu Submit', 'Nama Lengkap', 'Kelas',
      'Jawaban 1', 'Jawaban 2', 'Jawaban 3', 'Jawaban 4', 'Jawaban 5',
      'Skor'
    ]);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}
