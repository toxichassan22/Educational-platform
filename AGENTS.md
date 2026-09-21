<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# منصة تفوّق — POC

Proof-of-concept لمنصة تعليمية كويتية (منافس لـ UULA / The Q / TMKN).

## الريبو والرفع
- الريبو: https://github.com/toxichassan22/Educational-platform — برانش `main` (ريموت `origin`).
- **ارفع أول بأول:** بعد أي تعديلات تكتمل، اعمل commit وpush على `origin main` فورًا — لا تترك تغييرات غير مرفوعة.
- الملفات غير المتتبعة مقصودًا: `خطة_العمل.html` (خارج الريبو)، `.playwright-mcp/`، `dev.log` — شوف `.gitignore`.

## الأوامر
- `npm run dev` — تشغيل التطوير (Turbopack) على http://localhost:3000
- `npm run build` — بناء إنتاجي
- `npx tsc --noEmit` — فحص الأنواع
- `npm test` — اختبارات منطق المراجعة/المقارنة في `lib/data.test.mjs` (يتطلب Node حديثًا يدعم strip-types)

## حسابات الديمو (من صفحة /login)
- طالب: `s1` (أحمد الكندري — الصف العاشر · مشترك في باقة المرحلة)
- طالبة: `s2` (سارة الكندري — الصف السابع · اشتراكها منتهي ← لعرض قفل المحتوى والتجديد)
- ولي أمر: `p1` (خالد الكندري — أبناء: s1, s2)
- مدير: `a1`

## ملاحظات معمارية
- البيانات كلها تجريبية في `lib/data.ts` (seedDB) وتُحفظ في localStorage — تعديلات الأدمن تنعكس على الطالب مباشرة.
- المصادقة تجريبية عبر localStorage في `lib/store.tsx` (StoreProvider).
- كل الصفحات الداخلية محمية بـ `components/AppShell.tsx` حسب الدور.
- `me` تكون `null` أثناء SSR — أي صفحة تستخدم بيانات المستخدم لازم تحرس بـ `if (!me) return <AppShell/>`.
- في Next 16: `use(params)` يرجّع الـ segment **مشفرًا** (URL-encoded) — الـ IDs العربية تحتاج `decodeURIComponent(id)` قبل البحث في `db`.
- حماية المحتوى: `canAccessLesson(db, userId, lesson)` — الدرس مجاني (`l.free`) أو ضمن نطاق الاشتراك. باقة `scope: "subject"` تفتح `sub.subjectId` فقط (يختارها الطالب/ولي الأمر وقت الدفع). المقفول يعرض Paywall في صفحتي الدرس والاختبار.
- `store.login` يرجّع `boolean` — `false` لو الحساب موقوف (`u.active === false`).
- الأدمن: `addUnit` يضيف وحدة لأي مادة، و`addSubject` ينشئ «الوحدة الأولى» تلقائيًا عشان يقدر يضيف دروسًا فورًا.
- ولي الأمر يدفع لأبنائه من كارت الابن (PayModal في `app/parent/page.tsx`) — نفس `subscribe()`.
- مزامنة لحظية بين التابات: `storage` event في StoreProvider يعيد تحميل `db` — تعديلات الأدمن تظهر للطالب في تاب تاني فورًا.
- بحث المنهج في `app/student/browse` — يطابق عنوان الدرس/الوحدة/المادة/المعلم.
- طباعة المذكرة: `.print-area` وحدها تظهر في `@media print` (globals.css) + هيدر `hidden print:block`.
- الإشعارات تتولّد ديناميكيًا من `db` عبر `buildNotifs` في `components/NotifBell.tsx` (نتائج، مدفوعات، انتهاء اشتراكات) — لا تُخزَّن، تُحسب عند العرض.
- كود خصم تجريبي للدفع: `KUWAIT20` و `AHLAN10`.
- `Attempt.answers` يخزّن لقطة الأسئلة مع إجابات الطالب — محاولات قديمة بدونها (`reviewMistakes` يرجّع []).
- مقارنة النتائج عبر `compareAttempts` — ترجّع `null` إذا تغيّرت الأسئلة (تدريب المتابعة لا يُسجَّل كمحاولة).
- مراجعة الأخطاء: `reviewPlan` (آخر محاولة لكل درس فيها أخطاء) + `reviewSection` تربط سؤال «المعادلات الخطية» بقسم مذكرته المُنسَّقة (`lessonNotes`/`EQUATION_NOTES`) — دروس أخرى تعرض `lesson.note`.
- تدريب المتابعة `/student/practice/[id]`: `followUpQuestions` يولّد أسئلة مختلفة عن الاختبار لدروس مُنسَّقة فقط؛ لو عنوان الدرس اتغيّر يرجّع [] ويعرض الصفحة رسالة بديلة.
- حفظ موضع الفيديو `db.lessonProgress` وملاحظات اللقطات `db.studyNotes` — تُحفظ كل 5ث وعند `pagehide`/`visibilitychange`، ولا تُستأنف إلا لنفس `videoUrl` (الأدمن يغيّر المصدر → الموضع القديم يُتجاهل).
- صفحات الدرس/الاختبار/التدريب مقسومة لمكوّن `key={id}` — تغيّر المسار يعيد ضبط الحالة.
- الهوية البصرية: teal `#0f3d56/#16658a` + ذهبي `#f59e0b` — خط Tajawal، RTL.
