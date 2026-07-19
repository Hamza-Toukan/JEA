import { Star, Circle, Filter } from "lucide-react";
import { PageContainer, SectionHeader } from "@/components/layout";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useRatings } from "../hooks/use-ratings";

export function RatingsPage() {
  const { data: apiResponse, isLoading, isError } = useRatings();
  const ratings = apiResponse?.data || [];
  const total = apiResponse?.total || ratings.length;

  return (
    <PageContainer>
      <SectionHeader
        title="إدارة التقييمات"
        description="استعرض تقييمات العملاء لجودة الخدمات والموظفين."
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={isLoading ? "neutral" : isError ? "danger" : "success"} className="gap-1.5 px-2.5 py-1 hidden sm:flex">
              <Circle className={`h-2 w-2 fill-current ${isLoading ? "animate-pulse" : ""}`} />
              {isLoading ? "جاري التحديث..." : isError ? "خطأ في الاتصال" : "متصل بالخادم"}
            </Badge>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              تصفية
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
                  <th className="px-6 py-4">التقييم</th>
                  <th className="px-6 py-4">ملاحظات</th>
                  <th className="px-6 py-4">تاريخ التقييم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-jea-text-muted">جاري تحميل التقييمات...</td>
                  </tr>
                ) : ratings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-jea-text-muted">لا يوجد تقييمات لعرضها</td>
                  </tr>
                ) : (
                  ratings.map((rating) => (
                    <tr key={rating.rate_id || Math.random().toString()} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{rating.rate_id || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < (rating.rate_value || 0) ? "fill-current" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">{rating.comments || "-"}</td>
                      <td className="px-6 py-4">{rating.created_at || rating.createdAt ? new Date(rating.created_at || rating.createdAt).toLocaleDateString("ar-JO") : "-"}</td>
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
