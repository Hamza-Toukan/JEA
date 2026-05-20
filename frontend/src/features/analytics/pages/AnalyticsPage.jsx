import { Download, Calendar } from "lucide-react";
import { PageContainer, SectionHeader } from "@/components/layout";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MessageSquare, Clock, ThumbsUp, Users } from "lucide-react";

const CHANNELS = [
  { label: "واتساب", value: 78 },
  { label: "بوابة الويب", value: 12 },
  { label: "أخرى", value: 10 },
];

export function AnalyticsPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="التحليلات والتقارير"
        description="مؤشرات الأداء التشغيلي وجودة تجربة الأعضاء."
        actions={
          <>
            <Select className="w-36">
              <option>آخر 7 أيام</option>
              <option>آخر 30 يوم</option>
              <option>هذا الربع</option>
            </Select>
            <Button variant="secondary" icon={Calendar} size="sm">
              نطاق مخصص
            </Button>
            <Button variant="secondary" icon={Download} size="sm">
              تصدير
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="إجمالي المحادثات"
          value="8,420"
          change="+8.2% عن الفترة السابقة"
          changeType="up"
          icon={MessageSquare}
        />
        <StatCard
          label="متوسط زمن الرد"
          value="1.4 د"
          change="-12% تحسن"
          changeType="up"
          icon={Clock}
        />
        <StatCard
          label="رضا الأعضاء"
          value="4.6/5"
          change="استبيان 340 رد"
          changeType="neutral"
          icon={ThumbsUp}
        />
        <StatCard
          label="أعضاء فريدون"
          value="2,156"
          change="+156 جديد"
          changeType="up"
          icon={Users}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="اتجاه حجم المحادثات" description="يومي — آخر 14 يوم" />
          <CardBody>
            <div className="jea-gradient-accent flex h-52 items-end gap-1 rounded-lg border border-jea-border-soft p-4">
              {Array.from({ length: 14 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-jea-navy/70"
                  style={{ height: `${40 + Math.sin(i) * 30 + i * 3}%` }}
                />
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="توزيع القنوات" />
          <CardBody className="space-y-4">
            {CHANNELS.map((ch) => (
              <div key={ch.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-jea-text-muted">{ch.label}</span>
                  <span className="font-medium text-jea-navy">{ch.value}%</span>
                </div>
                <ProgressBar value={ch.value} />
              </div>
            ))}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="أداء المسارات" />
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-jea-border-soft text-xs text-jea-text-muted">
                    <th className="py-2 text-start font-medium">المسار</th>
                    <th className="py-2 text-start font-medium">المحادثات</th>
                    <th className="py-2 text-start font-medium">الحل الآلي</th>
                    <th className="py-2 text-start font-medium">التصعيد</th>
                    <th className="py-2 text-start font-medium">متوسط الثقة</th>
                  </tr>
                </thead>
                <tbody className="text-jea-navy">
                  {[
                    ["تجديد العضوية", "2,104", "72%", "28%", "89%"],
                    ["التأمين الصحي", "1,856", "81%", "19%", "91%"],
                    ["الشهادات", "1,420", "85%", "15%", "93%"],
                    ["الدعم الفني", "980", "45%", "55%", "76%"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-jea-border-soft">
                      <td className="py-3 font-medium">{row[0]}</td>
                      <td className="py-3 text-jea-text-muted">{row[1]}</td>
                      <td className="py-3">{row[2]}</td>
                      <td className="py-3">{row[3]}</td>
                      <td className="py-3">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
