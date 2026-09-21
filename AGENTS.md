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
- حماية المحتوى: `canAccessLesson(db, userId, lesson)` — الدرس مجاني (`l.free`) أو يتطلب اشتراكًا نشطًا. المقفول يعرض Paywall في صفحتي الدرس والاختبار.
- الإشعارات تتولّد ديناميكيًا من `db` عبر `buildNotifs` في `components/NotifBell.tsx` (نتائج، مدفوعات، انتهاء اشتراكات) — لا تُخزَّن، تُحسب عند العرض.
- كود خصم تجريبي للدفع: `KUWAIT20` و `AHLAN10`.
- الهوية البصرية: teal `#0f3d56/#16658a` + ذهبي `#f59e0b` — خط Tajawal، RTL.
