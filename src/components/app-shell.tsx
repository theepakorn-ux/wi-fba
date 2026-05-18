import Link from "next/link";
import { ClipboardList, LayoutDashboard, Settings, Users } from "lucide-react";

const navigation = [
  { href: "/dashboard", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/proposals", label: "ข้อเสนอ", icon: ClipboardList },
  { href: "/admin/users", label: "ผู้ใช้", icon: Users },
  { href: "/admin/settings", label: "ตั้งค่า", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link href="/dashboard" className="text-lg font-semibold">
            WI-FBA
          </Link>
          <nav className="flex gap-2 overflow-x-auto" aria-label="เมนูหลัก">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</main>
    </div>
  );
}
