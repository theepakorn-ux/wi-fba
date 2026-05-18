import Link from "next/link";
import { SignInButton } from "@/components/sign-in-button";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-md border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">WI-FBA</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">เข้าสู่ระบบ</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          ระบบนี้สงวนสิทธิ์สำหรับบุคลากรมหาวิทยาลัยที่ใช้บัญชี Google ภายใต้โดเมน
          rmutsv.ac.th เท่านั้น
        </p>
        <div className="mt-6">
          <SignInButton />
        </div>
        <Link
          href="/privacy"
          className="mt-5 inline-block text-sm text-slate-600 underline underline-offset-4"
        >
          ประกาศความเป็นส่วนตัว
        </Link>
      </section>
    </main>
  );
}
