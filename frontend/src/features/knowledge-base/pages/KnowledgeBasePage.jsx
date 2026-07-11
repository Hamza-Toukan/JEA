import { useState } from "react";
import { Plus, Search, Filter, X, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { PageContainer, SectionHeader } from "@/components/layout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";
import { KB_ARTICLES } from "../data/mock";

const STATUS_MAP = {
  approved: { label: "معتمد", variant: "success" },
  review: { label: "قيد المراجعة", variant: "warning" },
  draft: { label: "مسودة", variant: "neutral" },
};

const detectCategory = (filename) => {
  const name = filename.toLowerCase();
  if (name.includes("تأمين") || name.includes("صحي") || name.includes("مرض") || name.includes("علاج")) {
    return "التأمين الصحي";
  }
  if (name.includes("عضو") || name.includes("اشتراك") || name.includes("ترق") || name.includes("انتساب") || name.includes("شؤون")) {
    return "شؤون الأعضاء";
  }
  return "قوانين وتشريعات"; // default
};

const renderMarkdown = (text) => {
  if (!text) return <p className="text-xs text-muted">لا يوجد محتوى متاح حالياً.</p>;
  
  const lines = text.split("\n");
  
  return lines.map((line, idx) => {
    let cleanLine = line.trim();
    
    // Horizontal rule
    if (cleanLine.startsWith("---") || cleanLine.startsWith("___") || cleanLine.startsWith("***")) {
      return <hr key={idx} className="my-2 border-border-subtle" />;
    }
    
    // Headings
    if (cleanLine.startsWith("# ")) {
      return <h1 key={idx} className="text-xs font-bold mt-2 mb-1 text-primary">{cleanLine.substring(2)}</h1>;
    }
    if (cleanLine.startsWith("## ")) {
      return <h2 key={idx} className="text-[11px] font-bold mt-1.5 mb-0.5 text-primary">{cleanLine.substring(3)}</h2>;
    }
    if (cleanLine.startsWith("### ")) {
      return <h3 key={idx} className="text-[10px] font-semibold mt-1.5 mb-0.5 text-primary">{cleanLine.substring(4)}</h3>;
    }
    
    // Lists
    if (cleanLine.startsWith("- ") || cleanLine.startsWith("* ")) {
      return (
        <ul key={idx} className="list-disc list-inside ms-2 text-[11px] text-muted">
          <li>{cleanLine.substring(2)}</li>
        </ul>
      );
    }
    if (/^\d+\.\s/.test(cleanLine)) {
      const content = cleanLine.replace(/^\d+\.\s/, "");
      return (
        <ol key={idx} className="list-decimal list-inside ms-2 text-[11px] text-muted">
          <li>{content}</li>
        </ol>
      );
    }
    
    // Empty line
    if (!cleanLine) {
      return <div key={idx} className="h-1.5" />;
    }
    
    // Normal paragraph
    return (
      <p key={idx} className="text-[11px] leading-relaxed text-muted mb-1">
        {cleanLine}
      </p>
    );
  });
};

const loadPdfJs = () => {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const extractTextFromPdf = async (file) => {
  const pdfjs = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    text += pageText + "\n";
  }
  return text;
};

const normalizeArabic = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\u064B-\u065F]/g, ""); // Remove Arabic diacritics
};

