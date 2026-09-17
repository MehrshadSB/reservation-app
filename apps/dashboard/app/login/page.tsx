import { LoginForm } from "../../components/login-form";
import { safeReturnTo } from "../../lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const params = await searchParams;
  return (
    <main>
      <h1>Sign in</h1>
      <LoginForm returnTo={safeReturnTo(params.returnTo)} />
    </main>
  );
}
