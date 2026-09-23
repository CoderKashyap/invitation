import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin login",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[linear-gradient(180deg,#fffafb,#ffe4ec)] px-5">
      <LoginForm />
    </main>
  );
}
