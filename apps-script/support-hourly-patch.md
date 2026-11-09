# تعديل Apps Script (Control Tower / Fleet Support) — تقسيم «حسب الساعة»

الواجهة (`pages/support.html` → قسم «فترات إرسال الحالات») أضافت خيار **«حسب الساعة (12:00 ، 13:00 …)»** يعرض عدد الحالات في كل ساعة + جدول محوري بآخره **Grand Total**.
الواجهة تقرأ `analytics.periods.hourly`، وهذا الحقل **غير موجود حاليًا** في استجابة `getAnalytics` — لذلك يظهر الخيار برسالة تنبيه إلى أن يُضاف على السيرفر.
ملف Apps Script الخاص بهذه اللوحة غير موجود في هذا المستودع (يُبنى من مستودع `Fleet-new`)، فالتعديل أدناه **مثال يُطابَق** مع الدالة التي تبني `periods.hour` الحالية.

## الشكل المطلوب (نفس شكل `periods.hour`)
```js
periods: {
  weekday: {...}, monthPart: {...}, hour: {...},
  hourly: {
    rows: [
      // صف لكل ساعة بها حالات فقط، مرتبة تصاعديًا
      { label: '12:00', total: 123, pctOfTotal: 12.3, isPeak: false, topBranches: [{ name: 'فرع كذا', total: 20 }] },
      { label: '13:00', total: 150, pctOfTotal: 15.0, isPeak: true,  topBranches: [] }
    ],
    missing: 0   // عدد السجلات بلا وقت تسجيل صالح (مستبعدة)
  }
}
```

## المنطق
- الساعة = `getHours()` من نفس عمود وقت التسجيل (Record ID) الذي تُبنى منه `periods.hour`، بتوقيت الشيت (`Africa/Cairo`).
- `label` = الساعة بصيغة `HH:00` (مثل `12:00`, `23:00`).
- `isPeak` = الساعة (أو الساعات المتعادلة) الأعلى عددًا. `pctOfTotal` = حصة الساعة من مجموع الساعات.
- يُحتسب فقط ما تحت الفلاتر الحالية، تمامًا كبقية التقسيمات.

## مثال (عدّل أسماء الأعمدة/الدوال لتطابق الكود الفعلي)
```js
function buildHourly_(records) {           // records: صفوف بعد تطبيق الفلاتر، لكل صف recordTime (Date) وbranch
  var byHour = {}, missing = 0, total = 0;
  records.forEach(function (r) {
    if (!(r.recordTime instanceof Date) || isNaN(r.recordTime)) { missing++; return; }
    var h = +Utilities.formatDate(r.recordTime, 'Africa/Cairo', 'H');
    var b = byHour[h] || (byHour[h] = { total: 0, br: {} });
    b.total++; total++;
    b.br[r.branch] = (b.br[r.branch] || 0) + 1;
  });
  var rows = Object.keys(byHour).map(Number).sort(function (a, b) { return a - b; }).map(function (h) {
    var b = byHour[h];
    return {
      label: (h < 10 ? '0' : '') + h + ':00', total: b.total, pctOfTotal: total ? b.total / total * 100 : 0, isPeak: false,
      topBranches: Object.keys(b.br).map(function (k) { return { name: k, total: b.br[k] }; })
        .sort(function (x, y) { return y.total - x.total; }).slice(0, 3)
    };
  });
  var max = rows.reduce(function (m, r) { return Math.max(m, r.total); }, 0);
  rows.forEach(function (r) { r.isPeak = max > 0 && r.total === max; });
  return { rows: rows, missing: missing };
}
```
ثم أضف `hourly: buildHourly_(records)` داخل كائن `periods`، وبعدها **Deploy → Manage deployments → Edit → New version**.

> ملاحظة: `pctOfTotal` هنا نسبة مئوية (0–100) — طابقها مع تمثيل `periods.hour` الحالي إن كان كسرًا.
