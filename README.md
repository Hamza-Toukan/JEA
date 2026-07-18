# JEA Digital Assistant — Admin Dashboard

لوحة تحكم إدارية لنظام المساعد الرقمي لنقابة المهندسين الأردنيين.

## الوصف

تطبيق React يعمل كواجهة إدارية مستقلة مع بيانات وهمية (Demo Data) مدمجة. يتضمن:

- **لوحة القيادة** — إحصائيات وتنبيهات العمليات
- **البريد الوارد** — محادثات واتساب مع المساعد الذكي
- **إدارة التذاكر** — متابعة تذاكر الدعم والتصعيدات
- **قاعدة المعرفة** — مقالات ومصادر المساعد الذكي
- **مسارات العمل** — تصميم مسارات المحادثة والتوجيه الآلي
- **الإعدادات** — إدارة الفريق والأمان والتنبيهات

## المتطلبات

- Node.js 20+ (LTS recommended)

## التشغيل

```bash
cd frontend
npm install
npm run dev
```

التطبيق يفتح على [http://localhost:5173](http://localhost:5173).

## البنية التقنية

```text
frontend/
├── src/
│   ├── app/           # App entry, providers
│   ├── components/    # Shared UI components
│   ├── config/        # Feature flags
│   ├── constants/     # Routes, roles, navigation
│   ├── features/      # Feature modules (dashboard, inbox, etc.)
│   ├── hooks/         # Shared hooks
│   ├── layouts/       # AppShell, sidebar, topbar
│   ├── lib/           # Utilities, query client
│   ├── routes/        # Router config, guards
│   ├── services/      # API layer (inactive — demo mode)
│   ├── store/         # Zustand stores
│   └── styles/        # Global CSS, Tailwind
├── public/            # Static assets
└── package.json
```

## البيانات الوهمية

جميع الصفحات تعمل ببيانات وهمية مدمجة في الكود:

- `features/inbox/data/mock.js` — محادثات وتذاكر
- `features/knowledge-base/data/mock.js` — مقالات قاعدة المعرفة
- Dashboard و Analytics — بيانات مضمنة مباشرة في المكونات

## Documentation

- `docs/00-project-overview.md` — product context
- `frontend/ARCHITECTURE.md` — frontend architecture
- `frontend/STANDARDS.md` — coding standards
