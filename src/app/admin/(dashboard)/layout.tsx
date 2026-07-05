import { getAdminUser } from "@/lib/auth/server";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";

// Pages admin : toujours dynamiques (session utilisateur, données à jour),
// jamais mises en cache statiquement au build.
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
      <header className="mb-8 flex items-center justify-between border-b border-border-strong pb-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Administration HEXA</p>
          {user && <p className="text-xs text-foreground/60">{user.email}</p>}
        </div>
        <form action={signOut}>
          <Button type="submit" variant="secondary" size="sm">
            Se déconnecter
          </Button>
        </form>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
