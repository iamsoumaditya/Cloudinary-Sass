"use client";

import { Easing, motion } from "framer-motion";
import {
  ArrowDown,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Verified,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as Easing },
  viewport: { once: true },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  viewport: { once: true },
};

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<
    "grayscale" | "sepia" | "cartoon" | "oil_paint"
  >("grayscale");
  const [isCropped, setIsCropped] = useState<boolean>(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-base-100 via-base-50 to-base-100">
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden pt-20 pb-20">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url("/home_background.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-base-100/80 via-base-100/60 to-base-100/80" />

        <div className="relative container mx-auto px-4 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-base-content leading-tight text-balance">
              Transform Your Images with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                Media Refine
              </span>
            </h1>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto text-balance">
              Intelligent image processing that understands context. Crop,
              filter, blur, remove backgrounds, and convert formats—all in one
              powerful tool.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href={"/social-share/new"}>
                <motion.button
                  className="btn btn-primary btn-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Now - It's Free
                </motion.button>
              </Link>
              <Link href={"/home"}>
                <motion.button
                  className="btn btn-outline btn-lg text-base-content border border-transparent hover:border hover:border-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch Demo
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="text-primary" />
        </motion.div>
      </section>

      <section className="py-20 px-4 bg-base-50">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
              Intelligent Context-Aware Cropping
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Automatically crop to perfect aspect ratios while keeping the most
              important content centered.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <motion.div {...fadeInUp} className="space-y-4">
              <div className="badge badge-primary gap-2 mb-4">
                <Verified />
                Feature Highlight
              </div>
              <h3 className="text-3xl font-bold text-base-content">
                Wide to Square in One Click
              </h3>
              <p className="text-base-content/70">
                Upload a wide landscape photo and we automatically detect and
                center the main subject, intelligently cropping it to your
                desired aspect ratio—1:1, 4:3, 16:9, and more.
              </p>
              <div className="space-y-2">
                {[
                  "Smart Subject Detection",
                  "Multi-format Support",
                  "Batch Processing",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-base-content/70">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              {...fadeInUp}
              className="flex flex-col items-center justify-center gap-8 h-96"
            >
              <motion.div
                key={isCropped ? "cropped" : "original"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`relative rounded-2xl overflow-hidden shadow-2xl bg-base-300 h-auto sm:h-full ${
                  isCropped ? "max-w-sm" : "w-full"
                }`}
              >
                <img
                  src={isCropped ? "/crop_after.png" : "/crop_before.png"}
                  alt={isCropped ? "Cropped image" : "Original image"}
                  className="w-full h-full object-contain sm:object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                <motion.button
                  onClick={() => setIsCropped((prev) => !prev)}
                  className={`absolute ${!isCropped ? "right-2" : "left-4"} top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-xl transition-colors`}
                  aria-label="crop button"
                  animate={{ x: [0, 8, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {!isCropped ? <ChevronRight /> : <ChevronLeft />}
                </motion.button>

                <div className="absolute top-4 right-4 badge badge-primary">
                  {isCropped ? "9:16" : "16:9"}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
              Professional Filters & Effects
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Apply stunning filters with a single click. From classic black &
              white to artistic cartoon effects.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div {...fadeInUp}>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-base-content mb-6">
                  Filter Types
                </h3>
                <div className="grid gap-3">
                  {[
                    { name: "Grayscale", desc: "Timeless black and white" },
                    { name: "Cartoon", desc: "Artistic cartoon effect" },
                    { name: "Sepia", desc: "Vintage warm tones" },
                    { name: "Oil Paint", desc: "Rich textured strokes" },
                  ].map((filter) => (
                    <motion.div
                      key={filter.name}
                      className={`card bg-base-200 p-4 cursor-pointer hover:bg-base-300 transition ${filter.name.replace(" ", "_").toLowerCase() === activeFilter ? "border border-white" : ""}`}
                      whileHover={{ x: 8 }}
                      onClick={() =>
                        setActiveFilter(
                          filter.name.replace(" ", "_").toLowerCase() as
                            | "grayscale"
                            | "sepia"
                            | "cartoon"
                            | "oil_paint",
                        )
                      }
                    >
                      <h4 className="font-semibold text-base-content">
                        {filter.name}
                      </h4>
                      <p className="text-sm text-base-content/70">
                        {filter.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <figure className="diff aspect-video rounded-2xl" tabIndex={0}>
              <div className="diff-item-1" role="img" tabIndex={0}>
                <img
                  alt={`filters_${activeFilter}_after_example`}
                  src={`/filters_${activeFilter}_after.png`}
                />
              </div>
              <div className="diff-item-2" role="img">
                <img
                  alt={`filters_${activeFilter}_before_example`}
                  src="/filters_before.png"
                />
              </div>
              <div className="diff-resizer"></div>
            </figure>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-base-50">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
              Convert Any Format
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              One source image, unlimited format possibilities. Export as PNG,
              JPG, WebP and more.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { format: "PNG", desc: "Lossless & Transparent" },
              { format: "JPG", desc: "Compressed & Optimized" },
              { format: "WebP", desc: "Modern & Fast" },
              { format: "AVIF", desc: "Efficient & High-quality" },
              { format: "AUTO", desc: "Automatically Best format applied" },
            ].map((item) => (
              <motion.div
                key={item.format}
                className="card bg-base-200 p-6 text-center hover:shadow-lg transition"
                {...fadeInUp}
                whileHover={{ y: -8 }}
              >
                <h4 className="font-bold text-base-content text-lg">
                  {item.format}
                </h4>
                <p className="text-sm text-base-content/70 mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
              Privacy-First Image Processing
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Protect sensitive information by blurring faces, license plates,
              and other identifiable data automatically.
            </p>
          </motion.div>

          <motion.div {...staggerContainer} className="space-y-12">
            <motion.div
              {...fadeInUp}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <div>
                <h3 className="text-2xl font-bold text-base-content mb-4">
                  Face Blur Detection
                </h3>
                <p className="text-base-content/70 mb-4">
                  We automatically detects and blurs all faces in your image
                  with customizable blur strength. Perfect for protecting
                  privacy in group photos.
                </p>
                <div className="space-y-2">
                  {[
                    "Automatic Detection",
                    "Customizable Blur Level",
                    "Batch Processing",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />

                      <span className="text-base-content/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <figure className="diff aspect-video rounded-2xl" tabIndex={0}>
                <div className="diff-item-1" role="img" tabIndex={0}>
                  <img
                    alt="privacy_blur_after_example"
                    src="/privacy_blur_after.png"
                  />
                </div>
                <div className="diff-item-2" role="img">
                  <img
                    alt="privacy_blue_before example"
                    src="/privacy_blur_before.png"
                  />
                </div>
                <div className="diff-resizer"></div>
              </figure>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-base-50">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
              One-Click Background Removal
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Remove backgrounds instantly with precision. Perfect for product
              photos, portraits, and creative projects.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <figure className="diff aspect-video rounded-2xl" tabIndex={0}>
              <div className="diff-item-1" role="img" tabIndex={0}>
                <img
                  alt="background_removed_after_example"
                  src="/bg_removal_after.png"
                />
              </div>
              <div className="diff-item-2" role="img">
                <img
                  alt="background_removed_before_example"
                  src="/bg_removal_before.png"
                />
              </div>
              <div className="diff-resizer"></div>
            </figure>

            <motion.div {...fadeInUp} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-base-content">
                  Professional Results
                </h3>
                <p className="text-base-content/70">
                  We detect with precision, leaving you with clean,
                  professional-looking images perfect for e-commerce,
                  portfolios, and presentations.
                </p>

                <div className="space-y-3">
                  {[
                    "AI-Powered Detection",
                    "Replace with Solid Color Backgrounds",
                    "Export as PNG with Transparency",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary flex shrink-0" />
                      <span className="text-base-content/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url("/get_ready_bg.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-base-100/80 via-base-100/60 to-base-100/80" />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-base-content">
              Ready to Transform Your Images?
            </h2>
            <p className="text-lg text-base-content/70">
              Process your images in one unified system — completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={"/home"}>
                <motion.button
                  className="btn btn-primary btn-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started For Free
                </motion.button>
              </Link>
              <Link href={"/learn-more"}>
                <motion.button
                  className="btn btn-outline btn-lg text-base-content border border-transparent hover:border hover:border-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Documentation
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