export function KnowledgeBasePage() {
  const [articles, setArticles] = useState(KB_ARTICLES);
  const [selected, setSelected] = useState(null);

  // Search and Filter States (Instant / Reactive)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("كل التصنيفات");
  const [selectedStatus, setSelectedStatus] = useState("كل الحالات");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "قوانين وتشريعات",
    status: "approved",
    author: "",
    snippet: "",
  });

  // Filtered Articles (Calculated on the fly instantly)
  const filteredArticles = articles.filter((article) => {
    const normalizedQuery = normalizeArabic(searchQuery);

    const matchesSearch =
      normalizeArabic(article.title).includes(normalizedQuery) ||
      normalizeArabic(article.id).includes(normalizedQuery) ||
      (article.snippet &&
        normalizeArabic(article.snippet).includes(normalizedQuery));

    const matchesCategory =
      selectedCategory === "كل التصنيفات" || article.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "كل الحالات" ||
      STATUS_MAP[article.status]?.label === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      let content = "";
      const filename = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;

      if (file.name.endsWith(".md")) {
        content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (evt) => resolve(evt.target.result);
          reader.onerror = (err) => reject(err);
          reader.readAsText(file);
        });
      } else if (file.name.endsWith(".pdf")) {
        content = await extractTextFromPdf(file);
      } else {
        alert("صيغة الملف غير مدعومة. يرجى رفع ملف PDF أو Markdown فقط.");
        setIsUploading(false);
        return;
      }

      const detectedCategory = detectCategory(filename);

      setFormData((prev) => ({
        ...prev,
        title: filename,
        author: "ملف مرفوع",
        category: detectedCategory,
        snippet: content.trim(),
      }));
    } catch (err) {
      console.error("Failed to parse file:", err);
      alert("حدث خطأ أثناء قراءة الملف. يرجى التأكد من أن الملف ليس مشفراً أو تالفاً.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Add Article Form
  const openAddModal = () => {
    setFormData({
      title: "",
      category: "قوانين وتشريعات",
      status: "approved",
      author: "",
      snippet: "",
    });
    setIsAddModalOpen(true);
  };

  const submitAddArticle = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim() || !formData.snippet.trim()) return;

    const newId = `KNB-2026-${String(articles.length + 1).padStart(3, "0")}`;
    const newArticle = {
      id: newId,
      title: formData.title,
      category: formData.category,
      status: formData.status,
      author: formData.author,
      snippet: formData.snippet,
      usage: 0,
      confidence: Math.floor(Math.random() * 15) + 85, // random confidence 85-99%
      updated: new Date().toISOString().split("T")[0],
    };

    const updatedArticles = [...articles, newArticle];
    setArticles(updatedArticles);
    setSelected(newArticle);
    setIsAddModalOpen(false);
  };

  // Handle Edit Article Form
  const openEditModal = () => {
    if (!selected) return;
    setFormData({
      title: selected.title,
      category: selected.category,
      status: selected.status,
      author: selected.author || "",
      snippet: selected.snippet || "",
    });
    setIsEditModalOpen(true);
  };

  const submitEditArticle = (e) => {
    e.preventDefault();
    if (!selected || !formData.title.trim() || !formData.author.trim() || !formData.snippet.trim()) return;

    const updatedArticles = articles.map((art) => {
      if (art.id === selected.id) {
        const updated = {
          ...art,
          title: formData.title,
          category: formData.category,
          status: formData.status,
          author: formData.author,
          snippet: formData.snippet,
          updated: new Date().toISOString().split("T")[0],
        };
        setSelected(updated);
        return updated;
      }
      return art;
    });

    setArticles(updatedArticles);
    setIsEditModalOpen(false);
  };

  // Handle Delete Article
  const handleDeleteArticle = (id) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذا المقال؟")) return;
    const updatedArticles = articles.filter((art) => art.id !== id);
    setArticles(updatedArticles);
    setSelected(null);
  };

  return (
    <PageContainer>
      <SectionHeader
        title="إدارة قاعدة المعرفة"
        description="مقالات ومصادر المعرفة المستخدمة من قبل المساعد الذكي."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            إضافة مقال جديد
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="بحث في العناوين والمحتوى..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="كل التصنيفات">كل التصنيفات</option>
            <option value="قوانين وتشريعات">قوانين وتشريعات</option>
            <option value="شؤون الأعضاء">شؤون الأعضاء</option>
            <option value="التأمين الصحي">التأمين الصحي</option>
          </Select>
        </div>
        <div className="w-36">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="كل الحالات">كل الحالات</option>
            <option value="معتمد">معتمد</option>
            <option value="قيد المراجعة">قيد المراجعة</option>
            <option value="مسودة">مسودة</option>
          </Select>
        </div>
        <Button
          variant="secondary"
          icon={X}
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setSelectedCategory("كل التصنيفات");
            setSelectedStatus("كل الحالات");
          }}
        >
          إعادة تعيين
        </Button>
      </div>

      <div className="flex gap-4">
        <Card className="min-w-0 flex-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-background/80 text-xs text-muted">
                  <th className="px-4 py-3 text-start font-medium w-8">
                    <input type="checkbox" className="rounded border-border" />
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
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-muted">
                      لا يوجد نتائج تطابق البحث والتصفية.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => {
                    const st = STATUS_MAP[article.status] || STATUS_MAP.draft;
                    const isSelected = selected && selected.id === article.id;
                    return (
                      <tr
                        key={article.id}
                        onClick={() => setSelected(article)}
                        className={cn(
                          "cursor-pointer border-b border-border-subtle transition-colors",
                          isSelected
                            ? "bg-accent-muted/40"
                            : "hover:bg-background"
                        )}
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="rounded border-border" />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-primary">{article.title}</p>
                          <p className="text-[11px] text-subtle">{article.id}</p>
                        </td>
                        <td className="px-4 py-3 text-muted">{article.category}</td>
                        <td className="px-4 py-3 text-muted">
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
                        <td className="px-4 py-3 text-subtle text-xs">
                          {article.updated}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border-subtle px-4 py-3 text-xs text-muted">
            <span>عرض 1–{filteredArticles.length} من {filteredArticles.length} مقال</span>
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

        {selected && (
          <Card className="hidden w-80 shrink-0 lg:block">
            <CardHeader
              title={selected.title}
              action={
                <button type="button" className="text-subtle" onClick={() => setSelected(null)}>
                  <X className="h-4 w-4" />
                </button>
              }
            />
            <CardBody className="space-y-4 p-4">
              <Badge variant={STATUS_MAP[selected.status]?.variant || "neutral"}>
                {STATUS_MAP[selected.status]?.label}
              </Badge>

              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-background p-2">
                  <dt className="text-subtle">المعرف</dt>
                  <dd className="font-medium text-primary">{selected.id}</dd>
                </div>
                <div className="rounded-lg bg-background p-2">
                  <dt className="text-subtle">المؤلف</dt>
                  <dd className="font-medium text-primary">{selected.author || "غير محدد"}</dd>
                </div>
                <div className="rounded-lg bg-background p-2">
                  <dt className="text-subtle">المشاهدات</dt>
                  <dd className="font-medium text-primary">{selected.usage}</dd>
                </div>
                <div className="rounded-lg bg-background p-2">
                  <dt className="text-subtle">آخر تحديث</dt>
                  <dd className="font-medium text-primary">{selected.updated}</dd>
                </div>
              </dl>

              <div className="rounded-lg border border-accent-subtle bg-accent-muted/50 p-3 text-xs leading-relaxed text-primary max-h-60 overflow-y-auto">
                <p className="font-semibold mb-1 border-b border-accent-subtle/30 pb-1">مقتطف من المقال:</p>
                <div className="space-y-1.5 mt-2">
                  {renderMarkdown(selected.snippet)}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs text-muted">دقة الاستخراج</p>
                <ProgressBar value={selected.confidence} variant={selected.confidence >= 90 ? "success" : "default"} />
              </div>
              <div>
                <p className="mb-1 text-xs text-muted">ملاءمة السياق</p>
                <ProgressBar value={Math.min(selected.confidence + 2, 100)} />
              </div>

              <div className="flex gap-2 pt-2">
                <Button icon={Pencil} className="flex-1" onClick={openEditModal}>
                  تعديل المقال
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="px-2 text-error hover:bg-error/10 hover:border-error/20"
                  onClick={() => handleDeleteArticle(selected.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Add Article Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة مقال معرفة جديد"
        description="أدخل تفاصيل المقال الذي سيستخدمه الذكي للإجابة على استفسارات المهندسين."
      >
        <form onSubmit={submitAddArticle} className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-background/50 transition-colors relative">
            <input
              type="file"
              accept=".pdf,.md"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="text-xs text-muted flex flex-col items-center gap-2 justify-center py-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                جاري قراءة وتحليل الملف...
              </div>
            ) : (
              <div className="text-xs text-muted">
                <p className="font-semibold text-primary mb-1">استيراد من ملف PDF أو Markdown (.md)</p>
                <p className="text-[10px]">اسحب الملف هنا أو انقر للاختيار (سيقوم النظام باستخراج النصوص وتعبئة النموذج تلقائياً)</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-primary">عنوان المقال</label>
            <Input
              required
              placeholder="مثال: تعليمات اشتراك المهندسين..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-primary">التصنيف</label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="قوانين وتشريعات">قوانين وتشريعات</option>
                <option value="شؤون الأعضاء">شؤون الأعضاء</option>
                <option value="التأمين الصحي">التأمين الصحي</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-primary">الحالة</label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="approved">معتمد</option>
                <option value="review">قيد المراجعة</option>
                <option value="draft">مسودة</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-primary">المؤلف</label>
            <Input
              required
              placeholder="مثال: إدارة العضوية..."
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-primary">مقتطف ومحتوى المقال</label>
            <Textarea
              required
              rows={4}
              placeholder="اكتب هنا التفاصيل أو مقتطفاً من المقال المعتمد..."
              value={formData.snippet}
              onChange={(e) => setFormData({ ...formData, snippet: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
            <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">حفظ المقال</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Article Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="تعديل مقال المعرفة"
        description="تعديل وتحديث البيانات الخاصة بالمقال المعتمد لدى البوت."
      >
        <form onSubmit={submitEditArticle} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-primary">عنوان المقال</label>
            <Input
              required
              placeholder="مثال: تعليمات اشتراك المهندسين..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-primary">التصنيف</label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="قوانين وتشريعات">قوانين وتشريعات</option>
                <option value="شؤون الأعضاء">شؤون الأعضاء</option>
                <option value="التأمين الصحي">التأمين الصحي</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-primary">الحالة</label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="approved">معتمد</option>
                <option value="review">قيد المراجعة</option>
                <option value="draft">مسودة</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-primary">المؤلف</label>
            <Input
              required
              placeholder="مثال: إدارة العضوية..."
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-primary">مقتطف ومحتوى المقال</label>
            <Textarea
              required
              rows={4}
              placeholder="اكتب هنا التفاصيل أو مقتطفاً من المقال المعتمد..."
              value={formData.snippet}
              onChange={(e) => setFormData({ ...formData, snippet: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
            <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">حفظ التغييرات</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
