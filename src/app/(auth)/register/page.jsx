import RegisterForm from "@/components/(auth)/Registerform";
import Link from "next/link";
import { FiMapPin, FiCamera, FiBell, FiShield } from "react-icons/fi";

export const metadata = {
  title: "Create account | CivicPulse",
  description:
    "Register as a citizen on CivicPulse to report public infrastructure issues and track their resolution.",
};

const benefits = [
  {
    icon: FiCamera,
    title: "Report in seconds",
    text: "Add a photo and pin the exact GPS location.",
  },
  {
    icon: FiBell,
    title: "Stay informed",
    text: "Get updates as your issue moves from review to resolved.",
  },
  {
    icon: FiShield,
    title: "Transparent process",
    text: "Every status change is recorded and visible to you.",
  },
];

export default function RegisterPage() {
  return (
    <main className="grid min-h-dvh bg-slate-50 dark:bg-slate-950 lg:grid-cols-2">
      {/* Brand panel (server rendered) */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl"
          aria-hidden
        />

        <Link href="/" className="relative flex items-center gap-2 text-2xl font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <FiMapPin className="h-5 w-5" />
          </span>
          CivicPulse
        </Link>

        <div className="relative max-w-md space-y-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Help build a better city, one report at a time.
            </h1>
            <p className="mt-4 text-indigo-100">
              Report potholes, broken streetlights, drainage and waste problems
              straight to the right department and follow every step until it is
              fixed.
            </p>
          </div>

          <ul className="space-y-5">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-indigo-100">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-indigo-200">
          © {new Date().getFullYear()} CivicPulse. Smart city infrastructure management.
        </p>
      </aside>

      {/* Form panel */}
      <section className="flex min-w-0 items-center justify-center px-3 py-6 sm:px-8 sm:py-10">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold text-indigo-700 dark:text-indigo-400 lg:hidden"
          >
            <FiMapPin className="h-6 w-6" />
            CivicPulse
          </Link>

          {/* Client component */}
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
