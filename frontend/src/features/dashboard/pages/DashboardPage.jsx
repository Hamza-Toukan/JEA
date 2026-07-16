import {
  MessageSquare,
  Headphones,
  Sparkles,
  Heart,
  Circle,
} from "lucide-react";
import { PageContainer, SectionHeader } from "@/components/layout";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/feedback";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useDashboardStats } from "../hooks/use-dashboard-stats";

const SERVICE_VOLUME = [
  { label: "شكاوى", value: 18, color: "bg-red-400" },
  { label: "شهادات", value: 32, color: "bg-slate-400" },
  { label: "استعلام", value: 45, color: "bg-jea-cyan" },
  { label: "تجديد", value: 62, color: "bg-jea-navy" },
];

export function DashboardPage() {
  const { data: apiResponse, isLoading } = useDashboardStats();
  const stats = apiResponse?.data || {
    sessions: { open: 0, handover: 0, closed: 0, total: 0 },
    tickets: { open: 0, resolved: 0, total: 0 },
    customers: { total: 0 },
    messages: { total: 0, recent: [] },
  };

  const recentMessages = stats.messages.recent || [];

  return (
    <PageContainer>
      <SectionHeader
        title="نظرة عامة على العمليات"
        description="مراقبة أداء المساعد الرقمي وطلبات الأعضاء في الوقت الفعلي."
        actions={
          <>
            <Badge variant={isLoading ? "neutral" : "success"} className="gap-1.5 px-2.5 py-1">
              <Circle className={isLoading ? "h-2 w-2 fill-current animate-pulse" : "h-2 w-2 fill-current"} />
              {isLoading ? "جاري التحديث..." : "متصل بالخادم"}
            </Badge>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="المحادثات المفتوحة"
          value={stats.sessions.open.toString()}
          change={`من أصل ${stats.sessions.total} محادثة`}
          changeType="neutral"
          icon={MessageSquare}
        />
        <StatCard
          label="بانتظار موظف (Handover)"
          value={stats.sessions.handover.toString()}
          change="تحتاج للتدخل البشري"
          changeType={stats.sessions.handover > 0 ? "down" : "neutral"}
          icon={Headphones}
          iconBg={stats.sessions.handover > 0 ? "bg-jea-danger-bg" : "bg-accent-muted"}
          iconColor={stats.sessions.handover > 0 ? "text-jea-danger" : "text-primary"}
        />
        <StatCard
          label="إجمالي العملاء المتفاعلين"
          value={stats.customers.total.toString()}
          change="رسائل واردة: "
          changeType="neutral"
          icon={Heart}
          iconBg="bg-accent-muted"
          iconColor="text-primary"
        />
        <StatCard
          label="التذاكر المحلولة"
          value={stats.tickets.resolved.toString()}
          change={`من أصل ${stats.tickets.total} تذكرة`}
          changeType="up"
          icon={Sparkles}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader title="سجل العمليات المباشر (Recent Messages)" />
            <CardBody className="space-y-4 p-4">
              {recentMessages.length === 0 ? (
                <div className="text-center text-xs text-muted py-4">لا توجد رسائل حديثة.</div>
              ) : (
                recentMessages.map((msg, idx) => (
                  <div key={msg._id || idx} className="flex gap-3">
                    <div
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        msg.sender === "bot"
                          ? "bg-jea-cyan"
                          : "bg-jea-success"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-jea-navy">
                          {msg.sender === "bot" ? "الرد الآلي" : "العميل"}
                        </p>
                        <span className="text-[10px] text-jea-text-subtle">
                          {new Date(msg.createdAt).toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-jea-text-muted">{msg.body}</p>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
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
                  <span className="text-jea-text-muted">معدل الإغلاق التلقائي للمحادثات</span>
                  <span className="font-medium text-jea-navy">
                    {stats.sessions.total > 0 ? Math.round((stats.sessions.closed / stats.sessions.total) * 100) : 0}%
                  </span>
                </div>
                <ProgressBar value={stats.sessions.total > 0 ? (stats.sessions.closed / stats.sessions.total) * 100 : 0} />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-jea-text-muted">معدل حل التذاكر المفتوحة</span>
                  <span className="font-medium text-jea-navy">
                    {stats.tickets.total > 0 ? Math.round((stats.tickets.resolved / stats.tickets.total) * 100) : 0}%
                  </span>
                </div>
                <ProgressBar value={stats.tickets.total > 0 ? (stats.tickets.resolved / stats.tickets.total) * 100 : 0} />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
