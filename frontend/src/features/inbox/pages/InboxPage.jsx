import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Paperclip,
  Send,
  Smile,
  Bot,
  X,
  FileText,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { PageContainer, SectionHeader } from "@/components/layout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";
import { CONVERSATIONS } from "../data/mock";
import { useInboxConversations } from "../hooks/use-inbox-conversations";
import { APP_CONFIG } from "@/config/app";

const INBOX_TABS = [
  { id: "all", label: "كل المحادثات" },
  { id: "unread", label: "غير مقروء" },
  { id: "active", label: "النشطة" },
];

const QUICK_REPLIES = ["مرحباً بك مهندسنا العزيز كيف يمكنني مساعدتك؟", "تم استلام استفسارك وسيتم تحويله للقسم المختص.", "يرجى تزويدنا بصورة عن الهوية الشخصية لتوثيق الحساب."];

export function InboxPage() {
  const { data: apiData } = useInboxConversations({
    enabled: APP_CONFIG.apiEnabled
  });

  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [selected, setSelected] = useState(null); // Initially null - only show the list!
  const [inboxFilter, setInboxFilter] = useState("all");
  const [typedMessage, setTypedMessage] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  // Broadcast Modal State
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [broadcastText, setBroadcastText] = useState("");
  const [broadcastCategory, setBroadcastCategory] = useState("all");
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [sendingCount, setSendingCount] = useState(0);

  // Sync API data if enabled
  useEffect(() => {
    if (APP_CONFIG.apiEnabled && apiData?.items) {
      const apiConversations = apiData.items.map(apiConv => {
        const existing = conversations.find(c => c.id === apiConv.id);
        const messages = existing?.messages?.length > (apiConv.raw?.messages?.length || 0)
          ? existing.messages
          : apiConv.raw?.messages?.map((m, idx) => ({
              id: m._id || idx,
              role: m.sender === "bot" ? "ai" : m.sender,
              text: m.body,
              time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" }) : "غير محدد"
            })) || [];

        return {
          id: apiConv.id,
          name: apiConv.name || "عضو نقابة",
          topic: apiConv.topic || "استفسار عام",
          preview: apiConv.preview || "",
          time: apiConv.time ? new Date(apiConv.time).toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" }) : "",
          verified: apiConv.verified,
          unread: apiConv.unread,
          phone: apiConv.raw?.customerPhone || "",
          memberId: apiConv.raw?.memberId || "غير محدد",
          joinYear: apiConv.raw?.joinYear || "2020",
          statusSubscription: apiConv.raw?.membershipStatus || "نشط",
          trustLevel: apiConv.raw?.trustLevel || 90,
          messages: messages
        };
      });

      if (apiConversations.length > 0) {
        setConversations(apiConversations);
        if (selected) {
          const matched = apiConversations.find(c => c.id === selected.id);
          if (matched) {
            setSelected(matched);
          }
        }
      }
    }
  }, [apiData]);

  // Handle message sending simulation
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!typedMessage.trim() || !selected) return;

    const newMsg = {
      id: Date.now(),
      role: "ai",
      text: typedMessage,
      time: new Date().toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedConversations = conversations.map((c) => {
      if (c.id === selected.id) {
        const newConversationsObj = {
          ...c,
          preview: typedMessage,
          unread: false,
          messages: [...c.messages, newMsg],
        };
        setSelected(newConversationsObj);
        return newConversationsObj;
      }
      return c;
    });

    setConversations(updatedConversations);
    setTypedMessage("");
  };

  const handleQuickReply = (text) => {
    setTypedMessage(text);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (inboxFilter === "unread") return c.unread;
    return true;
  });

  // Filter possible recipients in Broadcast Modal based on selected category
  const filteredRecipients = conversations.filter(c => {
    if (broadcastCategory === "all") return true;
    if (broadcastCategory === "health") return c.topic?.includes("تأمين") || c.topic?.includes("صحي");
    if (broadcastCategory === "members") return c.topic?.includes("عضو") || c.topic?.includes("اشتراك");
    return true;
  });

  // Toggle single recipient checkbox in Broadcast Modal
  const toggleRecipient = (id) => {
    if (selectedRecipients.includes(id)) {
      setSelectedRecipients(selectedRecipients.filter(r => r !== id));
    } else {
      setSelectedRecipients([...selectedRecipients, id]);
    }
  };

  // Toggle check/uncheck all filtered recipients
  const toggleSelectAll = () => {
    if (selectedRecipients.length === filteredRecipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(filteredRecipients.map(r => r.id));
    }
  };

  // Handle Broadcast Submission
  const handleSendBroadcast = async () => {
    if (selectedRecipients.length === 0 || !broadcastText.trim()) return;

    setIsSendingBroadcast(true);
    setSendingProgress(0);
    setSendingCount(0);

    const total = selectedRecipients.length;
    for (let i = 0; i < total; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setSendingCount(i + 1);
      setSendingProgress(Math.round(((i + 1) / total) * 100));
    }

    const nowTime = new Date().toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" });
    const updatedConversations = conversations.map(c => {
      if (selectedRecipients.includes(c.id)) {
        return {
          ...c,
          preview: broadcastText,
          unread: false,
          messages: [
            ...c.messages,
            {
              id: Date.now() + Math.random(),
              role: "ai",
              text: broadcastText,
              time: nowTime
            }
          ]
        };
      }
      return c;
    });

    setConversations(updatedConversations);

    if (selected && selectedRecipients.includes(selected.id)) {
      const match = updatedConversations.find(c => c.id === selected.id);
      if (match) setSelected(match);
    }

    setIsSendingBroadcast(false);
    setIsBroadcastOpen(false);
    setBroadcastText("");
    setSelectedRecipients([]);
  };

  return (
    <PageContainer fullHeight className="flex h-[calc(100vh-8.5rem)] flex-col">
      <SectionHeader
        title="محادثات الواتساب والمساعد الذكي"
        description="إدارة محادثات الدعم المباشرة مع أعضاء نقابة المهندسين الأردنيين."
      />

      <div className="flex min-h-0 flex-1 gap-4">
        {/* Conversation list - stretches to 100% if no member is selected */}
        <Card className={cn("flex flex-col overflow-hidden transition-all duration-300", selected ? "w-80 shrink-0" : "flex-1")}>
          <CardHeader
            title="المحادثات النشطة"
            action={
              <Button
                variant="ghost"
                size="sm"
                icon={Megaphone}
                onClick={() => setIsBroadcastOpen(true)}
                className="text-primary hover:bg-accent-muted h-7 px-2 text-xs font-semibold gap-1"
                title="بث رسالة جماعية"
              >
                بث جماعي
              </Button>
            }
            className="border-b border-border-subtle"
          />
          <div className="border-b border-border-subtle px-3 py-2">
            <Tabs
              tabs={INBOX_TABS}
              active={inboxFilter}
              onChange={setInboxFilter}
              className="w-full"
            />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border-subtle">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted">لا توجد محادثات.</div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = selected && selected.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelected(c)}
                    className={cn(
                      "w-full px-4 py-3.5 text-start transition-colors relative flex flex-col gap-1",
                      isSelected
                        ? "bg-accent-muted/40 border-s-2 border-s-primary"
                        : "hover:bg-background"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-medium text-primary">
                            {c.name}
                          </span>
                          {c.verified && (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-[11px] font-medium text-muted ltr text-start">
                          {c.phone}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] text-subtle">{c.time}</span>
                    </div>
                    <p className="truncate text-[11px] text-muted text-start mt-0.5">
                      {c.preview}
                    </p>
                    {c.unread && (
                      <span className="absolute end-4 bottom-4 h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* Chat - only rendered if a conversation is selected */}
        {selected && (
          <Card className="flex min-w-0 flex-1 flex-col overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3 bg-background/30">
              <div>
                <div
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowProfile(!showProfile)}
                  title="عرض/إخفاء بيانات العضو"
                >
                  <h3 className="text-sm font-semibold text-primary">{selected.name}</h3>
                  <Badge variant="neutral" className="ltr cursor-pointer">{selected.phone}</Badge>
                </div>
                <p className="text-[11px] text-muted mt-0.5">الموضوع النشط: {selected.topic}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelected(null);
                    setShowProfile(false);
                  }}
                  className="text-muted hover:text-primary hover:bg-background h-8 px-2 text-xs"
                  title="إغلاق المحادثة والعودة"
                >
                  إغلاق المحادثة
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-background/10 p-5">
              {selected.messages.map((msg) => {
                const isUser = msg.role === "user";
                const isAi = msg.role === "ai";

                return (
                  <div
                    key={msg.id}
                    className={cn("flex", isUser ? "justify-start" : "justify-end")}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-xl px-4 py-2.5 text-sm shadow-sm",
                        isUser
                          ? "rounded-ee-sm bg-surface border border-border-subtle text-primary"
                          : "rounded-es-sm bg-accent-muted/60 border border-accent-subtle text-primary"
                      )}
                    >
                      {isAi && (
                        <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-primary/80">
                          <Bot className="h-3.5 w-3.5" />
                          المساعد الذكي / الموظف
                        </div>
                      )}
                      <p className="leading-relaxed text-xs">{msg.text}</p>
                      <p className="mt-1 text-[9px] text-subtle text-end">{msg.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border-subtle bg-surface p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQuickReply(q)}
                    className="rounded-full border border-border-subtle px-3 py-1 text-[11px] text-muted transition-colors hover:border-primary hover:bg-accent-muted/40 hover:text-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <button type="button" className="rounded-lg p-2 text-muted hover:bg-background">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button type="button" className="rounded-lg p-2 text-muted hover:bg-background">
                  <Smile className="h-4 w-4" />
                </button>
                <Input
                  placeholder="اكتب ردك هنا..."
                  className="flex-1"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                />
                <Button type="submit" icon={Send} iconPosition="end">
                  إرسال
                </Button>
              </form>
            </div>
          </Card>
        )}

        {/* Member profile - only rendered if a conversation is selected and showProfile is true */}
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
                <p className="mb-2 text-xs font-semibold text-primary">تذاكر أخرى</p>
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

      {/* Bulk Send / Broadcast Modal */}
      <Modal
        open={isBroadcastOpen}
        onClose={() => {
          if (!isSendingBroadcast) setIsBroadcastOpen(false);
        }}
        title="بث رسالة جماعية (Broadcast)"
        description="أرسل رسالة فورية إلى أكثر من عميل/عضو في نفس الوقت عبر الواتساب."
        size="lg"
      >
        {isSendingBroadcast ? (
          <div className="space-y-5 py-6 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <div className="space-y-2">
              <p className="text-xs font-semibold text-primary">جاري بث الرسائل للمستلمين...</p>
              <p className="text-[11px] text-muted">تم إرسال {sendingCount} من {selectedRecipients.length} رسالة</p>
            </div>
            <div className="max-w-xs mx-auto">
              <ProgressBar value={sendingProgress} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Category selection */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-primary">تحديد المستلمين حسب التصنيف:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBroadcastCategory("all");
                    setSelectedRecipients([]);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-[11px] transition-colors",
                    broadcastCategory === "all" ? "bg-primary text-white border-primary" : "border-border-subtle hover:bg-background text-muted"
                  )}
                >
                  الكل
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBroadcastCategory("health");
                    const matches = conversations.filter(c => c.topic?.includes("تأمين") || c.topic?.includes("صحي")).map(c => c.id);
                    setSelectedRecipients(matches);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-[11px] transition-colors",
                    broadcastCategory === "health" ? "bg-primary text-white border-primary" : "border-border-subtle hover:bg-background text-muted"
                  )}
                >
                  أعضاء التأمين الصحي
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBroadcastCategory("members");
                    const matches = conversations.filter(c => c.topic?.includes("عضو") || c.topic?.includes("اشتراك")).map(c => c.id);
                    setSelectedRecipients(matches);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-[11px] transition-colors",
                    broadcastCategory === "members" ? "bg-primary text-white border-primary" : "border-border-subtle hover:bg-background text-muted"
                  )}
                >
                  شؤون الأعضاء
                </button>
              </div>
            </div>

            {/* List of members with checkboxes */}
            <div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-1 mb-2">
                <span className="text-xs font-semibold text-primary">قائمة المستلمين ({selectedRecipients.length} محدد):</span>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-[10px] text-primary hover:underline font-semibold"
                >
                  {selectedRecipients.length === filteredRecipients.length ? "إلغاء تحديد الكل" : "تحديد كل المصفى"}
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto border border-border-subtle rounded-lg divide-y divide-border-subtle bg-background/20">
                {filteredRecipients.map((rec) => {
                  const isChecked = selectedRecipients.includes(rec.id);
                  return (
                    <label key={rec.id} className="flex items-center justify-between p-2.5 hover:bg-background cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRecipient(rec.id)}
                          className="h-3.5 w-3.5 rounded border-border-subtle text-primary focus:ring-primary cursor-pointer"
                        />
                        <div className="text-start">
                          <p className="text-xs font-medium text-primary">{rec.name}</p>
                          <p className="text-[10px] text-muted ltr">{rec.phone}</p>
                        </div>
                      </div>
                      <Badge variant="neutral" className="text-[9px]">{rec.topic}</Badge>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-primary">نص رسالة البث الجماعي:</label>
              <textarea
                placeholder="اكتب رسالتك للمهندسين هنا..."
                rows={3}
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                className="w-full text-xs rounded-lg border border-border-subtle p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface text-primary"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
              <Button
                variant="secondary"
                onClick={() => setIsBroadcastOpen(false)}
                className="text-xs"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSendBroadcast}
                disabled={selectedRecipients.length === 0 || !broadcastText.trim()}
                className="text-xs"
              >
                إرسال البث الجماعي
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
