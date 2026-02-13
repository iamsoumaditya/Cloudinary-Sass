"use client";
import MobileNavbar from "@/components/MobileNavbar";
import { generateCertificate } from "@/utils/generateCertificate";
import { SignedIn, useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const modules = [
  "Resize",
  "Quality",
  "Format",
  "Filters",
  "Blur",
  "Border",
  "Text",
];

export default function LearnMoreDocs() {
  const {user,isLoaded,isSignedIn}=useUser()
  const [activeModule, setActiveModule] = useState<number>();
  const [completed, setCompleted] = useState<Array<number>>([]);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("studio_course_progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const index = modules.findIndex(
        (item) => item.toLowerCase() === hash.toLowerCase(),
      );
      console.log(index);
      setActiveModule(index + 1);
    } else {
      const saved = localStorage.getItem("active_module");
      if (saved) setActiveModule(JSON.parse(saved));
      else setActiveModule(1);
    }
  }, []);

  useEffect(() => {
    if (!activeModule) return;
    localStorage.setItem("active_module", JSON.stringify(activeModule));
  }, [activeModule]);

  if (!activeModule) return;

  const markComplete = () => {
    const updated = [...new Set([...completed, activeModule])];
    setCompleted(updated);
    localStorage.setItem("studio_course_progress", JSON.stringify(updated));
    if (activeModule != modules.length) {
      setActiveModule((prev) => prev! + 1);
    }
    if (updated.length === modules.length) {
      setShowQuiz(true);
    }
  };

  const handleCertificateDownload = async () => {
    setIsDownloading(true)
    try {
      if (!isSignedIn) {
        throw new Error("Sign in to get certificate");
      }
      if (!isLoaded) {
        throw new Error("Unable to get user data");
      }
      await generateCertificate(user?.fullName??user.username??"A User",user?.primaryEmailAddress?.emailAddress, user?.id.replace("user_", ""));
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setShowQuiz(false);
      setIsDownloading(false)
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col lg:flex-row max-w-screen">
      <aside className="w-80 bg-base-200 border-r border-base-300 p-6 hidden lg:block">
        <h2 className="text-xl font-bold mb-4">Studio Documentation</h2>

        <ul className="space-y-2">
          {modules.map((module) => {
            const index = modules.indexOf(module) + 1;
            const isActive = activeModule === index;

            return (
              <li key={module}>
                <button
                  onClick={() => setActiveModule(index)}
                  className={`w-full px-4 py-3 btn
                  ${
                    isActive
                      ? "btn-dash shadow-lg"
                      : "btn-ghost hover:bg-base-300"
                  }`}
                >
                  Module {index}
                  {completed.includes(index) && (
                    <span className="badge badge-success badge-sm ml-2">✓</span>
                  )}
                </button>
              </li>
            );
          })}

          {completed.length === modules.length && (
            <button
              className=" btn btn-primary w-full"
              onClick={handleCertificateDownload}
              disabled={isDownloading}
            >
              Claim Certificate
            </button>
          )}
        </ul>

        <div className="mt-8">
          <p className="text-sm opacity-70 mt-2">Progress</p>
          <progress
            className="progress progress-primary w-full"
            value={completed.length}
            max={modules.length}
          ></progress>
          <p className="text-sm opacity-70 mt-2">
            {completed.length} / {modules.length} Completed
          </p>
        </div>
      </aside>
      <MobileNavbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        completed={completed}
      />
      <main className="flex-1 p-6 lg:p-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Module {activeModule} - {modules[activeModule - 1]}
        </h1>

        {activeModule - 1 === 0 && (
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              The Resize module allows you to precisely control the dimensions,
              framing, and composition of your image. This is one of the most
              powerful tools because resizing is not just about shrinking or
              enlarging — it's about intelligently adapting media for different
              platforms and use-cases.
            </p>

            <h2 className="text-2xl font-semibold">Width & Height</h2>
            <p>
              You can manually define output dimensions in pixels. Increasing
              size may stretch images, while decreasing compresses visual data.
              Always maintain aspect ratio when possible to avoid distortion.
            </p>

            <h2 className="text-2xl font-semibold">Aspect Ratio</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <b>Free</b> — No ratio lock. Independent width & height.
              </li>
              <li>
                <b>1:1</b> — Perfect square (Instagram posts, thumbnails) From
                this you can only set width and height automatically calculated.
              </li>
              <li>
                <b>16:9</b> — Landscape (YouTube, presentations).
              </li>
              <li>
                <b>9:16</b> — Vertical video (Reels, Shorts).
              </li>
              <li>
                <b>4:5</b> — Portrait social posts.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold">Crop Modes</h2>
            <p>
              Crop mode defines how an image fits inside the target dimension.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <b>Auto</b> — Automatically the best will be applied according
                to the requirements.
              </li>
              <li>
                <b>Fill</b> — Crops excess areas to fully fill frame.
              </li>
              <li>
                <b>Fit</b> — Entire image visible, may add empty space.
              </li>
              <li>
                <b>Scale</b> — Simple proportional resize.
              </li>
              <li>
                <b>Thumb</b> — Smart thumbnail crop.
              </li>
              <li>
                <b>Limit</b> — Only resizes if image exceeds size.
              </li>
              <li>
                <b>Pad</b> — Adds padding background.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold">Gravity</h2>
            <p>Gravity controls which area stays in focus during cropping.</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Auto — AI decides focal point.</li>
              <li>Center — Middle focus.</li>
              <li>Top / Bottom — Vertical priority.</li>
              <li>Left / Right — Horizontal priority.</li>
            </ul>
          </div>
        )}

        {activeModule - 1 === 1 && (
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              Quality controls compression level. Higher quality preserves
              detail but increases file size.
            </p>

            <h2 className="text-2xl font-semibold">Quality Slider</h2>
            <p>
              Range: 1-100. Lower values reduce storage and loading time. Higher
              values maintain sharpness and texture.
            </p>

            <h2 className="text-2xl font-semibold">Presets</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Auto — Intelligent optimization.</li>
              <li>High — Maximum clarity 95%.</li>
              <li>Medium — Balanced compression 70%.</li>
              <li>Low — Maximum size reduction 40%.</li>
            </ul>
          </div>
        )}

        {activeModule - 1 === 2 && (
          <div className="space-y-6 text-lg leading-relaxed">
            <p>Format defines the output file type.</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <b>Auto</b> — Best format selected automatically.
              </li>
              <li>
                <b>JPG</b> — Smaller size, lossy compression.
              </li>
              <li>
                <b>PNG</b> — Lossless, supports transparency.
              </li>
              <li>
                <b>WEBP</b> — Modern web optimized format.
              </li>
              <li>
                <b>AVIF</b> — Next-gen ultra compression.
              </li>
            </ul>
          </div>
        )}

        {activeModule - 1 === 3 && (
          <div className="space-y-6 text-lg leading-relaxed">
            <p>Filters apply artistic and tonal transformations.</p>

            <ul className="list-disc ml-6 space-y-2">
              <li>Grayscale — Removes color.</li>
              <li>Sepia — Vintage brown tone.</li>
              <li>Cartoonify — Stylized illustration effect.</li>
              <li>Oil Paint — Brush stroke texture.</li>
            </ul>

            <h2 className="text-2xl font-semibold">Adjustments</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Brightness (-100 → +100) default to 0</li>
              <li>Contrast (-100 → +100) default to 0</li>
              <li>Saturation (-100 → +100) default to 0</li>
            </ul>

            <div className="alert alert-warning">
              While adjusting this brightness contrast and saturation we just
              trying to guess the situation after applying this and based on
              that a Preview is shown. Real output may vary. So to see the final
              chnages click on apply changes. While previewing a warning Preview
              button appears at the bottom right of the image container in
              studio.
            </div>
          </div>
        )}

        {activeModule - 1 === 4 && (
          <div className="space-y-6 text-lg leading-relaxed">
            <p>Blur helps hide details or create depth focus.</p>
            <p>
              Pixelation helps hide details in this pixel size is increased.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Blur Range: 0-2000</li>
              <li>Pixelation: 0-300</li>
            </ul>
            <p>
              Pixelation converts areas into visible square blocks — commonly
              used for privacy masking.
            </p>
            <p>
              To blur a picture we give two option full image blur and another
              privacy blur only blur the faces detected in the images.
            </p>
          </div>
        )}

        {activeModule - 1 === 5 && (
          <div className="space-y-6 text-lg leading-relaxed">
            <p>Modify or enhance the image background.</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Remove background automatically.</li>
              <li>Add solid color background.</li>
              <li>Apply borders with width & color.</li>
            </ul>
            <p>
              To set a border at first select the border width with the slider varying between 0 to 30 px. Then from the color picker choose a border color and done click appply changes and the border applied.
            </p>
            <p>
              To remove background check the input box and apply changes and background removed. To apply and colour as background first remove the background as discussed earlier then another checkbox appear apply background click that and then a color picker appear and choose the colour you want to be in the background.
            </p>
          </div>
        )}

        {activeModule - 1 === 6 && (
          <div className="space-y-6 text-lg leading-relaxed">
            <p>Add watermark text for branding & copyright etc.</p>

            <p>To add a watermark follow the steps mentioned below</p>

            <ul className="list-disc ml-6 space-y-2">
              <li>Type watermark Text content</li>
              <li>Now choose Fonts: Arial, Helvetica, Verdana, Impact, Georgia, Courier New, Times New Roman</li>
              <li>Choose Font size from slider 12px to 72 px</li>
              <li>From Text color picker pick the colour of text you want to use as watermark</li>
              <li>Select the Position presets where to place the watermark Text Top-Left,Top-Right,Center,Bottom-left,Bottom-Right</li>
              <li>With Offset sliders you can slide text according to height and width if you need</li>
              <li>Via the Opacity control you can control the opacity of watermark text</li>
            </ul>
          </div>
        )}

        {!completed.includes(activeModule) && (
          <div className="mt-4">
            <button className="btn btn-primary" onClick={markComplete}>
              Mark This Module as Completed
            </button>
          </div>
        )}
      </main>

      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-10 rounded-2xl shadow-2xl max-w-lg text-center space-y-4">
            <h2 className="text-2xl font-bold">🎉 Course Completed</h2>
            <p>
              Congratulations! You've completed the full Media Refine Studio
              Mastery Course.
            </p>
            <p>
              You are now certified in using the Powerful Editing Studio by
              Media Refine.
            </p>
            <button
              className="btn btn-success"
              onClick={handleCertificateDownload}
            >
              Claim Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
