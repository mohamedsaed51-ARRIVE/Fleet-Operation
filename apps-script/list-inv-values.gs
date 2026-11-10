/**
 * أداة مؤقتة (Validation): تعرض القيم المميزة لعمود «نتيجة التحقيق» وعدد كل قيمة.
 * الصقها في ملف جديد (مثلًا Tools.gs) داخل مشروع Apps Script الخاص بـ Validation،
 * شغّل listInvValues()، ثم افتح View ← Logs (أو Execution log) وانسخ الناتج وابعته.
 * لا تعدّل أي ورقة ولا تغيّر أي شيء.
 */
function listInvValues() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = findSheet_(ss, CFG.SHEETS.delivery);
  var lr = sh.getLastRow(), hdr = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var norm = hdr.map(normText_), col = norm.indexOf(normText_('نتيجة التحقيق')), fin = norm.indexOf(normText_('الحالة النهائية')), sol = norm.indexOf(normText_('نوع الحل'));
  if (col < 0) throw new Error('Column "نتيجة التحقيق" not found');
  var counts = {}, STEP = 5000;
  for (var r = 2; r <= lr; r += STEP) {
    var n = Math.min(STEP, lr - r + 1), vals = sh.getRange(r, 1, n, sh.getLastColumn()).getValues();
    vals.forEach(function (row) {
      var v = clean_(row[col]); if (!v) return;
      var k = v + '   [الحالة النهائية: ' + clean_(row[fin]) + ' | نوع الحل: ' + clean_(row[sol]) + ']';
      counts[k] = (counts[k] || 0) + 1;
    });
  }
  var out = Object.keys(counts).map(function (k) { return [k, counts[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
  Logger.log('عدد القيم المميزة: ' + out.length);
  out.slice(0, 60).forEach(function (x) { Logger.log(x[1] + '  ←  ' + x[0]); });
}
