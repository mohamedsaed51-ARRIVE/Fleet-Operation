# تعديل Backend.gs (Control Tower) — تقسيم «حسب الساعة»

**الملف:** `Backend.gs` — **الدالة:** `getPeriodAnalysis_` (قبل قسم «الحزمة الكاملة / getAnalytics» مباشرة).
مفيش أعمدة جديدة في الشيت: البيانات من `entryHour` الموجود أصلًا (ساعة وقت التسجيل Record ID).

## 1) أضف الكتلة دي داخل `getPeriodAnalysis_` بعد تعريف `hour` مباشرة
```js
  // تقسيم بالساعة (00:00 … 23:00) — الساعات التي بها حالات فقط
  const hourlyDefs = {};
  const hourly = buildPeriodRows_(records, r => {
    if (r.entryHour === null || r.entryHour === undefined) return null;
    const h = r.entryHour;
    return hourlyDefs[h] || (hourlyDefs[h] = { key: 'x' + h, label: (h < 10 ? '0' : '') + h + ':00', order: h });
  });
```

## 2) عدّل سطر الـ return في نفس الدالة
من:
```js
  return { hour: hour, weekday: weekday, monthPart: monthPart, hourBlock: block };
```
إلى:
```js
  return { hour: hour, hourly: hourly, weekday: weekday, monthPart: monthPart, hourBlock: block };
```

## 3) انشر
Deploy → Manage deployments → Edit → New version → Deploy.
ثم من اللوحة اضغط «تحديث البيانات» (أو `?action=refresh`) لمسح الكاش.

## النتيجة
في Control Tower ← تحليل الحالات ← «فترات إرسال الحالات»: اختر «حسب الساعة» فيظهر عدد الحالات لكل ساعة (مثل 12:00, 13:00, 14:00 …) وجدول بآخره Grand Total.

## ملاحظات
- الساعة من وقت التسجيل (Record ID) وقد لا تطابق وقت إرسال الفرع للحالة، ومثلها فترات اليوم الحالية.
- السجل بلا وقت تسجيل صالح يُستبعد من هذا التقسيم ويظهر عدده في الملاحظة أسفل الجدول.
- لا حاجة لتعديل `Config.gs` ولا `Code.gs`.
