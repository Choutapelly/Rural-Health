import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Globe, Video, FileText, Shield } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold">RuralHealth Connect</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Connecting Rural Communities with Global Healthcare
                </h1>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  RuralHealth Connect bridges the gap between volunteer doctors worldwide and patients in underserved
                  rural areas, providing free medical consultations and care.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register?role=doctor">
                    <Button className="w-full min-[400px]:w-auto">Volunteer as a Doctor</Button>
                  </Link>
                  <Link href="/register?role=patient">
                    <Button variant="outline" className="w-full min-[400px]:w-auto">
                      Register as a Patient
                    </Button>
                  </Link>
                </div>
              </div>
              <Image
                src="/rural-telehealth-connection.png"
                alt="Rural healthcare telemedicine"
                width={500}
                height={500}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers a comprehensive suite of tools to connect doctors and patients across the globe.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="grid gap-2 text-center">
                <Globe className="h-10 w-10 mx-auto text-rose-500" />
                <h3 className="text-xl font-bold">Global Doctor Network</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with volunteer doctors from around the world, specializing in various medical fields.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <Video className="h-10 w-10 mx-auto text-rose-500" />
                <h3 className="text-xl font-bold">Video Consultations</h3>
                <p className="text-sm text-muted-foreground">
                  Secure, high-quality video calls for remote medical consultations, accessible on any device.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <FileText className="h-10 w-10 mx-auto text-rose-500" />
                <h3 className="text-xl font-bold">Digital Prescriptions</h3>
                <p className="text-sm text-muted-foreground">
                  Receive digital prescriptions and medical advice securely through our platform.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <Shield className="h-10 w-10 mx-auto text-rose-500" />
                <h3 className="text-xl font-bold">AI-Powered Triage</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI system assesses patient needs and prioritizes urgent cases for faster care.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <Heart className="h-10 w-10 mx-auto text-rose-500" />
                <h3 className="text-xl font-bold">Patient Records</h3>
                <p className="text-sm text-muted-foreground">
                  Secure storage of medical history and consultation records for continuity of care.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <ArrowRight className="h-10 w-10 mx-auto text-rose-500" />
                <h3 className="text-xl font-bold">Follow-up Care</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule follow-up appointments and track recovery progress over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our simple process connects patients with doctors in just a few steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3">
              <div className="grid gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  1
                </div>
                <h3 className="text-xl font-bold">Register</h3>
                <p className="text-muted-foreground">
                  Create an account as a patient or volunteer doctor with your credentials and relevant information.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  2
                </div>
                <h3 className="text-xl font-bold">Connect</h3>
                <p className="text-muted-foreground">
                  Patients submit health concerns, and our system matches them with appropriate doctors.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  3
                </div>
                <h3 className="text-xl font-bold">Consult</h3>
                <p className="text-muted-foreground">
                  Conduct video consultations, receive diagnoses, prescriptions, and follow-up care as needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Testimonials</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from doctors and patients who have used our platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <div className="rounded-lg border bg-background p-6">
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground italic">
                    "As a doctor in London, I can now help patients in remote villages across the world. The platform is
                    intuitive and the video quality is excellent for consultations."
                  </p>
                  <p className="font-semibold">Dr. Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Cardiologist, UK</p>
                </div>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground italic">
                    "Our village is 100 miles from the nearest hospital. This platform has been life-changing for our
                    community, providing access to specialists we could never reach before."
                  </p>
                  <p className="font-semibold">Maria Gonzalez</p>
                  <p className="text-sm text-muted-foreground">Patient, Rural Mexico</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join Our Mission</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Help us bridge the healthcare gap for rural communities worldwide.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register?role=doctor">
                  <Button size="lg" className="w-full min-[400px]:w-auto">
                    Volunteer as a Doctor
                  </Button>
                </Link>
                <Link href="/register?role=patient">
                  <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                    Register as a Patient
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-bold">RuralHealth Connect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting rural communities with global healthcare professionals.
            </p>
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-sm font-medium">Platform</div>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="#features" className="hover:underline">
                Features
              </Link>
              <Link href="#how-it-works" className="hover:underline">
                How It Works
              </Link>
              <Link href="#testimonials" className="hover:underline">
                Testimonials
              </Link>
            </nav>
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-sm font-medium">Legal</div>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
              <Link href="/data-protection" className="hover:underline">
                Data Protection
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} RuralHealth Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
