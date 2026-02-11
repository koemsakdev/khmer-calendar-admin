import { auth } from "@/lib/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="text-sm text-slate-500">
        Dashboard / <span className="text-slate-900 font-medium">Overview</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">{session?.user?.name}</span>
        <div className="h-8 w-8 rounded-full bg-slate-200" />
      </div>
    </header>
  );
}