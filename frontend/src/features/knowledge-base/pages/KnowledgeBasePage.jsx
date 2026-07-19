import { useState } from "react";
import { Plus, Search, Filter, X, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { PageContainer, SectionHeader } from "@/components/layout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useQAs, useCreateQA, useUpdateQA, useDeleteQA } from "@/features/qas/hooks/use-qas";
import { useServiceCategories } from "@/features/service-categories/hooks/use-service-categories";

export function KnowledgeBasePage() {
  const { data: qasData, isLoading: qasLoading } = useQAs();
  const { data: categoriesData, isLoading: categoriesLoading } = useServiceCategories();
  const qas = qasData?.data || [];
  const categories = categoriesData?.data || [];

  const createQA = useCreateQA();
  const updateQA = useUpdateQA();
  const deleteQA = useDeleteQA();

  const [selected, setSelected] = useState(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    service_category_id: "",
    content: "",
  });

  const filteredQAs = qas.filter((qa) => {
    const matchesSearch = qa.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || qa.service_category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setFormData({
      service_category_id: categories[0]?.service_id || "",
      content: "",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    if (!selected) return;
    setFormData({
      service_category_id: selected.service_category_id,
      content: selected.content || "",
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!formData.service_category_id || !formData.content.trim()) return;

    if (isEditMode && selected) {
      updateQA.mutate({ id: selected.id, data: { ...formData, content_type: 'TEXT', employee_assigned: 'EMP001' } }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelected(null);
        }
      });
    } else {
      createQA.mutate({ ...formData, content_type: 'TEXT', employee_assigned: 'EMP001', status: 'ACTIVE' }, {
        onSuccess: () => {
          setIsModalOpen(false);
        }
      });
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    deleteQA.mutate(id, {
      onSuccess: () => {
        if (selected?.id === id) setSelected(null);
      }
    });
  };

  const getCategoryName = (id) => {
    return categories.find(c => c.service_id === id)?.service_name || id;
  };

  return (
    <PageContainer>
      <SectionHeader
        title="قاعدة المعرفة"
        description="إدارة المقالات والنصوص والإجابات النموذجية لتدريب المساعد الذكي للرد على الاستفسارات."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            إضافة معرفة
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="بحث في المعرفة..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-64">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">كل الأقسام</option>
            {categories.map(c => (
              <option key={c.service_id} value={c.service_id}>{c.service_name}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <Card className="min-w-0 flex-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-background/80 text-xs text-muted">
                  <th className="px-4 py-3 text-start font-medium">القسم</th>
                  <th className="px-4 py-3 text-start font-medium">المحتوى</th>
                  <th className="px-4 py-3 text-start font-medium">تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody>
                {qasLoading || categoriesLoading ? (
                  <tr><td colSpan="3" className="p-8 text-center text-muted">جاري التحميل...</td></tr>
                ) : filteredQAs.length === 0 ? (
                  <tr><td colSpan="3" className="p-8 text-center text-muted">لا توجد بيانات.</td></tr>
                ) : (
                  filteredQAs.map((qa) => (
                    <tr
                      key={qa.id}
                      onClick={() => setSelected(qa)}
                      className={cn(
                        "cursor-pointer border-b border-border-subtle transition-colors",
                        selected?.id === qa.id ? "bg-accent-muted/40" : "hover:bg-background"
                      )}
                    >
                      <td className="px-4 py-3 font-medium text-primary">{getCategoryName(qa.service_category_id)}</td>
                      <td className="px-4 py-3 text-muted">
                        <div className="truncate max-w-lg">{qa.content}</div>
                      </td>
                      <td className="px-4 py-3 text-subtle text-xs ltr text-start">
                        {new Date(qa.updated_at || qa.updatedAt || qa.created_at || qa.createdAt).toLocaleDateString('ar-JO')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {selected && (
          <Card className="hidden w-96 shrink-0 lg:block">
            <CardHeader
              title="تفاصيل المعرفة"
              action={
                <button type="button" className="text-subtle" onClick={() => setSelected(null)}>
                  <X className="h-4 w-4" />
                </button>
              }
            />
            <CardBody className="space-y-4 p-4">
              <div className="rounded-lg bg-background p-3">
                <p className="text-xs text-subtle mb-1">القسم</p>
                <p className="font-medium text-primary">{getCategoryName(selected.service_category_id)}</p>
              </div>

              <div className="rounded-lg border border-accent-subtle bg-accent-muted/50 p-3 text-sm leading-relaxed text-primary whitespace-pre-wrap max-h-96 overflow-y-auto">
                {selected.content}
              </div>

              <div className="flex gap-2 pt-2">
                <Button icon={Pencil} className="flex-1" onClick={openEditModal}>
                  تعديل
                </Button>
                <Button
                  variant="secondary"
                  className="px-2 text-error hover:bg-error/10 hover:border-error/20"
                  onClick={() => handleDelete(selected.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "تعديل المعرفة" : "إضافة معرفة جديدة"}
      >
        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-primary">القسم</label>
            <Select
              value={formData.service_category_id}
              onChange={(e) => setFormData({ ...formData, service_category_id: e.target.value })}
            >
              {categories.map(c => (
                <option key={c.service_id} value={c.service_id}>{c.service_name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-primary">محتوى المعرفة (سؤال وجواب لتدريب المساعد الذكي)</label>
            <Textarea
              required
              rows={8}
              placeholder="س: ما هي شروط العضوية؟\nج: الشروط هي..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={createQA.isPending || updateQA.isPending}>
              حفظ المعلومات
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
