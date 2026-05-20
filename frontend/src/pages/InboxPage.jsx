import { useState } from "react";
import {
  CheckCircle2,
  Paperclip,
  Send,
  Smile,
  Bot,
  X,
  FileText,
} from "lucide-react";
import { cn } from "../lib/cn";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Tabs } from "../components/ui/Tabs";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { ProgressBar } from "../components/ui/ProgressBar";
import { CONVERSATIONS, MESSAGES } from "../data/mock";

const INBOX_TABS = [
  { id: "all", label: "الكل" },
  { id: "unread", label: "غير مقروء" },
  { id: "ai", label: "تصعيد ذكي" },
  { id: "priority", label: "أولوية" },
];

const QUICK_REPLIES = ["اعتذار عن الخطأ", "طلب تفاصيل إضافية", "تأكيد استلام الطلب"];

export function InboxPage() {
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState(CONVERSATIONS[0]);

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col">
      <PageHeader
        title="البريد الوارد"
        description="إدارة محادثات واتساب والتذاكر والتصعيدات."
      />

      <div className="flex min-h-0 flex-1 gap-4">
        {/* Conversation list */}
        <Card className="flex w-80 shrink-0 flex-col overflow-hidden">
          <CardHeader className="px-4 py-3">
            <p className="text-sm font-semibold text-jea-navy">التذاكر النشطة</p>
          </CardHeader>
          <div className="border-b border-jea-border-soft px-3 py-2">
            <Tabs tabs={INBOX_TABS} active={tab} onChange={setTab} className="w-full" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {CONVERSATIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c)}
                className={cn(
                  "w-full border-b border-jea-border-soft px-4 py-3 text-start transition-colors",
                  selected.id === c.id
                    ? "bg-jea-cyan-muted/60 border-s-2 border-s-jea-cyan"
                    : "hover:bg-jea-bg"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium text-jea-navy">
                        {c.name}
                      </span>
                      {c.verified && (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-jea-success" />
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs font-medium text-jea-text-muted">
                      {c.topic}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11px] text-jea-text-subtle">
                      {c.preview}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-jea-text-subtle">{c.time}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.priority && <Badge variant="danger">أولوية</Badge>}
                  {c.escalated && <Badge variant="warning">تصعيد</Badge>}
                  {c.unread && <Badge variant="info">جديد</Badge>}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Chat */}
        <Card className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-jea-border-soft px-5 py-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-jea-navy">{selected.topic}</h3>
                <Badge variant="neutral">{selected.id}</Badge>
                {selected.escalated && (
                  <Badge variant="warning">تصعيد ذكي</Badge>
                )}
              </div>
            </div>
            <Button variant="secondary" size="sm">
              إنهاء التذكرة
            </Button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-jea-bg/50 p-5">
            {MESSAGES.map((msg) => {
              if (msg.role === "system" || msg.escalation) {
                return (
                  <Alert
                    key={msg.id}
                    variant="danger"
                    title={msg.text}
                    className="mx-auto max-w-lg"
                  />
                );
              }

              const isUser = msg.role === "user";
              const isAi = msg.role === "ai";

              return (
                <div
                  key={msg.id}
                  className={cn("flex", isUser ? "justify-start" : "justify-end")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-xl px-4 py-2.5 text-sm shadow-jea-sm",
                      isUser
                        ? "rounded-ee-sm bg-jea-surface border border-jea-border-soft text-jea-text"
                        : "rounded-es-sm bg-jea-cyan-muted border border-jea-cyan-light text-jea-navy"
                    )}
                  >
                    {isAi && (
                      <div className="mb-1 flex items-center gap-1 text-[10px] font-medium text-jea-cyan">
                        <Bot className="h-3 w-3" />
                        المساعد الذكي
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                    {msg.confidence && (
                      <div className="mt-2 rounded-lg border border-jea-cyan-light/80 bg-white/60 px-2 py-1.5">
                        <p className="text-[10px] text-jea-text-muted">
                          الثقة: {msg.confidence}%
                        </p>
                        {msg.article && (
                          <p className="mt-0.5 text-[10px] font-medium text-jea-navy">
                            مقال مطابق: {msg.article}
                          </p>
                        )}
                      </div>
                    )}
                    <p className="mt-1 text-[10px] text-jea-text-subtle">{msg.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-jea-border-soft bg-jea-surface p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="rounded-full border border-jea-border px-3 py-1 text-xs text-jea-text-muted transition-colors hover:border-jea-cyan hover:bg-jea-cyan-muted hover:text-jea-navy"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <button type="button" className="rounded-lg p-2 text-jea-text-muted hover:bg-jea-bg">
                <Paperclip className="h-4 w-4" />
              </button>
              <button type="button" className="rounded-lg p-2 text-jea-text-muted hover:bg-jea-bg">
                <Smile className="h-4 w-4" />
              </button>
              <Input
                placeholder="اكتب ردك هنا..."
                className="flex-1"
              />
              <Button icon={Send} iconPosition="end">
                إرسال
              </Button>
            </div>
          </div>
        </Card>

        {/* Member profile */}
        <Card className="hidden w-72 shrink-0 overflow-y-auto xl:flex xl:flex-col">
          <CardHeader
            title="بيانات العضو"
            action={
              <button type="button" className="text-jea-text-subtle hover:text-jea-navy">
                <X className="h-4 w-4" />
              </button>
            }
          />
          <CardBody className="space-y-4 p-4">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-jea-cyan-muted text-xl font-semibold text-jea-navy">
                أخ
              </div>
              <p className="mt-2 text-sm font-semibold text-jea-navy">م. أحمد خليل</p>
              <Badge variant="success" className="mt-1">
                عضوية موثقة
              </Badge>
              <p className="mt-1 text-xs text-jea-text-muted">مهندس مدني — إنشاءات</p>
            </div>

            <dl className="space-y-2 text-xs">
              <div className="flex justify-between rounded-lg bg-jea-bg px-3 py-2">
                <dt className="text-jea-text-muted">رقم العضوية</dt>
                <dd className="font-medium text-jea-navy">100245</dd>
              </div>
              <div className="flex justify-between rounded-lg bg-jea-bg px-3 py-2">
                <dt className="text-jea-text-muted">تاريخ الانتساب</dt>
                <dd className="font-medium text-jea-navy">2018</dd>
              </div>
              <div className="flex justify-between rounded-lg border border-red-100 bg-jea-danger-bg px-3 py-2">
                <dt className="text-jea-danger">حالة الاشتراك</dt>
                <dd className="font-medium text-jea-danger">منتهي (3 أيام)</dd>
              </div>
            </dl>

            <div>
              <p className="mb-1 text-xs text-jea-text-muted">مستوى الثقة العام</p>
              <ProgressBar value={88} />
              <p className="mt-0.5 text-end text-[10px] text-jea-text-subtle">88%</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-jea-navy">سجل التصعيدات</p>
              <ul className="space-y-1 text-[11px] text-jea-text-muted">
                <li>• بوابة الدفع — اليوم</li>
                <li>• استفسار تأمين — الأسبوع الماضي</li>
              </ul>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-jea-navy">تذاكر أخرى</p>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg border border-jea-border-soft px-3 py-2 text-start text-[11px] hover:bg-jea-bg"
              >
                <FileText className="h-3.5 w-3.5 text-jea-cyan" />
                طلب تعديل بيانات شخصية
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
