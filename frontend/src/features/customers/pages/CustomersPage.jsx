import { UserCheck, Circle, Plus } from "lucide-react";
import { PageContainer, SectionHeader } from "@/components/layout";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCustomers } from "../hooks/use-customers";

export function CustomersPage() {
  const { data: apiResponse, isLoading, isError } = useCustomers();
  const customers = apiResponse?.data || [];

  return (
    <PageContainer>
      <SectionHeader
        title="إدارة العملاء"
        description="استعرض بيانات العملاء ومستويات تفاعلهم."
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={isLoading ? "neutral" : isError ? "danger" : "success"} className="gap-1.5 px-2.5 py-1 hidden sm:flex">
              <Circle className={`h-2 w-2 fill-current ${isLoading ? "animate-pulse" : ""}`} />
              {isLoading ? "جاري التحديث..." : isError ? "خطأ في الاتصال" : "متصل بالخادم"}
            </Badge>
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة عميل
            </Button>
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
                  <th className="px-6 py-4">الاسم</th>
                  <th className="px-6 py-4">الهاتف</th>
                  <th className="px-6 py-4">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-jea-text-muted">جاري تحميل العملاء...</td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-jea-text-muted">لا يوجد عملاء لعرضهم</td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id || Math.random().toString()} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{customer.id || "-"}</td>
                      <td className="px-6 py-4">{customer.name || "-"}</td>
                      <td className="px-6 py-4">{customer.phone || "-"}</td>
                      <td className="px-6 py-4">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("ar-JO") : "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
