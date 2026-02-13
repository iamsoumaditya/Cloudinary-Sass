import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex justify-center">
      <div className="w-full max-w-3xl px-4 py-8 space-y-2">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

        <p className="opacity-80 text-center mx-auto text-lg mb-12">
          Your privacy is important to us. This Privacy Policy explains how we
          collect, use, store, and protect your information when you use our
          platform.
        </p>

        <div className="card bg-base-200 shadow-xl w-full">
          <div className="card-body space-y-6 text-lg">
            <h2 className="card-title text-2xl">1. Information We Collect</h2>

            <p>We may collect the following types of information:</p>

            <ul className="list-disc ml-6 space-y-2">
              <li>Account information name, email, profile details.</li>
              <li>Uploaded media content images, videos.</li>
              <li>Usage data feature interactions, storage usage.</li>
              <li>Device and browser information in specific cases.</li>
              <li>IP address and basic analytics data.</li>
            </ul>

            <h2 className="card-title text-2xl">
              2. How We Use Your Information
            </h2>

            <p>Your information is used to:</p>

            <ul className="list-disc ml-6 space-y-2">
              <li>Provide and maintain our services.</li>
              <li>Enable media uploads, transformations, and downloads.</li>
              <li>Improve platform performance and features.</li>
              <li>Ensure security and prevent abuse.</li>
              <li>Communicate important updates or support responses.</li>
            </ul>
            <h2 className="card-title text-2xl">
              3. Media Content & Ownership
            </h2>

            <p>
              Users retain ownership of the content they upload. We do not claim
              ownership of your private media.
            </p>

            <p>
              Uploaded content is stored and processed only to provide platform
              features such as optimization, compression, format conversion, and
              delivery.
            </p>

            <p>
              Default demo media provided on the platform are managed separately
              and do not represent user ownership.
            </p>
            <h2 className="card-title text-2xl">4. Data Storage & Security</h2>

            <p>
              We implement various security measures to protect your data,
              including:
            </p>

            <ul className="list-disc ml-6 space-y-2">
              <li>Secure cloud storage infrastructure.</li>
              <li>Encrypted API communications.</li>
              <li>Access control and authentication safeguards.</li>
            </ul>
            <h2 className="card-title text-2xl">
              5. Data Sharing & Third Parties
            </h2>

            <p>
              We do not sell, trade, or rent your personal data to third
              parties.
            </p>

            <p>
              Data may be processed by trusted infrastructure providers strictly
              for service functionality cloud storage, authentication,
              analytics, under confidentiality and security obligations.
            </p>
            <h2 className="card-title text-2xl">6. Cookies & Tracking</h2>

            <p>We may use cookies and similar technologies to:</p>

            <ul className="list-disc ml-6 space-y-2">
              <li>Maintain user sessions.</li>
              <li>Remember preferences.</li>
              <li>Analyze usage for improvements.</li>
            </ul>

            <p>
              You can control cookie behavior through your browser settings.
            </p>
            <h2 className="card-title text-2xl">7. User Rights</h2>

            <p>You have the right to:</p>

            <ul className="list-disc ml-6 space-y-2">
              <li>Access your stored data, delete stored data.</li>
              <li>Delete your account and content.</li>
              <li>Withdraw platform access at any time.</li>
            </ul>
            <h2 className="card-title text-2xl">8. Policy Updates</h2>

            <p>
              We may update this Privacy Policy from time to time to reflect
              platform, legal, or operational changes. Updates will be posted on
              this page with revised effective dates.
            </p>
            <h2 className="card-title text-2xl">9. Contact Us</h2>

            <p>
              For privacy-related questions, data requests, or concerns, you may
              contact us directly via email:{" "}
              <Link
                href="mailto:mediarefine.company@gmail.com"
                className="link link-hover"
              >
                mediarefine.company@gmail.com
              </Link>
            </p>
          </div>
          <div className="text-center text-lg opacity-70">
            Last updated: 11-02-26
          </div>
        </div>
      </div>
    </div>
  );
}
