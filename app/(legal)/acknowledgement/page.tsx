import Link from "next/link";
import React from "react";

export default function AcknowledgmentPage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content container mx-auto p-4 max-w-screen">
      <h1 className="text-3xl text-base-content font-bold mb-6 text-center">
        Acknowledgement & Content Credits
      </h1>
      <p className=" text-center opacity-80 text-lg mx-auto mb-6">
        This page acknowledges the sources of default media content used across
        our platform and clarifies their ownership, licensing, and distribution
        policies.
      </p>
      <div className="flex w-full flex-col lg:flex-row">
        <div className="flex-1">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body space-y-4">
              <h2 className="card-title text-2xl">Default Videos</h2>

              <p className="text-lg">
                All <span className="font-bold">default videos</span> shown on
                this platform are sourced from{" "}
                <Link
                  href={"https://pixabay.com/"}
                  target="_blank"
                  className="font-bold link link-hover"
                >
                  Pixabay
                </Link>
              </p>

              <div className="pt-2 text-lg">
                <h3 className="font-semibold mb-2">Default Video Sources:</h3>
                <ul className="list-disc ml-6 space-y-1 break-all">
                  <li className="link link-hover">
                    <Link
                      href={
                        "https://pixabay.com/videos/deer-nature-fur-animal-eyes-312758/"
                      }
                      target="_blank"
                    >
                      {" "}
                      Deer Portrait in Nature
                    </Link>
                  </li>
                  <li className="link link-hover">
                    <Link
                      href={
                        "https://pixabay.com/videos/sun-heaven-clouds-evening-sky-318540/"
                      }
                      target="_blank"
                    >
                      {" "}
                      Evening Sky Clouds
                    </Link>
                  </li>
                  <li className="link link-hover">
                    <Link
                      href={
                        "https://pixabay.com/videos/lynx-animal-fur-nature-ears-317469/"
                      }
                      target="_blank"
                    >
                      {" "}
                      Wild Lynx Close-Up
                    </Link>
                  </li>
                  <li className="link link-hover">
                    <Link
                      href={
                        "https://pixabay.com/videos/seagulls-birds-water-sea-animals-307777/"
                      }
                      target="_blank"
                    >
                      {" "}
                      Seagulls Over Ocean
                    </Link>
                  </li>
                  <li className="link link-hover">
                    <Link
                      href={
                        "https://pixabay.com/videos/frog-nature-stones-animal-pond-294348/"
                      }
                      target="_blank"
                    >
                      {" "}
                      Pond Frog on Stones
                    </Link>
                  </li>
                  <li className="link link-hover">
                    <Link
                      href={
                        "https://pixabay.com/videos/nature-macro-spring-insect-blossom-277670/"
                      }
                      target="_blank"
                    >
                      {" "}
                      Spring Insect Macro
                    </Link>
                  </li>
                  <li className="link link-hover">
                    <Link
                      href={
                        "https://pixabay.com/videos/frog-reeds-green-113403/"
                      }
                      target="_blank"
                    >
                      {" "}
                      Frog in Green Reeds
                    </Link>
                  </li>
                </ul>
                <p className="mt-6">
                  All videos titles are generated from{" "}
                  <Link
                    href={"https://chatgpt.com/"}
                    target="_blank"
                    className="link link-hover"
                  >
                    chatGPT.
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="divider lg:divider-horizontal"></div>
        <div className="flex-1">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body space-y-4">
              <h2 className="card-title text-2xl">Default Images</h2>

              <p className="text-lg">
                All <span className="font-bold">default images</span> displayed
                to users on this platform were generously
                <span className="font-bold">
                  {" "}
                  donated by our early users and contributors
                </span>{" "}
                during the initial phase of our product development.
              </p>
              <div className="pt-2 text-lg">
                <h3 className="font-semibold mb-2 text-lg">
                  These contributors have voluntarily:
                </h3>

                <ul className="list-disc ml-6 space-y-1">
                  <li>
                    Waived all ownership and distribution rights for these
                    images.
                  </li>
                  <li>
                    Granted us full permission to maintain and manage the
                    content.
                  </li>
                  <li>
                    Allowed the images to be served as platform default images.
                  </li>
                </ul>

                <p className="mt-4">
                  These images are now maintained by us and are served to users
                  as <span className="font-bold">default content </span>
                  so that new users can explore platform features such as
                  editing, transformations, compression, optimization, and media
                  management workflows.
                </p>

                <p className="opacity-80 mt-4">
                  Their purpose is purely to enhance onboarding and product
                  exploration experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="divider divider-horizontal"></div>
      <div className="flex w-full flex-col lg:flex-row">
        <div className="flex-1">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body space-y-4 text-lg">
              <h2 className="card-title text-2xl">
                Usage & Distribution Notice
              </h2>

              <p>
                To fully comply with{" "}
                <Link
                  href={"https://pixabay.com/service/license-summary/"}
                  target="_blank"
                  className="font-bold link link-hover"
                >
                  Pixabay Content License
                </Link>
              </p>

              <ul className="list-disc ml-6 space-y-1">
                <li>
                  These videos are displayed strictly as{" "}
                  <span className="font-bold">default content.</span>
                </li>
                <li>They are used only to showcase platform capabilities.</li>
                <li>
                  <span className="font-bold">Downloading is disabled</span> for
                  all Pixabay-sourced default videos.
                </li>
                <li>
                  Users cannot redistribute or extract these videos from our
                  platform.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="divider lg:divider-horizontal"></div>
        <div className="flex-1">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body space-y-2 text-lg">
              <h2 className="card-title text-2xl">Content Removal Requests</h2>
              <p>
                If Pixabay, the original creator, or any rightful owner of the
                default videos or images wishes to request removal of their
                content, they may contact us directly.
              </p>
              <p>
                Contact Email:{" "}
                <Link
                  href="mailto:mediarefine.company@gmail.com"
                  className="link link-hover link-primary ml-1"
                >
                  mediarefine.company@gmail.com
                </Link>
              </p>
              <p>Upon receiving a valid request, we will:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Review the claim promptly.</li>
                <li>Verify ownership or rights.</li>
                <li>Remove the concerned content as soon as possible.</li>
                <li>
                  Ensure compliance with all licensing and ownership policies.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center opacity-70 text-lg m-6 bg-text-content">
        We sincerely thank our early contributors and Pixabay for enabling us to
        build rich media experiences responsibly for our users.
      </div>
    </div>
  );
}
