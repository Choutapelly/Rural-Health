import { redirect } from 'next/navigation'

// Redirect from /dashboard/doctor to the main symptom dashboard
export default function DoctorDashboardPage() {
  redirect('/dashboard/doctor/symptom-dashboard')
}
