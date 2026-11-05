# تعديل Code.gs (Fleet Validation) — عمود نتيجة التحقيق للعرض التقديمي

يُطبَّق **بعد** تعديلات `validation-Code-gs-patch.md` (يعتمد على عمود `rdy`). الغرض: تفعيل شريحة «نتائج التحقيق حسب الفرع» وتقسيم «جاهز للاستلام» (تم التحقيق / حالات مرتجعات / قيد التشغيل) في العرض التقديمي.
بعد التعديل: **Deploy → Manage deployments → Edit → New version**، ثم شغّل `buildSnapshot()` (أو `?action=refresh`). الداشبورد يعمل بدونه أيضًا (الشريحة فقط لا تظهر).

## 1) دالة مساعدة (بعد `readyDay_`)
```js
/** تصنيف «نتيجة التحقيق»: done / return / wip / '' — عدّل التعابير لتطابق صياغة الشيت الفعلية */
function invState_(v) {
  var s = normText_(v);
  if (!s) return '';
  if (/قيد التشغيل|قيد/.test(s)) return 'wip';
  if (/مرتجع/.test(s)) return 'return';
  if (/تم التحقيق|تم التحقق|تحقيق|تحقق/.test(s)) return 'done';
  return '';
}
```

## 2) aggregateOps_
بعد سطر `var rdy = ...` أضف:
```js
    var inv = c.inv != null ? invState_(row[c.inv]) : '';
```
وأضف `inv` إلى `key` بعد `rdy`:
```js
    var key = [m, sec, branch || 'غير محدد بالمصدر', emp || 'غير محدد بالمصدر', rnd, fcode, sol, ready, fake, cr, rdy, inv].join('\u0001');
```
وسطر `out`:
```js
  var out = Object.keys(facts).map(function (k) { var p = k.split('\u0001'); return [p[0], p[1], p[2], p[3], p[4], p[5], p[6], +p[7], +p[8], p[9], p[10], p[11], facts[k]]; });
```

## 3) buildSnapshotObject_
```js
    opsCols: ['m', 'sec', 'br', 'emp', 'rnd', 'fin', 'sol', 'ready', 'fake', 'cr', 'rdy', 'inv', 'n'],
```

## ملاحظات
- القيم المقروءة من العرض: `inv` = `done` (تم التحقيق) / `return` (مرتجعات) / `wip` (قيد التشغيل). أي قيمة أخرى تظهر «غير مصنف».
- التصنيف **افتراض** مبني على كلمات «قيد / مرتجع / تحقيق» في عمود «نتيجة التحقيق»؛ راجع القيم الفعلية في الشيت وعدّل `invState_` عند اختلاف الصياغة.
