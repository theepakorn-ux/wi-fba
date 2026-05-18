import { AppShell } from "@/components/app-shell";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-md border bg-white p-4">
          <p className="text-sm text-slate-500">ข้อเสนอทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </section>
        <section className="rounded-md border bg-white p-4">
          <p className="text-sm text-slate-500">รอตรวจสอบ</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </section>
        <section className="rounded-md border bg-white p-4">
          <p className="text-sm text-slate-500">อนุมัติแล้ว</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </section>
      </div>
    </AppShell>
  );
}
