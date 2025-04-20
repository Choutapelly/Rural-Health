import { SymptomVisualizationDashboard } from "@/components/symptom-visualization-dashboard"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function SymptomVisualizationPage() {
  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <SymptomVisualizationDashboard />
      </DashboardShell>
    </>
  )
}
