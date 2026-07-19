import { useState } from "react";
import { Briefcase, Circle, Plus, Pencil, X } from "lucide-react";
import { PageContainer, SectionHeader } from "@/components/layout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Input";
import { useEmployees } from "../hooks/use-employees";
import { useServiceCategories } from "@/features/service-categories/hooks/use-service-categories";
import { useEmployeeServiceCategories, useCreateESC, useDeleteESC } from "@/features/employee-service-categories/hooks/use-esc";

export function EmployeesPage() {
  const { data: apiResponse, isLoading: empLoading, isError } = useEmployees();
  const { data: categoriesResponse, isLoading: catLoading } = useServiceCategories();
  const { data: escResponse, isLoading: escLoading } = useEmployeeServiceCategories();
  
  const createESC = useCreateESC();
  const deleteESC = useDeleteESC();

  const employees = apiResponse?.data || [];
  const categories = categoriesResponse?.data || [];
  const escMapping = escResponse?.data || [];

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryToAdd, setSelectedCategoryToAdd] = useState("");

  const isLoading = empLoading || catLoading || escLoading;

  // Helper to get employee categories
  const getEmpCategories = (empId) => {
    return escMapping
      .filter((esc) => esc.emp_id === empId)
      .map((esc) => {
        const cat = categories.find((c) => c.service_id === esc.service_category_id);
        return { esc_id: esc.id, ...cat };
      })
      .filter(c => c.service_name);
  };

  const handleEditClick = (emp) => {
    setSelectedEmp(emp);
    setSelectedCategoryToAdd(categories[0]?.service_id || "");
    setIsModalOpen(true);
  };

  const handleAssignCategory = (e) => {
    e.preventDefault();
    if (!selectedCategoryToAdd || !selectedEmp) return;
    
    // Check if already assigned
    const alreadyAssigned = escMapping.some(
      esc => esc.emp_id === selectedEmp.id && esc.service_category_id === selectedCategoryToAdd
    );
    
    if (alreadyAssigned) {
      alert("هذا الموظف منتمٍ بالفعل لهذا القسم");
      return;
    }

    createESC.mutate({ emp_id: selectedEmp.id, service_category_id: selectedCategoryToAdd });
  };

  const handleRemoveCategory = (escId) => {
    if (!window.confirm("هل أنت متأكد من إزالة هذا الموظف من القسم؟")) return;
    deleteESC.mutate(escId);
  };

  return (
    <PageContainer>
      <SectionHeader
        title="إدارة الموظفين وتوزيع الأقسام"
        description="إدارة الموظفين وتوزيعهم على الأقسام لتقديم الخدمات."
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={isLoading ? "neutral" : isError ? "danger" : "success"} className="gap-1.5 px-2.5 py-1 hidden sm:flex">
              <Circle className={`h-2 w-2 fill-current ${isLoading ? "animate-pulse" : ""}`} />
              {isLoading ? "جاري التحديث..." : isError ? "خطأ في الاتصال" : "متصل بالخادم"}
            </Badge>
          </div>
        }
      />

      <Card className="mt-6">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-jea-navy">
              <thead className="bg-jea-navy text-white text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 rounded-tr-lg">المعرف</th>
                  <th className="px-6 py-4">الدور / المنصب</th>
                  <th className="px-6 py-4">الأقسام التابعة</th>
                  <th className="px-6 py-4 w-24 text-center rounded-tl-lg">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-jea-text-muted">جاري تحميل البيانات...</td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-jea-text-muted">لا يوجد موظفين لعرضهم</td>
                  </tr>
                ) : (
                  employees.map((emp) => {
                    const empCats = getEmpCategories(emp.id);
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium">{emp.id}</td>
                        <td className="px-6 py-4">
                          <Badge variant="neutral">{emp.role}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {empCats.length > 0 ? (
                              empCats.map(cat => (
                                <Badge key={cat.esc_id} variant="info" className="text-[10px]">
                                  {cat.service_name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted">غير معين لأي قسم</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button variant="secondary" size="sm" icon={Pencil} onClick={() => handleEditClick(emp)}>
                            تعديل الأقسام
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`تعديل أقسام الموظف: ${selectedEmp?.id}`}
      >
        <div className="space-y-4">
          <div className="bg-background p-3 rounded-lg border border-border-subtle">
            <h4 className="text-xs font-semibold text-primary mb-2">الأقسام الحالية</h4>
            {selectedEmp && getEmpCategories(selectedEmp.id).length > 0 ? (
              <ul className="space-y-2">
                {getEmpCategories(selectedEmp.id).map(cat => (
                  <li key={cat.esc_id} className="flex items-center justify-between bg-white border border-border-subtle rounded px-3 py-1.5">
                    <span className="text-sm font-medium">{cat.service_name}</span>
                    <button
                      type="button"
                      className="text-error hover:bg-error/10 p-1 rounded transition-colors"
                      onClick={() => handleRemoveCategory(cat.esc_id)}
                      disabled={deleteESC.isPending}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted">لا يوجد أقسام مخصصة لهذا الموظف حالياً.</p>
            )}
          </div>

          <form onSubmit={handleAssignCategory} className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1 text-primary">تعيين لقسم جديد</label>
              <Select
                value={selectedCategoryToAdd}
                onChange={(e) => setSelectedCategoryToAdd(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c.service_id} value={c.service_id}>{c.service_name}</option>
                ))}
              </Select>
            </div>
            <Button type="submit" disabled={createESC.isPending}>
              تعيين
            </Button>
          </form>

          <div className="flex justify-end pt-4 border-t border-border-subtle">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              إغلاق
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
