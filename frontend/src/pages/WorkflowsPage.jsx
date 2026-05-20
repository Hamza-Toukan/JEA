import { useState } from "react";
import {
  MessageSquare,
  IdCard,
  Brain,
  Play,
  Save,
  X,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { cn } from "../lib/cn";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input, Select, Textarea } from "../components/ui/Input";

const NODE_STYLES = {
  trigger: {
    icon: MessageSquare,
    header: "bg-emerald-50 border-emerald-200 text-emerald-800",
    border: "border-emerald-200",
  },
  action: {
    icon: IdCard,
    header: "bg-jea-cyan-muted border-jea-cyan-light text-jea-navy",
    border: "border-jea-cyan-light",
  },
  ai: {
    icon: Brain,
    header: "bg-jea-navy text-white border-jea-navy",
    border: "border-jea-navy-mid",
  },
};

function WorkflowNode({ type, title, subtitle, selected, onClick }) {
  const style = NODE_STYLES[type];
  const Icon = style.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-44 rounded-xl border bg-jea-surface text-start shadow-jea-md transition-shadow",
        style.border,
        selected && "ring-2 ring-jea-cyan ring-offset-2"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-t-xl border-b px-3 py-2 text-xs font-medium",
          style.header
        )}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{title}</span>
      </div>
      <div className="px-3 py-2">
        <p className="text-[10px] text-jea-text-subtle">{subtitle}</p>
      </div>
    </button>
  );
}

export function WorkflowsPage() {
  const [selectedNode, setSelectedNode] = useState("router");

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col">
      <PageHeader
        title="مسارات عمل الذكاء الاصطناعي"
        description="تصميم وتكوين مسارات المحادثة والتوجيه الآلي."
        actions={
          <>
            <Badge variant="neutral">مسودة — مسار الاستفسارات الهندسية</Badge>
            <Button variant="secondary" icon={Play} size="sm">
              تشغيل
            </Button>
          </>
        }
      />

      <div className="flex min-h-0 flex-1 gap-4">
        <Card className="relative min-w-0 flex-1 overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, #c5d4e3 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative flex h-full flex-col">
            <div className="flex-1 overflow-auto p-8">
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden
              >
                <path
                  d="M 220 150 Q 350 100 400 150"
                  fill="none"
                  stroke="#3d8fd1"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.6"
                />
                <path
                  d="M 460 150 Q 580 120 620 150"
                  fill="none"
                  stroke="#3d8fd1"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.6"
                />
              </svg>

              <div className="relative flex items-center gap-16 pt-16">
                <WorkflowNode
                  type="trigger"
                  title="رسالة واردة"
                  subtitle="WhatsApp"
                  selected={selectedNode === "start"}
                  onClick={() => setSelectedNode("start")}
                />
                <WorkflowNode
                  type="action"
                  title="التحقق من الهوية"
                  subtitle="عضوية"
                  selected={selectedNode === "verify"}
                  onClick={() => setSelectedNode("verify")}
                />
                <WorkflowNode
                  type="ai"
                  title="مصنف الذكاء الاصطناعي"
                  subtitle="GPT-4o"
                  selected={selectedNode === "router"}
                  onClick={() => setSelectedNode("router")}
                />
              </div>
            </div>

            <div className="absolute bottom-4 start-4 flex flex-col gap-1 rounded-lg border border-jea-border-soft bg-jea-surface p-1 shadow-jea-md">
              <button type="button" className="rounded p-2 hover:bg-jea-bg">
                <ZoomIn className="h-4 w-4 text-jea-text-muted" />
              </button>
              <button type="button" className="rounded p-2 hover:bg-jea-bg">
                <ZoomOut className="h-4 w-4 text-jea-text-muted" />
              </button>
              <button type="button" className="rounded p-2 hover:bg-jea-bg">
                <Maximize2 className="h-4 w-4 text-jea-text-muted" />
              </button>
            </div>
          </div>
        </Card>

        <Card className="flex w-80 shrink-0 flex-col overflow-hidden">
          <CardHeader
            title="إعدادات العقدة"
            action={
              <button type="button" className="text-jea-text-subtle">
                <X className="h-4 w-4" />
              </button>
            }
          />
          <CardBody className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="flex items-center gap-2 rounded-lg bg-jea-cyan-muted px-3 py-2">
              <Brain className="h-4 w-4 text-jea-navy" />
              <div>
                <p className="text-xs font-medium text-jea-navy">مصنف الذكاء الاصطناعي</p>
                <p className="text-[10px] text-jea-text-subtle">الإصدار 1.2</p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-jea-text-muted">
                اسم العقدة
              </label>
              <Input defaultValue="مصنف الذكاء الاصطناعي" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-jea-text-muted">
                نموذج LLM
              </label>
              <Select className="w-full">
                <option>GPT-4o (افتراضي)</option>
                <option>GPT-4o mini</option>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-jea-text-muted">
                موجه النظام (System Prompt)
              </label>
              <Textarea
                rows={5}
                defaultValue="أنت مساعد ذكي مخصص لنقابة المهندسين الأردنيين. صنّف رسالة العضو إلى أحد المسارات: استفسار فني، دعم مالي، عضوية، أو تصعيد بشري."
              />
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-jea-text-muted">الإبداع (Temperature)</span>
                <span className="font-medium text-jea-navy">0.2</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.2"
                className="w-full accent-jea-cyan"
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-jea-navy">مسارات المخرجات</p>
              <ul className="space-y-2">
                {["استفسار فني", "دعم مالي", "خدمات العضوية"].map((path) => (
                  <li
                    key={path}
                    className="flex items-center justify-between rounded-lg border border-jea-border-soft px-3 py-2 text-xs"
                  >
                    {path}
                  </li>
                ))}
              </ul>
              <Button variant="ghost" size="sm" icon={Plus} className="mt-2 w-full">
                إضافة مسار
              </Button>
            </div>
          </CardBody>
          <div className="flex gap-2 border-t border-jea-border-soft p-4">
            <Button icon={Save} className="flex-1">
              حفظ التغييرات
            </Button>
            <Button variant="secondary">إلغاء</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
