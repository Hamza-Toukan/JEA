import { PageContainer, SectionHeader } from '@/components/layout';
import { Card, CardBody } from '@/components/ui/Card';
import { useEmployeeServiceCategories } from '../hooks/use-esc';

export function EmployeeServiceCategoriesPage() {
  const { data, isLoading } = useEmployeeServiceCategories();
  const items = data?.data || [];

  return (
    <PageContainer>
      <SectionHeader
        title="توزيع الموظفين"
        description="ربط الموظفين بالأقسام لتقديم الخدمة"
      />
      <Card className="mt-6">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-background-subtle text-muted text-xs">
                  <th className="px-4 py-3 font-semibold">المعرف</th>
                  <th className="px-4 py-3 font-semibold">البيانات</th>
                  <th className="px-4 py-3 font-semibold">تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {isLoading ? (
                  <tr><td colSpan="3" className="p-8 text-center">جاري التحميل...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan="3" className="p-8 text-center text-muted">لا توجد بيانات للعرض</td></tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-background-subtle/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted">{item.id}</td>
                      <td className="px-4 py-3">
                        <pre className="text-[10px] text-muted overflow-hidden text-ellipsis max-w-xs">{JSON.stringify(item)}</pre>
                      </td>
                      <td className="px-4 py-3 text-xs ltr text-start">
                        {new Date(item.created_at || item.createdAt).toLocaleDateString('ar-JO')}
                      </td>
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
