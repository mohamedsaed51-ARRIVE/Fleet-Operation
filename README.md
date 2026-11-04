# لوحة تحكم قسم المتابعة — ARRIVE

لوحة واحدة تجمع 3 لوحات في تبويبات. افتح `index.html` (أو انشره على Vercel/GitHub Pages).

| التبويب | الملف | مصدر البيانات |
|---|---|---|
| عدم الإبلاغ / عدم إرسال صورة | `pages/non-reporting.html` | Apps Script الخاص بها (+ Sheets CSV احتياطي) |
| Fleet Validation | `pages/validation.html` | Apps Script الخاص بها (`API_URL` داخل الملف) |
| Fleet Support | `pages/support.html` | Apps Script الخاص بها (`DEFAULT_API_URL`، أو ⚙️ في الواجهة) |

- كل لوحة محفوظة كما هي بدون تغيير في منطقها أو أرقامها؛ الصفحة الرئيسية تعرضها داخل تبويبات وتحمّل كل لوحة عند أول فتح فقط.
- الرابط المباشر لتبويب: `index.html#overview` (المؤشرات الرئيسية) أو `#reporting` أو `#validation` أو `#support`.
- التبويبات في شريط جانبي، وتبويب «المؤشرات الرئيسية» يجمع كروت المؤشرات الظاهرة حاليًا في كل لوحة (تُقرأ من اللوحات نفسها؛ يتطلب فتح الموقع عبر http وليس ملف محلي).

- التعديل على أي لوحة يتم في ملفها داخل `pages/`. نسخ `validation.html` و`support.html` منسوخة من مستودعي `fleet-validation-dashboard` و`Fleet-new` (الأخير يُبنى من `parts/` بـ `tools/build.py`)؛ أي تحديث هناك يجب نسخ ناتجه هنا.
