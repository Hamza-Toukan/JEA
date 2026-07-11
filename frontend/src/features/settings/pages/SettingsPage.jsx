import { useState } from "react";
import { Bell, Shield, Users, CheckCircle2 } from "lucide-react";
import { PageContainer, SectionHeader } from "@/components/layout";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

const SECTIONS = [
  {
    id: "team",
    icon: Users,
    title: "الفريق والصلاحيات",
    description: "أدوار المشرفين والموظفين والوصول",
  },
  {
    id: "security",
    icon: Shield,
    title: "الأمان",
    description: "المصادقة وسياسات الجلسة والوصول",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "التنبيهات",
    description: "تنبيهات التصعيد والأخطاء الفورية",
  },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("team");
  const [showToast, setShowToast] = useState(false);

  // Team State
  const [team, setTeam] = useState([
    { id: 1, name: "م. أحمد خليل", email: "a.khalil@jea.org.jo", role: "مدير النظام" },
    { id: 2, name: "م. أسماء العتيبي", email: "a.otaibi@jea.org.jo", role: "مشرف عمليات" },
    { id: 3, name: "م. جهاد حمدان", email: "j.hamdan@jea.org.jo", role: "وكيل دعم" },
  ]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("وكيل دعم");

  // Security State
  const [sessionTimeout, setSessionTimeout] = useState("4");
  const [require2fa, setRequire2fa] = useState(true);
  const [strongPassword, setStrongPassword] = useState(true);

  // Notifications State
  const [escalationAlerts, setEscalationAlerts] = useState(true);
  const [dailyReports, setDailyReports] = useState(false);
  const [systemAlerts, setSystemAlerts] = useState(true);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;
    const newMember = {
      id: Date.now(),
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
    };
    setTeam([...team, newMember]);
    setNewMemberName("");
    setNewMemberEmail("");
  };

  const handleRemoveMember = (id) => {
    setTeam(team.filter((member) => member.id !== id));
  };

  return (
    <PageContainer>
      <SectionHeader
        title="الإعدادات"
        description="تكوين المنصة والتكاملات وسياسات التشغيل."
        actions={
          <div className="flex items-center gap-3">
            {showToast && (
              <div className="flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success border border-success/20 animate-fade-in">
                <CheckCircle2 className="h-4 w-4" />
                تم حفظ التغييرات بنجاح!
              </div>
            )}
            <Button onClick={handleSave}>حفظ التغييرات</Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 mt-4">
        {/* Left Settings Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader title="أقسام الإعدادات" />
          <CardBody className="space-y-1.5 p-2">
            {SECTIONS.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-start transition-colors ${
                    isActive
                      ? "bg-accent-muted text-primary border-s-2 border-s-primary"
                      : "text-muted hover:bg-background hover:text-primary"
                  }`}
                >
                  <s.icon className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">{s.title}</p>
                    <p className="text-[10px] text-muted mt-0.5">{s.description}</p>
                  </div>
                </button>
              );
            })}
          </CardBody>
        </Card>

        {/* Active Settings Panel */}
        <div className="space-y-6 lg:col-span-2">


          {activeSection === "team" && (
            <Card>
              <CardHeader title="إدارة أعضاء الفريق والصلاحيات" />
              <CardBody className="space-y-4 p-4">
                <div className="space-y-2">
                  {team.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-border-subtle bg-background/30">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent-muted flex items-center justify-center text-xs font-bold text-primary">
                          {member.name.charAt(2) || member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-primary">{member.name}</p>
                          <p className="text-[10px] text-muted">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.role === "مدير النظام" ? "success" : "neutral"}>
                          {member.role}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)} className="text-error hover:text-error/80 text-[10px] py-1 px-2 h-auto">
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border-subtle pt-4 space-y-3">
                  <p className="text-xs font-semibold text-primary">إضافة عضو جديد للفريق</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Input
                      placeholder="الاسم كامل"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="text-xs h-9"
                    />
                    <Input
                      placeholder="البريد الإلكتروني"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="text-xs h-9"
                    />
                    <div className="flex gap-2">
                      <Select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        className="text-xs flex-1 h-9"
                      >
                        <option value="وكيل دعم">وكيل دعم</option>
                        <option value="مشرف عمليات">مشرف عمليات</option>
                        <option value="مدير النظام">مدير النظام</option>
                      </Select>
                      <Button onClick={handleAddMember} className="h-9">إضافة</Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {activeSection === "security" && (
            <Card>
              <CardHeader title="سياسات الأمان والمصادقة" />
              <CardBody className="space-y-4 p-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-primary font-medium">مدة انتهاء صلاحية الجلسة</label>
                  <Select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="text-xs w-full h-9"
                  >
                    <option value="1">ساعة واحدة</option>
                    <option value="4">4 ساعات</option>
                    <option value="24">24 ساعة</option>
                    <option value="168">أسبوع واحد</option>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border-subtle p-3 bg-background/30">
                  <div>
                    <p className="text-xs font-semibold text-primary">فرض المصادقة الثنائية (2FA)</p>
                    <p className="text-[10px] text-muted">يتطلب من جميع مدراء النظام والمشرفين استخدام الـ 2FA عند تسجيل الدخول.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={require2fa}
                    onChange={(e) => setRequire2fa(e.target.checked)}
                    className="h-4 w-4 rounded border-border-subtle text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border-subtle p-3 bg-background/30">
                  <div>
                    <p className="text-xs font-semibold text-primary">سياسة كلمات المرور القوية</p>
                    <p className="text-[10px] text-muted">إجبار المستخدمين على تغيير كلمة المرور كل 90 يوماً واستخدام رموز خاصة.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={strongPassword}
                    onChange={(e) => setStrongPassword(e.target.checked)}
                    className="h-4 w-4 rounded border-border-subtle text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </CardBody>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card>
              <CardHeader title="إعدادات وقنوات التنبيهات الفورية" />
              <CardBody className="space-y-4 p-4">
                <div className="flex items-center justify-between rounded-lg border border-border-subtle p-3 bg-background/30">
                  <div>
                    <p className="text-xs font-semibold text-primary">تنبيهات التصعيد للواتساب</p>
                    <p className="text-[10px] text-muted">إرسال إشعار فوري لهواتف فريق المتابعة عند حدوث تصعيد ذكي من البوت.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={escalationAlerts}
                    onChange={(e) => setEscalationAlerts(e.target.checked)}
                    className="h-4 w-4 rounded border-border-subtle text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border-subtle p-3 bg-background/30">
                  <div>
                    <p className="text-xs font-semibold text-primary">تقارير الأداء اليومية عبر البريد الإلكتروني</p>
                    <p className="text-[10px] text-muted">إرسال تقرير إحصائي مفصل للمدراء يومياً عند الساعة 8 صباحاً.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyReports}
                    onChange={(e) => setDailyReports(e.target.checked)}
                    className="h-4 w-4 rounded border-border-subtle text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border-subtle p-3 bg-background/30">
                  <div>
                    <p className="text-xs font-semibold text-primary">تنبيهات انقطاع النظام والخدمات</p>
                    <p className="text-[10px] text-muted">تنبيه فوري لمدراء النظام في حال توقف بوابات الدفع أو خدمة Twilio.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemAlerts}
                    onChange={(e) => setSystemAlerts(e.target.checked)}
                    className="h-4 w-4 rounded border-border-subtle text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
