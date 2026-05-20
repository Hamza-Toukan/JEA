import { useState } from "react";
import { Plus, Search, Filter, X, Pencil, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/cn";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { ProgressBar } from "../components/ui/ProgressBar";
import { KB_ARTICLES } from "../data/mock";

const STATUS_MAP = {
  approved: { label: "معتمد", variant: "success" },
  review: { label: "قيد المراجعة", variant: "warning" },
  draft: { label: "مسودة", variant: "neutral" },
};

export function KnowledgeBasePage() {
  const [selected, setSelected] = useState(KB_ARTICLES[0]);

  return (
    <div>
      <PageHeader
        title="إدارة قاعدة المعرفة"
        description="مقالات ومصادر المعرفة المستخدمة من قبل المساعد الذكي."
        actions={
          <Button icon={Plus}>إضافة مقال جديد</Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-[200px] flex-1">
          <Input placeholder="بحث في العناوين والمحتوى..." icon={Search} />
        </div>
        <Select className="w-40">
          <option>كل التصنيفات</option>
          <option>قوانين وتشريعات</option>
          <option>شؤون الأعضاء</option>
          <option>التأمين الصحي</option>
        </Select>
        <Select className="w-36">
          <option>كل الحالات</option>
          <option>معتمد</option>
          <option>قيد المراجعة</option>
        </Select>
        <Button variant="secondary" icon={Filter} size="sm">
          تصفية
        </Button>
      </div>

      <div className="flex gap-4">
        <Card className="min-w-0 flex-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-jea-border-soft bg-jea-bg/80 text-xs text-jea-text-muted">
                  <th className="px-4 py-3 text-start font-medium w-8">
                    <input type="checkbox" className="rounded border-jea-border" />
                  </th>
                  <th className="px-4 py-3 text-start font-medium">عنوان المقال</th>
                  <th className="px-4 py-3 text-start font-medium">التصنيف</th>
                  <th className="px-4 py-3 text-start font-medium">الاستخدام</th>
                  <th className="px-4 py-3 text-start font-medium">الثقة</th>
                  <th className="px-4 py-3 text-start font-medium">الحالة</th>
                  <th className="px-4 py-3 text-start font-medium">آخر تحديث</th>
                </tr>
              </thead>
              <tbody>
                {KB_ARTICLES.map((article) => {
                  const st = STATUS_MAP[article.status] || STATUS_MAP.draft;
                  return (
                    <tr
                      key={article.id}
                      onClick={() => setSelected(article)}
                      className={cn(
                        "cursor-pointer border-b border-jea-border-soft transition-colors",
                        selected.id === article.id
                          ? "bg-jea-cyan-muted/40"
                          : "hover:bg-jea-bg"
                      )}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-jea-border" />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-jea-navy">{article.title}</p>
                        <p className="text-[11px] text-jea-text-subtle">{article.id}</p>
                      </td>
                      <td className="px-4 py-3 text-jea-text-muted">{article.category}</td>
                      <td className="px-4 py-3 text-jea-text-muted">
                        {article.usage.toLocaleString("ar-JO")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ProgressBar
                            value={article.confidence}
                            className="w-16"
                            variant={article.confidence >= 90 ? "success" : "default"}
                          />
                          <span className="text-xs font-medium">{article.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-jea-text-subtle text-xs">
                        {article.updated}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-jea-border-soft px-4 py-3 text-xs text-jea-text-muted">
            <span>عرض 1–3 من 156 مقال</span>
            <div className="flex gap-1">
              <Button variant="secondary" size="sm">
                السابق
              </Button>
              <Button variant="primary" size="sm">
                1
              </Button>
              <Button variant="secondary" size="sm">
                التالي
              </Button>
            </div>
          </div>
        </Card>

        <Card className="hidden w-80 shrink-0 lg:block">
          <CardHeader
            title={selected.title}
            action={
              <button type="button" className="text-jea-text-subtle">
                <X className="h-4 w-4" />
              </button>
            }
          />
          <CardBody className="space-y-4 p-4">
            <Badge variant={STATUS_MAP[selected.status]?.variant || "neutral"}>
              {STATUS_MAP[selected.status]?.label}
            </Badge>

            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-jea-bg p-2">
                <dt className="text-jea-text-subtle">المعرف</dt>
                <dd className="font-medium text-jea-navy">{selected.id}</dd>
              </div>
              <div className="rounded-lg bg-jea-bg p-2">
                <dt className="text-jea-text-subtle">المؤلف</dt>
                <dd className="font-medium text-jea-navy">{selected.author}</dd>
              </div>
              <div className="rounded-lg bg-jea-bg p-2">
                <dt className="text-jea-text-subtle">المشاهدات</dt>
                <dd className="font-medium text-jea-navy">{selected.usage}</dd>
              </div>
              <div className="rounded-lg bg-jea-bg p-2">
                <dt className="text-jea-text-subtle">آخر تحديث</dt>
                <dd className="font-medium text-jea-navy">{selected.updated}</dd>
              </div>
            </dl>

            <div className="rounded-lg border border-jea-cyan-light bg-jea-cyan-muted/50 p-3 text-xs leading-relaxed text-jea-navy">
              مقتطف من المقال: يحدد هذا القانون المتطلبات الأساسية للبناء في المملكة
              ويشمل أحكام السلامة والتصاريح...
            </div>

            <div>
              <p className="mb-1 text-xs text-jea-text-muted">دقة الاستخراج</p>
              <ProgressBar value={95} variant="success" />
            </div>
            <div>
              <p className="mb-1 text-xs text-jea-text-muted">ملاءمة السياق</p>
              <ProgressBar value={92} />
            </div>

            <div className="flex gap-2 pt-2">
              <Button icon={Pencil} className="flex-1">
                تعديل المقال
              </Button>
              <Button variant="secondary" size="md" className="px-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
