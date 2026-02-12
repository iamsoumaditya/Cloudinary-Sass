import React from "react";
import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Terms of Use</h1>
          <p className="opacity-80 text-lg">
            By accessing or using our platform, you agree to be bound by these
            Terms of Use. Please read them carefully.
          </p>
          <p className="text-sm opacity-60">Last Updated: 11 February 2026</p>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body space-y-6 text-lg leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-semibold text-xl">1. Acceptance of Terms</h2>
              <p>
                By creating an account or using our services, you confirm that
                you meet the minimum legal age requirement and agree to comply
                with all applicable laws and regulations.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">
                2. Description of Service
              </h2>
              <p>Our platform provides tools and services including:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Media uploads images, videos</li>
                <li>Transformations and optimization</li>
                <li>Format conversion and compression</li>
                <li>Cloud storage and delivery</li>
                <li>Default media for exploration</li>
              </ul>
              <p>
                Services may evolve, improve, or change over time without prior
                notice.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">3. User Accounts</h2>
              <p>When you create an account, you agree to:</p>

              <ul className="list-disc ml-6 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your credentials</li>
                <li>Be responsible for all activity under your account</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts involved
                in misuse or violations.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">
                4. User Content & Ownership
              </h2>
              <p>
                You retain ownership of the content you upload. By uploading,
                you grant us a limited license to store, process, and deliver
                the content solely to provide platform features.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">
                5. Content Removal & Data Deletion
              </h2>
              <p>
                Users retain full control over the media content they upload to
                the platform.
              </p>
              <p>
                If a user deletes their uploaded content or deletes their
                account, the associated media files are permanently deleted from
                our storage systems.
              </p>
              <p>
                By default, all user-uploaded media is permanently deleted
                within a 7-day retention period.
              </p>
              <p>
                Users may choose to shorten this deletion timeframe based on
                their preference.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">
                6. Default & Demo Content
              </h2>
              <p>
                Default images may be contributed by users, and default videos
                may be sourced from platforms such as{" "}
                <Link
                  href={"https://pixabay.com"}
                  className="link link-hover font-medium"
                >
                  Pixabay
                </Link>
                . This content is used strictly for demonstration and may have
                download or redistribution restrictions.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">7. Prohibited Uses</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>Uploading unauthorized or illegal content</li>
                <li>Distributing malware or harmful code</li>
                <li>Attempting unauthorized system access</li>
                <li>Abusing storage or processing resources</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">8. Service Availability</h2>
              <p>
                We strive for reliability but do not guarantee uninterrupted
                service. We are not liable for outages, delays, or data loss.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">9. Data & Security</h2>
              <p>
                We implement industry-standard safeguards including encryption,
                secure storage, and access controls. However, no system is
                completely secure.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">10. Third-Party Services</h2>
              <p>
                Our platform may rely on third-party providers such as cloud
                storage, authentication, and analytics services.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">11. Termination</h2>
              <p>
                We may suspend or terminate access if these terms are violated
                or if platform misuse is detected.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">
                12. Limitation of Liability
              </h2>
              <p>
                The platform is provided "as is" without warranties. We are not
                liable for indirect damages, data loss, or service
                interruptions.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">13. Changes to Terms</h2>
              <p>
                We may update these Terms periodically. Continued use of the
                platform constitutes acceptance of updated terms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-semibold text-xl">14. Contact</h2>
              <p>
                For questions regarding these Terms, contact us at:{" "}
                <Link
                  href="mailto:support@yourdomain.com"
                  className="link link-hover font-medium"
                >
                  support@yourdomain.com
                </Link>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
