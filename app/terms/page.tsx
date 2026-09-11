import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Girapp",
  description:
    "Terms of Service for Girapp — the giraffe finder app powered by iNaturalist data.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-gray-800 px-4 py-10 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-4xl mb-2">🦒</div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Girapp — Terms of Service
          </h1>
          <p className="text-sm text-gray-400 mt-1">Effective: September 2026</p>
        </div>

        <div className="flex flex-col gap-4">

          {/* 01 Acceptance */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                01 · Acceptance of Terms
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
              By using Girapp (&quot;the App&quot;), you agree to these Terms of Service
              and our{" "}
              <Link href="/privacy" className="text-amber-600 underline hover:text-amber-800">
                Privacy Policy
              </Link>
              . If you do not agree, please stop using the App.
              Girapp is operated by <strong>The Tighlman Group LLC</strong>.
            </div>
          </section>

          {/* 02 Service Description */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                02 · What Girapp Does
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
              Girapp is a fun, free tool that uses your device&apos;s GPS to find and
              display the nearest giraffe sightings from{" "}
              <a
                href="https://www.inaturalist.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 underline hover:text-amber-800"
              >
                iNaturalist
              </a>
              , a publicly available wildlife observation database. It is
              provided for entertainment and educational purposes only.
            </div>
          </section>

          {/* 03 Data Accuracy — prominent */}
          <section className="bg-white rounded-2xl border-2 border-amber-400 overflow-hidden shadow-sm">
            <div className="bg-amber-400 px-5 py-2.5">
              <h2 className="text-xs font-semibold text-amber-900 uppercase tracking-widest">
                03 · ⚠️ Data Accuracy Disclaimer
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-700 leading-relaxed space-y-2">
              <p className="font-semibold text-gray-900">
                Giraffe locations shown in Girapp are NOT real-time and may be
                outdated, inaccurate, or no longer valid.
              </p>
              <p>
                Sighting data is sourced from iNaturalist and reflects past
                observations reported by community members. Giraffes are wild
                animals — they move. A sighting could be weeks, months, or
                years old.
              </p>
              <p className="font-semibold text-gray-900">
                Do NOT use Girapp to navigate to or approach wild animals.
              </p>
              <p>
                The operator is not responsible for any inaccuracies in
                third-party data. iNaturalist data is provided &quot;as is&quot; without
                any warranty of accuracy or timeliness.
              </p>
            </div>
          </section>

          {/* 04 Location Data */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                04 · Location Data & Privacy
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                Girapp requests your device&apos;s GPS location solely to calculate
                distances to nearby giraffe sightings. Precise coordinates are
                processed in your browser and are <strong>not stored on our
                servers</strong>. A search area derived from your location is sent
                to the iNaturalist API so the App can show public observations.
              </p>
              <p>
                Device compass / orientation data stays on your device. Details
                are in our{" "}
                <Link href="/privacy" className="text-amber-600 underline hover:text-amber-800">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 05 User Responsibilities */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                05 · User Responsibilities
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
              You agree to use Girapp for lawful purposes only. Do not attempt
              to abuse, reverse-engineer, or disrupt the App or any
              third-party APIs it relies on. Respect wildlife — do not use
              sighting data to harass or endanger animals.
            </div>
          </section>

          {/* 06 Limitation of Liability */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                06 · Limitation of Liability
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
              The App is provided &quot;AS IS&quot; without warranties of any kind. To the
              fullest extent permitted by law, the operator shall not be liable
              for any damages, losses, or injuries arising from your use of
              the App — including reliance on giraffe location data, navigation
              decisions, or encounters with wildlife.
            </div>
          </section>

          {/* 07 Third-Party Services */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                07 · Third-Party Services
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
              Girapp is hosted by Vercel and uses the{" "}
              <a
                href="https://www.inaturalist.org/pages/api+reference"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 underline hover:text-amber-800"
              >
                iNaturalist API
              </a>{" "}
              to retrieve wildlife observation data. We do not operate our own
              sightings database. iNaturalist is a separate service with its own{" "}
              <a
                href="https://www.inaturalist.org/pages/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 underline hover:text-amber-800"
              >
                Terms of Service
              </a>
              . We are not affiliated with or endorsed by iNaturalist or the
              California Academy of Sciences.
            </div>
          </section>

          {/* 08 Governing Law */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                08 · Governing Law
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
              These Terms are governed by the laws of the State of Arizona,
              USA, without regard to conflict of law provisions. Any disputes
              shall be resolved in Maricopa County, Arizona.
            </div>
          </section>

          {/* 09 Changes */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                09 · Changes to These Terms
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
              We may update these Terms from time to time. Continued use of
              Girapp after changes are posted constitutes acceptance of the
              updated Terms.
            </div>
          </section>

          {/* 10 Contact */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                10 · Contact
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
              Girapp is operated by <strong>The Tighlman Group LLC</strong>,
              3522 S Juniper St, Tempe, AZ 85282. Questions about these Terms
              or our{" "}
              <Link href="/privacy" className="text-amber-600 underline hover:text-amber-800">
                Privacy Policy
              </Link>
              ? Email{" "}
              <a
                href="mailto:contact@tighlmangroup.com"
                className="text-amber-600 underline hover:text-amber-800"
              >
                contact@tighlmangroup.com
              </a>
              {" "}or{" "}
              <a
                href="mailto:zachary.williams@tighlmangroup.com"
                className="text-amber-600 underline hover:text-amber-800"
              >
                zachary.williams@tighlmangroup.com
              </a>
              .
            </div>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-8 flex justify-center gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            ← Back to App
          </Link>
          <Link href="/privacy" className="hover:text-amber-600 transition-colors">
            Privacy Policy
          </Link>
        </div>

        <p className="text-center text-xs text-gray-300 mt-6 pb-4">
          Girapp · Find the nearest giraffes 🦒
        </p>

      </div>
    </main>
  );
}
