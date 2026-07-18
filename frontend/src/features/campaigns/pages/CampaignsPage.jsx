import { Megaphone, Circle, Plus } from "lucide-react";
import { PageContainer, SectionHeader } from "@/components/layout";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCampaigns } from "../hooks/use-campaigns";

export function CampaignsPage() {
  const { data: apiResponse, isLoading, isError } = useCampaigns();
  const campaigns = apiResponse?.data || [];

  return (
    <PageContainer>
      <SectionHeader
        title="إدارة الحملات"
        description="إدارة حملات التوعية والرسائل الجماعية."
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={isLoading ? "neutral" : isError ? "danger" : "success"} className="gap-1.5 px-2.5 py-1 hidden sm:flex">
              <Circle className={`h-2 w-2 fill-current ${isLoading ? "animate-pulse" : ""}`} />
              {isLoading ? "جاري التحديث..." : isError ? "خطأ في الاتصال" : "متصل بالخادم"}
            </Badge>
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" />
              حملة جديدة
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
                  <th className="px-6 py-4">اسم الحملة</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4">تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-jea-text-muted">جاري تحميل الحملات...</td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-jea-text-muted">لا يوجد حملات لعرضها</td>
                  </tr>
                ) : (
                  campaigns.map((camp) => (
                    <tr key={camp.id || Math.random().toString()} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{camp.id || "-"}</td>
                      <td className="px-6 py-4">{camp.name || "-"}</td>
                      <td className="px-6 py-4">
                        <Badge variant={camp.status === "ACTIVE" ? "success" : "neutral"}>
                          {camp.status || "DRAFT"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">{camp.createdAt ? new Date(camp.createdAt).toLocaleDateString("ar-JO") : "-"}</td>
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
