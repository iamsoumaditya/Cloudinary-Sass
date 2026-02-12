import React from "react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex justify-center px-4 py-12 max-w-screen">
      <div className="w-full max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl text-base-content font-bold mb-6 text-center">
            About Us
          </h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            We are building an intelligent, unified media platform designed to
            simplify video and image processing using AI-powered automation and
            professional-grade editing tools — all in one workspace.
          </p>
        </div>

        <div className="space-y-8">
          <div
            id="smart-ai-video-processing"
            className="card bg-base-200 shadow-xl"
          >
            <div className="card-body space-y-4 text-lg">
              <h2 className="card-title text-2xl md:text-3xl">
                Smart AI Video Processing
              </h2>

              <p>
                When a user uploads a video on the home page, a dedicated video
                card is automatically generated with the video's thumbnail for
                quick identification.
              </p>

              <p>
                On hovering over the video card, an{" "}
                <span className="font-semibold">AI-powered preview</span> is
                displayed. Instead of showing random frames, our system analyzes
                the video and highlights the most important and engaging segment
                — enabling users to instantly understand the core content
                without playing the full video.
              </p>

              <p className="opacity-80">
                This intelligent preview system enhances content discovery,
                saves time, and improves media browsing efficiency.
              </p>
            </div>
          </div>

          <div
            id="social-media-ready-images"
            className="card bg-base-200 shadow-xl"
          >
            <div className="card-body space-y-4 text-lg">
              <h2 className="card-title text-2xl md:text-3xl">
                Social Media Ready Images
              </h2>

              <p>
                Our platform provides a dedicated social sharing workflow where
                users can upload an image and instantly prepare it for multiple
                social media platforms.
              </p>

              <p>
                Once uploaded, the image becomes available in various
                pre-optimized social media formats such as post sizes, story
                ratios, banners, and thumbnails — all generated automatically.
              </p>

              <p>
                Users can preview each format and download the images directly
                from the same page, making social publishing faster and
                platform-ready without manual resizing.
              </p>
            </div>
          </div>

          <div
            id="powerful-editing-studio"
            className="card bg-base-200 shadow-xl"
          >
            <div className="card-body space-y-4 text-lg">
              <h2 className="card-title text-2xl md:text-3xl">
                Powerful Editing Studio
              </h2>

              <p>
                All uploaded images are accessible from the home page. Through
                the <span className="font-semibold">More</span> option on each
                image card, users can open any image directly inside our
                advanced editing studio.
              </p>

              <p>The studio includes a wide range of professional tools:</p>

              <ul className="list-disc ml-6 space-y-1">
                <li>Resize & crop</li>
                <li>Quality adjustment</li>
                <li>Format conversion</li>
                <li>Background removal</li>
                <li>Watermark application</li>
                <li>Filters & visual effects</li>
                <li>Brightness / contrast / saturation controls</li>
                <li>Blur & pixelation tools</li>
                <li>Privacy face blur</li>
                <li>Custom borders & styling</li>
              </ul>

              <p className="opacity-80">
                This integrated studio eliminates the need for third-party
                editors by providing everything in one seamless interface.
              </p>
            </div>
          </div>

          <div
            id="unified-media-workspace"
            className="card bg-base-200 shadow-xl"
          >
            <div className="card-body space-y-4 text-lg">
              <h2 className="card-title text-2xl md:text-3xl">
                Unified Media Workspace
              </h2>

              <p>
                Our platform unifies video and image workflows into a single,
                connected media environment.
              </p>

              <p>
                Users can upload, manage, preview, edit, optimize, and download
                their media from one centralized dashboard without switching
                tools or platforms.
              </p>

              <p>
                Videos benefit from AI previews and intelligent processing,
                while images flow through social formatting and advanced editing
                pipelines — creating a smooth, end-to-end media lifecycle.
              </p>

              <p className="opacity-80">
                This unified approach improves productivity, reduces workflow
                friction, and provides a complete media management experience in
                one place.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-md opacity-70 mt-6">
          Built with ❤️ to simplify AI-powered media creation and management.
        </div>
      </div>
    </div>
  );
}
