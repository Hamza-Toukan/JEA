import {
  MessageSquare,
  Headphones,
  Sparkles,
  AlertTriangle,
  Circle,
} from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";

const TIMELINE = [
  { type: "ai", title: "رد المساعد الذكي", desc: "تم الرد على استفسار حول شهادة عضوية", time: "10:45", badge: null },
  { type: "verify", title: "التحقق من العضوية", desc: "تم التحقق من العضوية رقم 100245", time: "10:42", badge: "verified" },
  { type: "escalate", title: "تصعيد لموظف بشري", desc: "تصعيد بسبب فشل بوابة الدفع", time: "10:40", badge: null },
];

const SERVICE_VOLUME = [
  { label: "شكاوى", value: 18, color: "bg-red-400" },
  { label: "شهادات", value: 32, color: "bg-slate-400" },
  { label: "استعلام", value: 45, color: "bg-jea-cyan" },
  { label: "تجديد", value: 62, color: "bg-jea-navy" },
];

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="نظرة عامة على العمليات"
        description="مراقبة أداء المساعد الرقمي وطلبات الأعضاء في الوقت الفعلي."
        actions={
          <>
            <Badge variant="success" className="gap-1.5 px-2.5 py-1">
              <Circle className="h-2 w-2 fill-current" />
              متصل
            </Badge>
            <Button variant="secondary" size="sm">
              آخر 24 ساعة
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="المحادثات النشطة"
          value="1,248"
          change="+12% مقارنة بالأمس"
          changeType="up"
          icon={MessageSquare}
        />
        <StatCard
          label="بانتظار موظف"
          value="42"
          change="+5% فوق المعدل"
          changeType="down"
          icon={Headphones}
          iconBg="bg-jea-danger-bg"
          iconColor="text-jea-danger"
        />
        <StatCard
          label="معدل الحل الآلي"
          value="87.4%"
          change="مستقر"
          changeType="neutral"
          icon={Sparkles}
        />
        <StatCard
          label="أخطاء التسليم"
          value="0.8%"
          change="-2% مقارنة بالأمس"
          changeType="up"
          icon={AlertTriangle}
          iconBg="bg-jea-bg"
          iconColor="text-jea-text-muted"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader title="تنبيهات نشطة" action={<Badge variant="danger">3</Badge>} />
            <CardBody className="space-y-3 p-4">
              <Alert variant="warning" title="مستوى ثقة منخفض (42%)">
                محادثة T-8912 — استفسار تقني معقد
              </Alert>
              <Alert variant="danger" title="زمن استجابة طويل">
                محادثة T-8908 — أكثر من 10 دقائق
              </Alert>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="سجل العمليات المباشر" />
            <CardBody className="space-y-4 p-4">
              {TIMELINE.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      item.type === "ai"
                        ? "bg-jea-cyan"
                        : item.type === "verify"
                          ? "bg-jea-success"
                          : "bg-jea-danger"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-jea-navy">{item.title}</p>
                      <span className="text-[10px] text-jea-text-subtle">{item.time}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-jea-text-muted">{item.desc}</p>
                    {item.badge === "verified" && (
                      <Badge variant="success" className="mt-1">
                        تم التحقق
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full">
                عرض السجل الكامل
              </Button>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader
              title="اتجاهات دقة الذكاء الاصطناعي"
              description="متوسط الثقة في الردود خلال الأسبوع"
            />
            <CardBody>
              <div className="jea-gradient-accent flex h-48 items-end justify-around gap-2 rounded-lg border border-jea-border-soft p-4">
                {[72, 78, 85, 88, 91, 89, 94].map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full max-w-[32px] rounded-t-md bg-jea-cyan/70"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="حجم المحادثات حسب الخدمة" />
            <CardBody>
              <div className="flex h-40 items-end justify-around gap-4">
                {SERVICE_VOLUME.map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-12 rounded-t-lg ${s.color}`}
                      style={{ height: `${s.value * 2}px` }}
                    />
                    <span className="text-[11px] text-jea-text-muted">{s.label}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="مؤشرات الجودة" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-jea-text-muted">دقة الاستخراج</span>
                  <span className="font-medium text-jea-navy">92%</span>
                </div>
                <ProgressBar value={92} />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-jea-text-muted">ملاءمة السياق</span>
                  <span className="font-medium text-jea-navy">88%</span>
                </div>
                <ProgressBar value={88} />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
