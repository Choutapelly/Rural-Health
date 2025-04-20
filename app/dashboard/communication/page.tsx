import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { CommunicationDashboard } from "@/components/communication-dashboard"

export default function CommunicationPage() {
  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <CommunicationDashboard />
      </DashboardShell>
    </>
  )
}
