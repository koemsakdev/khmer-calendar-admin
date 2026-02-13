import { getDashboardStats } from "@/features/dashboard/server/get-dashboard-stats";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return <DashboardView stats={stats} />;
}