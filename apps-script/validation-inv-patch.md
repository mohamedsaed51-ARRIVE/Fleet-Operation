# تعديل Code.gs (Validation) — عمود `inv` لشريحة «نتائج التحقيق حسب الفرع»

مبني على الكود الحالي عندك (يحتوي `soon` وليس `rdy`). الشريحة تظهر في العرض التقديمي فقط عند وجود `inv` في `opsCols`.
**قبل النشر راجع الكلمات في `invState_` على القيم الفعلية في عمود «نتيجة التحقيق»** (التصنيف افتراض).

## 1) دالة مساعدة (بعد `clean_`)
```js
/** تصنيف «نتيجة التحقيق»: done / return / wip / '' — عدّل التعابير لتطابق صياغة الشيت */
function invState_(v) {
  var s = normText_(v);
  if (!s) return '';
  if (/قيد/.test(s)) return 'wip';                 // قيد التشغيل
  if (/مرتجع/.test(s)) return 'return';            // حالات مرتجعات
  if (/تم التحقيق|تم التحقق|تحقيق|تحقق/.test(s)) return 'done';   // تم التحقيق
  return '';
}
```

## 2) داخل `aggregateOps_`
بعد سطر `q.soon += soon;` أضف:
```js
    var inv = c.inv != null ? invState_(row[c.inv]) : '';
```
وعدّل سطر `key` (أضف `inv` في آخره):
```js
    var key = [m, sec, branch || 'غير محدد بالمصدر', emp || 'غير محدد بالمصدر', rnd, fcode, sol, ready, fake, cr, soon, inv].join('\u0001');
```
وعدّل سطر `var out = ...`:
```js
  var out = Object.keys(facts).map(function (k) { var p = k.split('\u0001'); return [p[0], p[1], p[2], p[3], p[4], p[5], p[6], +p[7], +p[8], p[9], +p[10], p[11], facts[k]]; });
```

## 3) داخل `buildSnapshotObject_`
```js
    opsCols: ['m', 'sec', 'br', 'emp', 'rnd', 'fin', 'sol', 'ready', 'fake', 'cr', 'soon', 'inv', 'n'],
```

## 4) انشر وحدّث
Deploy → Manage deployments → Edit → New version → Deploy، ثم افتح الرابط بـ `?action=refresh` (أو شغّل `buildSnapshot()`).

## ملاحظات
- «جاهز للاستلام اليوم أو غدا» في الواجهة = قيمة **نوع الحل** (`ready`)، ونتيجة التحقيق تفصّل هذه الحالات فقط (تم التحقيق / مرتجعات / قيد التشغيل).
- أي قيمة لا تطابق التعابير أعلاه تظهر «غير مصنف» في الشريحة.
