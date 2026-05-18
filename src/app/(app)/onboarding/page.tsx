import { AppShell } from "@/components/app-shell";

export default function OnboardingPage() {
  return (
    <AppShell>
      <section className="max-w-2xl rounded-md border bg-white p-5">
        <h1 className="text-xl font-semibold">เลือกหน่วยงานสังกัด</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          ผู้ใช้บัญชี rmutsv.ac.th จะได้รับบทบาทเริ่มต้นเป็นเจ้าหน้าที่
          และเลือกหน่วยงานสังกัดได้ด้วยตนเอง
        </p>
      </section>
    </AppShell>
  );
}
