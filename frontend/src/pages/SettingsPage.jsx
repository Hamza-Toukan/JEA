import { Bell, Shield, MessageCircle, Webhook, Users } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";

const SECTIONS = [
  {
    id: "whatsapp",
    icon: MessageCircle,
    title: "قناة واتساب",
    description: "إعدادات Twilio والقوالب المعتمدة",
  },
  {
    id: "webhooks",
    icon: Webhook,
    title: "Webhooks والتكامل",
    description: "عناوين الاستقبال والتحقق",
  },
  {
    id: "team",
    icon: Users,
    title: "الفريق والصلاحيات",
    description: "أدوار المشرفين والموظفين",
  },
  {
    id: "security",
    icon: Shield,
    title: "الأمان",
    description: "المصادقة وسياسات الجلسة",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "التنبيهات",
    description: "تنبيهات التصعيد والأخطاء",
  },
];

export function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="الإعدادات"
        description="تكوين المنصة والتكاملات وسياسات التشغيل."
        actions={<Button>حفظ التغييرات</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="أقسام الإعدادات" />
          <CardBody className="space-y-1 p-2">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-start transition-colors ${
                  i === 0
                    ? "bg-jea-cyan-muted text-jea-navy"
                    : "text-jea-text-muted hover:bg-jea-bg hover:text-jea-navy"
                }`}
              >
                <s.icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-[11px] opacity-80">{s.description}</p>
                </div>
              </button>
            ))}
          </CardBody>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader
              title="قناة واتساب (Twilio)"
              action={<Badge variant="success">متصل</Badge>}
            />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-jea-text-muted">
                  مزود الخدمة
                </label>
                <Select className="w-full" disabled>
                  <option>Twilio</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-jea-text-muted">
                  رقم واتساب
                </label>
                <Input defaultValue="+962 7XX XXX XXX" dir="ltr" className="text-start" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-jea-text-muted">
                  عنوان Webhook العام
                </label>
                <Input
                  defaultValue="https://api.example.jea.org.jo/api/whatsapp/twilio/webhook"
                  dir="ltr"
                  className="font-mono text-xs"
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="معالجة الرسائل الواردة" />
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-jea-border-soft px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-jea-navy">
                    المعالجة غير المتزامنة (Queue)
                  </p>
                  <p className="text-xs text-jea-text-muted">
                    استخدام Redis و BullMQ لمعالجة webhooks
                  </p>
                </div>
                <Badge variant="success">مفعّل</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-jea-border-soft px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-jea-navy">إعادة محاولة الإرسال</p>
                  <p className="text-xs text-jea-text-muted">
                    Worker دوري للرسائل الفاشلة
                  </p>
                </div>
                <Badge variant="success">مفعّل</Badge>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="التحقق من توقيع Twilio" />
            <CardBody>
              <div className="flex items-center justify-between">
                <p className="text-sm text-jea-text-muted">
                  التحقق من X-Twilio-Signature في الإنتاج
                </p>
                <Badge variant="info">مطلوب في الإنتاج</Badge>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
