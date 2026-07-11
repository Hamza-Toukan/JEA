import { useState, useEffect } from "react";
import {
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
  Clock,
  User,
  Check,
  Send,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { PageContainer, SectionHeader } from "@/components/layout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Select, Textarea } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MOCK_TICKETS } from "../data/mock";
import { useInboxConversations } from "../hooks/use-inbox-conversations";
import { APP_CONFIG } from "@/config/app";

const TICKET_TABS = [
  { id: "all", label: "كل التذاكر" },
  { id: "new", label: "جديدة" },
  { id: "pending", label: "قيد المتابعة" },
  { id: "resolved", label: "محلولة" },
];

const PRIORITY_MAP = {
  high: { label: "عالية جداً", variant: "danger" },
  normal: { label: "متوسطة", variant: "warning" },
  low: { label: "منخفضة", variant: "neutral" },
};

const STATUS_MAP = {
  new: { label: "جديدة", variant: "info" },
  pending: { label: "قيد المتابعة", variant: "warning" },
  resolved: { label: "محلولة", variant: "success" },
};

export function TicketsPage() {
  const { data: apiData } = useInboxConversations({
    enabled: APP_CONFIG.apiEnabled
  });

  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [selected, setSelected] = useState(null); // Initially null - only show the list!
  const [ticketFilter, setTicketFilter] = useState("all");
  const [commentText, setCommentText] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  // Sync API data if enabled
  useEffect(() => {
    if (APP_CONFIG.apiEnabled && apiData?.items) {
      const apiTickets = apiData.items
        .filter(c => c.raw?.ticketNumber)
        .map(apiConv => {
          const messages = apiConv.raw?.messages?.map((m, idx) => ({
            id: m._id || idx,
            role: m.sender === "bot" ? "ai" : m.sender,
            text: m.body,
            time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" }) : "غير محدد"
          })) || [];

          const timeline = apiConv.raw?.internalNotes?.map((note, idx) => ({
            id: idx,
            type: "comment",
            text: `ملاحظة داخلية: ${note.note}`,
            time: note.createdAt ? new Date(note.createdAt).toLocaleDateString("ar-JO") : "الآن"
          })) || [];

          return {
            id: apiConv.raw.ticketNumber || apiConv.id,
            name: apiConv.name || "عضو نقابة",
            topic: apiConv.topic || "استفسار عام",
            description: apiConv.preview || "لا يوجد وصف للتذكرة.",
            time: apiConv.time ? new Date(apiConv.time).toLocaleDateString("ar-JO") : "",
            priority: apiConv.raw?.priority || "normal",
            status: apiConv.raw?.ticketStatus || "pending",
            assignee: apiConv.raw?.assignee || "غير مسند",
            category: apiConv.raw?.category || "شؤون الأعضاء",
            updated: apiConv.raw?.updatedAt ? new Date(apiConv.raw.updatedAt).toLocaleDateString("ar-JO") : "",
            memberId: apiConv.raw?.memberId || "غير محدد",
            joinYear: apiConv.raw?.joinYear || "2020",
            statusSubscription: apiConv.raw?.membershipStatus || "نشط",
            trustLevel: apiConv.raw?.trustLevel || 90,
            phone: apiConv.raw?.customerPhone || "",
            messages: messages,
            timeline: [
              { id: "sys-1", type: "system", text: "تم إنشاء التذكرة تلقائياً بواسطة المساعد الذكي", time: "البداية" },
              ...timeline
            ]
          };
        });

      if (apiTickets.length > 0) {
        setTickets(apiTickets);
        if (selected) {
          const matched = apiTickets.find(t => t.id === selected.id);
          if (matched) {
            setSelected(matched);
          }
        }
      }
    }
  }, [apiData]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selected) return;

    const newActivity = {
      id: Date.now(),
      type: "comment",
      text: `ملاحظة من العميل: ${commentText}`,
      time: "الآن",
    };

    const updatedTickets = tickets.map((t) => {
      if (t.id === selected.id) {
        const updated = {
          ...t,
          timeline: [...t.timeline, newActivity],
        };
        setSelected(updated);
        return updated;
      }
      return t;
    });

    setTickets(updatedTickets);
    setCommentText("");
  };

  const handleUpdateStatus = (statusValue) => {
    if (!selected) return;

    const updatedTickets = tickets.map((t) => {
      if (t.id === selected.id) {
        const updated = {
          ...t,
          status: statusValue,
          timeline: [
            ...t.timeline,
            {
              id: Date.now(),
              type: "system",
              text: `تم تغيير حالة التذكرة إلى: ${STATUS_MAP[statusValue].label}`,
              time: "الآن",
            },
          ],
        };
        setSelected(updated);
        return updated;
      }
      return t;
    });

    setTickets(updatedTickets);
  };

  const handleAssignTicket = (assigneeName) => {
    if (!selected || !assigneeName) return;

    const updatedTickets = tickets.map((t) => {
      if (t.id === selected.id) {
        const updated = {
          ...t,
          assignee: assigneeName,
          timeline: [
            ...t.timeline,
            {
              id: Date.now(),
              type: "assign",
              text: `تم إسناد التذكرة إلى: ${assigneeName}`,
              time: "الآن",
            },
          ],
        };
        setSelected(updated);
        return updated;
      }
      return t;
    });

    setTickets(updatedTickets);
  };

  // Filter tickets
  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === "new") return t.status === "new";
    if (ticketFilter === "pending") return t.status === "pending";
    if (ticketFilter === "resolved") return t.status === "resolved";
    return true;
  });

  return (
    <PageContainer fullHeight className="flex h-[calc(100vh-8.5rem)] flex-col">
      <SectionHeader
        title="تذاكر الدعم الفني والتصعيدات"
        description="متابعة تذاكر الدعم والطلبات المحولة من المساعد الذكي لمعالجة قضايا المشتركين."
      />

      <div className="flex min-h-0 flex-1 gap-4">
        {/* Ticket list - stretches to 100% width if no ticket is selected */}
        <Card className={cn("flex flex-col overflow-hidden transition-all duration-300", selected ? "w-80 shrink-0" : "flex-1")}>
          <CardHeader className="px-4 py-3 border-b border-border-subtle">
            <p className="text-sm font-semibold text-primary">قائمة التذاكر</p>
          </CardHeader>
          <div className="border-b border-border-subtle px-3 py-2">
            <Tabs
              tabs={TICKET_TABS}
              active={ticketFilter}
              onChange={setTicketFilter}
              className="w-full"
            />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border-subtle">
            {filteredTickets.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted">لا توجد تذاكر حالياً.</div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selected && selected.id === t.id;
                const statusInfo = STATUS_MAP[t.status];
                const priorityInfo = PRIORITY_MAP[t.priority];
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelected(t)}
                    className={cn(
                      "w-full px-4 py-3 text-start transition-colors relative flex flex-col gap-1.5",
                      isSelected
                        ? "bg-accent-muted/40 border-s-2 border-s-primary"
                        : "hover:bg-background"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-primary">{t.topic}</span>
                        <p className="text-[10px] text-muted">{t.name}</p>
                      </div>
                      <span className="shrink-0 text-[9px] text-subtle">{t.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                      <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
                      <span className="text-[10px] text-subtle ms-auto">{t.id}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* Ticket Workspace - only rendered if a ticket is selected */}
        {selected && (
          <Card className="flex min-w-0 flex-1 flex-col overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3 bg-background/30">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-mono bg-background px-2 py-0.5 rounded border border-border-subtle">
                  {selected.id}
                </span>
                <div
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowProfile(!showProfile)}
                  title="عرض/إخفاء بيانات العضو"
                >
                  <h3 className="text-sm font-semibold text-primary">{selected.name}</h3>
                  <Badge variant="neutral" className="ltr cursor-pointer">{selected.phone}</Badge>
                </div>
                <Badge variant={STATUS_MAP[selected.status].variant}>
                  {STATUS_MAP[selected.status].label}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {selected.status !== "resolved" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Check}
                    onClick={() => handleUpdateStatus("resolved")}
                  >
                    حل التذكرة
                  </Button>
                )}
                {selected.status === "resolved" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus("pending")}
                  >
                    إعادة فتح التذكرة
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelected(null);
                    setShowProfile(false);
                  }}
                  className="text-muted hover:text-primary hover:bg-background h-8 px-2 text-xs"
                  title="إغلاق التذكرة والعودة"
                >
                  إغلاق التفاصيل
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-background/5">
              {/* Ticket description */}
              <div className="bg-surface rounded-lg p-4 border border-border-subtle">
                <p className="text-xs font-semibold text-primary mb-1.5">وصف المشكلة والتفاصيل:</p>
                <p className="text-xs text-muted leading-relaxed">{selected.description}</p>
                <div className="mt-3 pt-3 border-t border-border-subtle/50 grid grid-cols-3 gap-2 text-[10px] text-muted">
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-primary" />
                    <span>المسؤول: <strong>{selected.assignee}</strong></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>تاريخ التعديل: <strong>{selected.updated}</strong></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 text-primary" />
                    <span>التصنيف: <strong>{selected.category}</strong></span>
                  </div>
                </div>
              </div>

              {/* Assignment Controls */}
              {selected.status !== "resolved" && (
                <div className="bg-surface rounded-lg p-4 border border-border-subtle flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-[10px] font-semibold text-primary mb-1">إسناد لموظف آخر</label>
                    <Select
                      value={selectedAssignee}
                      onChange={(e) => {
                        setSelectedAssignee(e.target.value);
                        handleAssignTicket(e.target.value);
                      }}
                      className="text-xs h-8"
                    >
                      <option value="">اختر موظف...</option>
                      <option value="م. أسماء العتيبي">م. أسماء العتيبي</option>
                      <option value="م. جهاد حمدان">م. جهاد حمدان</option>
                      <option value="م. محمد فوزي">م. محمد فوزي</option>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-[10px] font-semibold text-primary mb-1">تغيير حالة التذكرة</label>
                    <Select
                      value={selected.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className="text-xs h-8"
                    >
                      <option value="new">جديدة</option>
                      <option value="pending">قيد المتابعة</option>
                      <option value="resolved">محلولة</option>
                    </Select>
                  </div>
                </div>
              )}

              {/* Chat history transcript */}
              <div className="rounded-lg border border-border-subtle bg-surface/50 p-4">
                <p className="text-xs font-semibold text-primary border-b border-border-subtle pb-1.5 mb-3 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  سجل المحادثة المرتبط بالتذكرة
                </p>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selected.messages.map((msg) => {
                    const isUser = msg.role === "user";
                    const isSystem = msg.role === "system";
                    if (isSystem) {
                      return (
                        <div key={msg.id} className="text-center">
                          <span className="inline-block text-[10px] bg-error/5 text-error px-2 py-0.5 rounded border border-error/10 font-medium">
                            {msg.text}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div key={msg.id} className={cn("flex flex-col gap-0.5", isUser ? "items-start" : "items-end")}>
                        <span className="text-[9px] text-subtle px-1">{isUser ? selected.name : "المساعد الذكي"}</span>
                        <div className={cn("max-w-[80%] rounded px-3 py-1.5 text-xs", isUser ? "bg-background border border-border-subtle text-primary" : "bg-accent-muted/40 border border-accent-subtle text-primary")}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Log Timeline */}
              <div className="bg-surface rounded-lg p-4 border border-border-subtle">
                <p className="text-xs font-semibold text-primary mb-2 border-b border-border-subtle/50 pb-1">سجل التغييرات والنشاطات:</p>
                <div className="space-y-3">
                  {selected.timeline.map((act) => (
                    <div key={act.id} className="flex gap-2.5 items-start text-xs">
                      <span className="text-[10px] text-subtle font-mono mt-0.5">{act.time}</span>
                      <div className="flex-1 bg-background/50 rounded p-2 text-[11px] text-muted border border-border-subtle/30">
                        {act.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Note Input */}
            <div className="border-t border-border-subtle bg-surface p-4">
              <form onSubmit={handleAddComment} className="flex items-end gap-2">
                <Textarea
                  placeholder="اكتب ملاحظة داخلية للتذكرة..."
                  rows={2}
                  className="flex-1 text-xs"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button type="submit" icon={Send} iconPosition="end">
                  إرسال ملاحظة
                </Button>
              </form>
            </div>
          </Card>
        )}

        {/* Member profile - only rendered if a ticket is selected and showProfile is true */}
        {selected && showProfile ? (
          <Card className="hidden w-72 shrink-0 overflow-y-auto xl:flex xl:flex-col animate-fade-in">
            <CardHeader
              title="بيانات العضو"
              action={
                <button type="button" className="text-subtle hover:text-primary" onClick={() => setShowProfile(false)}>
                  <X className="h-4 w-4" />
                </button>
              }
            />
            <CardBody className="space-y-4 p-4">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-muted text-xl font-semibold text-primary">
                  {selected.name.split(" ").slice(1, 3).map(n => n.charAt(0)).join("") || "مه"}
                </div>
                <p className="mt-2 text-sm font-semibold text-primary">{selected.name}</p>
                <Badge variant="success" className="mt-1">
                  عضوية موثقة
                </Badge>
                <p className="mt-1 text-xs text-muted">عضو نقابة المهندسين الأردنيين</p>
              </div>

              <dl className="space-y-2 text-xs">
                <div className="flex justify-between rounded-lg bg-background p-2">
                  <dt className="text-muted">رقم العضوية</dt>
                  <dd className="font-medium text-primary">{selected.memberId}</dd>
                </div>
                <div className="flex justify-between rounded-lg bg-background p-2">
                  <dt className="text-muted">تاريخ الانتساب</dt>
                  <dd className="font-medium text-primary">{selected.joinYear}</dd>
                </div>
                <div className="flex justify-between rounded-lg border border-error/20 bg-error/5 p-2">
                  <dt className="text-error font-medium">حالة الاشتراك</dt>
                  <dd className="font-medium text-error">{selected.statusSubscription}</dd>
                </div>
                <div className="flex justify-between rounded-lg bg-background p-2">
                  <dt className="text-muted">الهاتف</dt>
                  <dd className="font-medium text-primary ltr">{selected.phone}</dd>
                </div>
              </dl>

              <div>
                <p className="mb-1 text-xs text-muted">مستوى الثقة العام</p>
                <ProgressBar value={selected.trustLevel} />
                <p className="mt-0.5 text-end text-[10px] text-subtle">{selected.trustLevel}%</p>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-primary">تذاكر أخرى للمهندس</p>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-start text-[11px] hover:bg-background"
                >
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  طلب تعديل بيانات شخصية
                </button>
              </div>
            </CardBody>
          </Card>
        ) : null}
      </div>
    </PageContainer>
  );
}
