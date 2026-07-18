import { Users, Circle, Mail, Edit, Trash2 } from "lucide-react";
import { PageContainer, SectionHeader } from "@/components/layout";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useUsers } from "../hooks/use-users";

export function UsersPage() {
  const { data: apiResponse, isLoading, isError } = useUsers();
  const users = apiResponse?.data || [];
  const total = apiResponse?.total || users.length;

  return (
    <PageContainer>
      <SectionHeader
        title="إدارة المستخدمين"
        description="استعرض قائمة المستخدمين، وأرسل رسائل جماعية، وقم بإدارة الحسابات والصلاحيات بسهولة."
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={isLoading ? "neutral" : isError ? "danger" : "success"} className="gap-1.5 px-2.5 py-1 hidden sm:flex">
              <Circle className={`h-2 w-2 fill-current ${isLoading ? "animate-pulse" : ""}`} />
              {isLoading ? "جاري التحديث..." : isError ? "خطأ في الاتصال" : "متصل بالخادم"}
            </Badge>
            <Button variant="primary" className="gap-2">
              <Mail className="h-4 w-4" />
              إرسال رسالة جماعية
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
                  <th scope="col" className="px-6 py-4 rounded-tr-lg">رقم المستخدم</th>
                  <th scope="col" className="px-6 py-4">الاسم</th>
                  <th scope="col" className="px-6 py-4">نوع الحساب</th>
                  <th scope="col" className="px-6 py-4">الحالة</th>
                  <th scope="col" className="px-6 py-4 text-center rounded-tl-lg">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-jea-text-muted">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Circle className="h-6 w-6 animate-pulse text-jea-cyan" />
                        <span>جاري تحميل بيانات المستخدمين...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-jea-text-muted">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Users className="h-10 w-10 text-gray-300" />
                        <span className="text-base font-medium">لا يوجد مستخدمين لعرضهم</span>
                        <span className="text-xs">لم يتم العثور على أية سجلات في النظام.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id || user.user_id || Math.random().toString()} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-jea-navy whitespace-nowrap">
                        {user.user_id || user.id || "-"}
                      </td>
                      <td className="px-6 py-4 font-medium text-jea-navy whitespace-nowrap">
                        {user.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={user.user_type === "ADMIN" ? "primary" : "neutral"}>
                          {user.user_type || "USER"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={user.status === "ACTIVE" ? "success" : user.status === "INACTIVE" ? "neutral" : "warning"}>
                          {user.status === "ACTIVE" ? "نشط" : user.status === "INACTIVE" ? "غير نشط" : user.status || "مجهول"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-jea-cyan hover:text-jea-navy transition-colors p-1" title="تعديل">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-600 transition-colors p-1" title="حذف">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {!isLoading && users.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-jea-text-muted bg-slate-50 rounded-b-lg">
              <span>عرض {users.length} من أصل {total} مستخدم</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">السابق</Button>
                <Button variant="outline" size="sm" className="h-8">التالي</Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </PageContainer>
  );
}
