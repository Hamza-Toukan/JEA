export const CONVERSATIONS = [
  {
    id: "T-8924",
    name: "م. أحمد خليل",
    topic: "تجديد العضوية السنوية",
    preview: "حدث خطأ أثناء محاولة الدفع عبر البوابة الإلكترونية...",
    time: "منذ 12 دقيقة",
    priority: true,
    verified: true,
    unread: true,
    escalated: true,
  },
  {
    id: "T-8921",
    name: "م. سارة النجار",
    topic: "استفسار تأمين صحي",
    preview: "هل يمكنني إضافة أفراد العائلة للتأمين؟",
    time: "منذ 45 دقيقة",
    priority: false,
    verified: true,
    unread: false,
    escalated: false,
  },
  {
    id: "T-8918",
    name: "م. محمد العمري",
    topic: "شهادة عضوية",
    preview: "أحتاج شهادة عضوية للتقديم على مشروع",
    time: "منذ ساعتين",
    priority: false,
    verified: true,
    unread: false,
    escalated: false,
  },
];

export const MESSAGES = [
  {
    id: 1,
    role: "user",
    text: "مرحباً، أحاول تجديد اشتراكي السنوي ولكن تظهر لي رسالة خطأ عند الدفع.",
    time: "10:42",
  },
  {
    id: 2,
    role: "ai",
    text: "أهلاً بك م. أحمد. يبدو أن هناك مشكلة مؤقتة في بوابة الدفع. هل يمكنك إخباري برقم العضوية؟",
    time: "10:42",
    confidence: 94,
    article: "RT-104 (أخطاء بوابة الدفع)",
  },
  {
    id: 3,
    role: "user",
    text: "رقم العضوية 100245",
    time: "10:43",
  },
  {
    id: 4,
    role: "system",
    text: "تم تصعيد المحادثة إلى موظف بشري — قاعدة بيانات الدفع لا تستجيب.",
    time: "10:44",
    escalation: true,
  },
];

export const KB_ARTICLES = [
  {
    id: "KNB-2023-001",
    title: "قانون البناء الوطني وتعديلاته",
    titleEn: "National Building Law",
    category: "قوانين وتشريعات",
    usage: 1245,
    confidence: 95,
    status: "approved",
    updated: "2023-10-12",
    author: "اللجنة القانونية",
  },
  {
    id: "KNB-2023-042",
    title: "شروط الترقية للمستشار الأول",
    titleEn: "Promotion conditions",
    category: "شؤون الأعضاء",
    usage: 856,
    confidence: 82,
    status: "review",
    updated: "2023-11-05",
    author: "إدارة العضوية",
  },
  {
    id: "KNB-2024-018",
    title: "إجراءات تجديد التأمين الصحي",
    category: "التأمين الصحي",
    usage: 2103,
    confidence: 91,
    status: "approved",
    updated: "2024-01-20",
    author: "إدارة التأمين",
  },
];

export const WORKFLOW_NODES = [
  { id: "start", type: "trigger", title: "رسالة واردة", subtitle: "WhatsApp", x: 50, y: 120 },
  { id: "verify", type: "action", title: "التحقق من الهوية", subtitle: "عضوية", x: 280, y: 80 },
  { id: "router", type: "ai", title: "مصنف الذكاء الاصطناعي", subtitle: "GPT-4o", x: 520, y: 120 },
];
