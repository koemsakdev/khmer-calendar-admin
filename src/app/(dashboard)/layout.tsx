import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar - Component provided in previous step */}
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}