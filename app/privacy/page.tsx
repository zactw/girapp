import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Girapp",
  description:
    "Privacy Policy for Girapp — how The Tighlman Group LLC handles location, compass, and iNaturalist data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-gray-800 px-4 py-10 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-4xl mb-2">🦒</div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Girapp — Privacy Policy
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Effective / last updated: September 2026
          </p>
        </div>

        <div className="flex flex-col gap-4">

          {/* 01 Who we are */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                01 · Who Operates Girapp
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                Girapp (&quot;the App,&quot; &quot;the Service,&quot; or &quot;the System&quot;) is operated by{" "}
                <strong>The Tighlman Group LLC</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;TG LLC&quot;).
              </p>
              <p>
                3522 S Juniper St<br />
                Tempe, AZ 85282
              </p>
              <p>
                Questions:{" "}
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
              </p>
              <p>
                This policy is for people who use Girapp. It is not legal advice.
                Using the App means you understand how we handle information as
                described here. Related terms are in our{" "}
                <Link href="/terms" className="text-amber-600 underline hover:text-amber-800">
                  Terms of Service
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 02 What we collect */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                02 · What Information We Handle
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                Girapp is a giraffe-finder. It does not create user accounts and
                does not run its own sightings database. We handle only what is
                needed to show nearby giraffe observations and keep the App
                running.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Device geolocation (GPS), used in your browser</li>
                <li>Device orientation / compass heading, used in your browser</li>
                <li>Display preferences saved on your device (units, result count)</li>
                <li>Standard technical logs created by our host when you load the site</li>
              </ul>
            </div>
          </section>

          {/* 03 Geolocation — prominent */}
          <section className="bg-white rounded-2xl border-2 border-amber-400 overflow-hidden shadow-sm">
            <div className="bg-amber-400 px-5 py-2.5">
              <h2 className="text-xs font-semibold text-amber-900 uppercase tracking-widest">
                03 · 📍 Geolocation
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-700 leading-relaxed space-y-2">
              <p>
                Girapp asks for your device&apos;s GPS so it can measure distance
                and direction to giraffe sightings near you.
              </p>
              <p>
                Your precise coordinates are processed in your browser. We do
                not write your GPS location to a Girapp database, and we do not
                keep a history of where you have been.
              </p>
              <p>
                To fetch nearby observations, the App sends a geographic search
                area derived from your location to the iNaturalist API. That is
                how the App finds giraffes without storing your position on our
                servers. iNaturalist is a third-party service with its own{" "}
                <a
                  href="https://www.inaturalist.org/pages/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 underline hover:text-amber-800"
                >
                  privacy policy
                </a>
                .
              </p>
              <p>
                You can deny location permission. Without it, Girapp cannot
                calculate distances from where you are.
              </p>
            </div>
          </section>

          {/* 04 Compass */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                04 · Device Orientation / Compass
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                The compass view uses your device&apos;s orientation sensors
                (including compass heading, where the browser and OS allow it)
                so giraffe waypoints rotate as you turn.
              </p>
              <p>
                Heading data stays on your device. We do not store it, send it
                to our servers, or share it with iNaturalist or anyone else.
              </p>
              <p>
                On some devices (especially iOS), the browser asks you to allow
                motion / orientation access first. You can decline and still
                use the map view.
              </p>
            </div>
          </section>

          {/* 05 iNaturalist */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                05 · iNaturalist Is the Data Source
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                Giraffe pins, photos, dates, place names, and observer credits
                come from the public{" "}
                <a
                  href="https://www.inaturalist.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 underline hover:text-amber-800"
                >
                  iNaturalist
                </a>{" "}
                API. We do not operate our own wildlife-sightings database.
              </p>
              <p>
                Those observations were reported by the iNaturalist community.
                We display them; we do not claim they are ours, real-time, or
                complete. If you open an observation on iNaturalist, that site
                handles that visit under its own terms and privacy policy.
              </p>
            </div>
          </section>

          {/* 06 What is and isn't stored */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                06 · What Is and Isn&apos;t Stored
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                <strong>On your device only:</strong> display settings such as
                distance units and how many giraffes to show (browser
                localStorage). Compass heading is used live and is not saved.
              </p>
              <p>
                <strong>Not stored by Girapp:</strong> your name, email, account,
                precise GPS history, compass logs, or a private copy of
                iNaturalist sightings.
              </p>
              <p>
                <strong>Hosting logs:</strong> when you load the site, our host
                may record ordinary request metadata (for example IP address,
                user agent, and timestamps) to operate and secure the Service.
                We do not use that to build a marketing profile of you.
              </p>
            </div>
          </section>

          {/* 07 How we use */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                07 · How We Use Information
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed space-y-2">
              <p>We use information to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Show nearby giraffe observations and distances</li>
                <li>Point the compass (or map) in the right direction</li>
                <li>Remember your on-device display preferences</li>
                <li>Host, maintain, update, secure, troubleshoot, and support the App</li>
              </ul>
              <p>
                The Tighlman Group LLC and its authorized personnel may access
                System data and the application as needed to host, maintain,
                update, secure, troubleshoot, and support the System for users
                of the Service. This access continues for as long as we provide
                hosting or support.
              </p>
            </div>
          </section>

          {/* 08 How we share */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                08 · How We Share — We Do Not Sell Personal Data
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                <strong>We do not sell personal data.</strong> We do not share
                information for cross-context behavioral advertising.
              </p>
              <p>
                We share information only as needed to run the Service:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>iNaturalist</strong> — receives a search area so the
                  App can request public giraffe observations
                </li>
                <li>
                  <strong>Vercel</strong> — hosts the App and may process
                  standard request logs
                </li>
                <li>
                  If the law requires it, or to protect users, wildlife, or the
                  Service
                </li>
              </ul>
              <p>
                The Tighlman Group LLC and its authorized personnel may access
                System data and the application as needed to host, maintain,
                update, secure, troubleshoot, and support the System for users
                of the Service. This access continues for as long as we provide
                hosting or support.
              </p>
            </div>
          </section>

          {/* 09 Processors */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                09 · Processors &amp; Third Parties
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed space-y-2">
              <p>These parties help the App work:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Vercel</strong> — hosting and delivery of the website
                </li>
                <li>
                  <strong>iNaturalist</strong> — third-party API and public
                  wildlife observation source (not operated by us)
                </li>
              </ul>
              <p>
                If you open the map view, map tiles may be requested from
                OpenStreetMap so the map can draw. That is display only; it is
                not a Girapp sightings database.
              </p>
            </div>
          </section>

          {/* 10 Children */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                10 · Children Under 13
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
              Girapp is not directed to children under 13, and we do not
              knowingly collect personal information from children under 13. If
              you believe a child under 13 has provided personal information
              through the App, contact us and we will delete it.
            </div>
          </section>

          {/* 11 Rights / contact */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                11 · Your Rights &amp; How to Contact Us
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                Depending on where you live, you may have rights to ask what
                information we have, request deletion, or ask questions about
                this policy. Because Girapp does not keep user accounts or a
                location history, there is often little personal data for us to
                retrieve beyond ordinary hosting logs.
              </p>
              <p>
                Email{" "}
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
                . You can also write to The Tighlman Group LLC, 3522 S Juniper
                St, Tempe, AZ 85282.
              </p>
            </div>
          </section>

          {/* 12 Changes */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                12 · Changes to This Policy
              </h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. The effective
              date at the top will change when we do. Continued use of Girapp
              after an update means you accept the revised policy.
            </div>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-8 flex justify-center gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            ← Back to App
          </Link>
          <Link href="/terms" className="hover:text-amber-600 transition-colors">
            Terms of Service
          </Link>
        </div>

        <p className="text-center text-xs text-gray-300 mt-6 pb-4">
          Girapp · Find the nearest giraffes 🦒
        </p>

      </div>
    </main>
  );
}
