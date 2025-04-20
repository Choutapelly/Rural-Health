import { DoctorSymptomDashboard } from "@/components/doctor-symptom-dashboard"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function DoctorSymptomDashboardPage() {
  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <DoctorSymptomDashboard />
      </DashboardShell>
    </>
  )
}
