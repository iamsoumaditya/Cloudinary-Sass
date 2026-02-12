"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, HelpCircle, RotateCcw } from "lucide-react";
import TabContent from "@/components/TabsContent";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { getCldImageUrl } from "next-cloudinary";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";

const tabs = [
  { id: "resize", label: "Resize" },
  { id: "quality", label: "Quality" },
  { id: "format", label: "Format" },
  { id: "filters", label: "Filters" },
  { id: "blur", label: "Blur" },
  { id: "border", label: "Background" },
  { id: "text", label: "Text" },
];

const positionMap: Record<string, string> = {
  "top-left": "north_west",
  "top-right": "north_east",
  center: "center",
  "bottom-left": "south_west",
  "bottom-right": "south_east",
};

export default function ImageEditingStudio() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  // Image state
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Tab state
  const [activeTab, setActiveTab] = useState("resize");
  const [mobileTabOpen, setMobileTabOpen] = useState<boolean>(false);

  // Resize & Crop
  const [width, setWidth] = useState<string>("800");
  const [height, setHeight] = useState<string>("600");
  const [aspectRatio, setAspectRatio] = useState<string>("free");
  const [cropMode, setCropMode] = useState<
    "fit" | "fill" | "scale" | "thumb" | "limit" | "pad"|"auto"
  >("auto");
  const [gravity, setGravity] = useState<string>("auto");
  const [makeCircular, setMakeCircular] = useState<boolean>(false);

  // Quality
  const [quality, setQuality] = useState<number>(0);

  // Format
  const [format, setFormat] = useState<string>("auto");

  // Filters
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [sepia, setSepia] = useState<boolean>(false);
  const [cartoonify, setCartoonify] = useState<boolean>(false);
  const [oilPaint, setOilPaint] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);

  // Blur & Pixelate
  const [blur, setBlur] = useState<number>(0);
  const [pixelate, setPixelate] = useState<number>(0);
  const [applyFullImage, setApplyFullImage] = useState<boolean>(true);
  const [applyFaces, setApplyFaces] = useState<boolean>(false);
  const [x, setX] = useState<number>(50);
  const [y, setY] = useState<number>(50);

  // Border & Background
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState<string>("#000000");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [removeBg, setRemoveBg] = useState(false);
  const [applyBg, setApplyBg] = useState(false);

  // Text & Watermark
  const [watermarkText, setWatermarkText] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(24);
  const [textColor, setTextColor] = useState<string>("#000000");
  const [textPosition, setTextPosition] = useState<string>("bottom-right");
  const [textOpacity, setTextOpacity] = useState<number>(100);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [font, setFont] = useState<string>("Arial");

  const imageRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [help, setHelp] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const userId = user?.id;
  const tPoint = Number(user?.publicMetadata.tPoint);
  const maxTPoint = Number(user?.publicMetadata.maxTPoint);

  useEffect(() => {
      setHelp(true)
      const timer = setTimeout(() => {
        setHelp(false);
      }, 60_000); // 1 minute in ms

      // cleanup if component unmounts
      return () => clearTimeout(timer);
    }, [activeTab]);

  useEffect(() => {
    setFormat(localStorage.getItem("format") ?? "auto");
    async function fetchImage() {
      if (!q) {
        router.back();
        return;
      }
      setIsLoading(true);
      try {
        const url = getCldImageUrl({
          src: atob(q),
          width: width,
          height: height,
          format: "auto",
          quality: "auto",
          crop: "auto",
          gravity: "auto",
        });
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
        setImageUrl(url);
      } catch (error) {
        router.back();
      } finally {
        setIsLoading(false);
        setIsPreview(false);
      }
    }
    fetchImage();
  }, [q]);

  useEffect(() => {
    if (isPreview) return;
    setIsPreview(true);
  }, [
    brightness,
    contrast,
    saturation,
    blur,
    borderWidth,
    watermarkText,
    font,
    textPosition,
    textOpacity,
    textColor,
    fontSize,
    offset,
  ]);

  const handleReset = () => {
    setWidth("800");
    setHeight("600");
    setAspectRatio("free");
    setCropMode("fit");
    setGravity("auto");
    setQuality(80);
    setGrayscale(false);
    setSepia(false);
    setCartoonify(false);
    setOilPaint(false);
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setBlur(0);
    setPixelate(0);
    setApplyFullImage(true);
    setApplyFaces(false);
    setIsPreview(false);
    setBorderWidth(0);
    setBorderColor("#000000");
    setBackgroundColor("#ffffff");
    setMakeCircular(false);
    setRemoveBg(false);
    setApplyBg(false);
    setWatermarkText("");
    setFontSize(24);
    setTextColor("#000000");
    setTextPosition("bottom-right");
    setTextOpacity(100);
    setX(50);
    setY(50);
    setOffset({ x: 0, y: 0 });
    setFont("Arial");
  };

  const handleDownload = async () => {
    if (!imageRef.current) return;
    setIsDownloading(true);
    const res = await fetch(imageRef.current.src);
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Media-Refine-${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setIsDownloading(false);
  };
  const handleApplyChanges = async () => {
    if (!q) {
      toast.error("No image found");
      router.push("/home");
      return;
    }
    if (!isSignedIn) {
      toast.error("Sign in to use this feature");
      router.push("/home");
      return;
    }
    if (!isLoaded) {
      toast.error("Unable to get user");
      router.refresh();
      return;
    }
    if (tPoint >= maxTPoint) {
      toast.error("Your Transformation point exhausted");
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading("Transforming your image");
    try {
      await axios.patch("/api/metadata-update/transform", {
        userId,
      });
      await user.reload();
      const url = getCldImageUrl({
        src: atob(q),
        width: width,
        height: height,
        crop: cropMode,
        gravity: gravity,
        format: format,
        quality: quality === 0 ? "auto" : quality,
        border:
          borderWidth !== 0
            ? `${borderWidth}px_solid_rgb:${borderColor.replace("#", "")}`
            : undefined,
        background: applyBg
          ? `rgb:${backgroundColor.replace("#", "")}`
          : undefined,
        effects: [
          makeCircular && { radius: "max" },
          brightness !== 0 && { brightness },
          contrast !== 0 && { contrast },
          saturation !== 0 && { saturation },
          grayscale && { grayscale: true },
          sepia && { sepia: true },
          cartoonify && { cartoonify: 70 },
          oilPaint && { oilPaint: 50 },
          pixelate !== 0 && { pixelate },
          blur === 0
            ? null
            : applyFullImage
              ? { blur }
              : applyFaces
                ? { blurFaces: blur }
                : {
                    blurRegion: blur,
                    x: Math.max(0, Math.min(x, Number(width))),
                    y: Math.max(0, Math.min(y, Number(height))),
                    width: Math.min(200, Number(width) - x),
                    height: Math.min(200, Number(height) - y),
                  },
        ].filter(Boolean) as any,
        removeBackground: removeBg,
        overlays: [
          watermarkText && {
            text: {
              text: watermarkText,
              fontFamily: font,
              fontSize: fontSize,
              color: textColor.replace("#", "rgb:"),
              opacity: textOpacity,
            },
            position: {
              gravity: positionMap[textPosition],
              x: offset.x,
              y: offset.y,
            },
          },
        ].filter(Boolean) as any,
      });
      setImageUrl(url);
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => reject();
      });
      toast.success("Transformation successful");
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
      setIsPreview(false);
    }
  };

  const getCssBlur = (cloudinaryBlur: number) => {
    if (applyFaces) return 0;
    if (!applyFullImage) return 0;
    if (cloudinaryBlur <= 50) return cloudinaryBlur / 200;
    if (cloudinaryBlur <= 200) return cloudinaryBlur / 250;
    if (cloudinaryBlur <= 500) return cloudinaryBlur / 300;
    return cloudinaryBlur / 350;
  };

  return (
    <div className="max-h-screen bg-base-100 text-base-content">
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Image Preview */}
          <div className="lg:col-span-2">
            <div className="card-body">
              <div className="relative w-full h-100 lg:h-150 bg-base-300 rounded-lg overflow-hidden flex items-center justify-center">
                {!imageUrl && (
                  <span className="loading loading-spinner loading-xl text-base-content"></span>
                )}
                {imageUrl && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt="Edited preview"
                      className="rounded-lg block"
                      style={
                        isPreview
                          ? {
                              filter: `
                              brightness(${100 + brightness}%)
                              contrast(${100 + contrast}%)
                              saturate(${100 + saturation}%)
                              blur(${getCssBlur(blur)}px)
                              `,
                              border: `${borderWidth * (imageRef.current?.clientWidth! / Number(width))}px solid ${borderColor}`,
                            }
                          : {}
                      }
                    />
                    {isPreview && watermarkText && imageRef.current && (
                      <span
                        ref={textRef}
                        className="absolute"
                        style={{
                          fontFamily: font,
                          fontSize: `${fontSize * (imageRef.current!.clientWidth / Number(width))}px`,
                          color: textColor,
                          opacity: textOpacity / 100,
                          pointerEvents: "none",
                          // compute position relative to actual image
                          left:
                            textPosition === "top-left"
                              ? `${imageRef.current.offsetLeft + offset.x}px`
                              : textPosition === "top-right"
                                ? `${imageRef.current.offsetLeft + imageRef.current.clientWidth - offset.x - (textRef.current?.offsetWidth || 0)}px`
                                : textPosition === "center"
                                  ? `${imageRef.current.offsetLeft + imageRef.current.clientWidth / 2}px`
                                  : textPosition === "bottom-left"
                                    ? `${imageRef.current.offsetLeft + offset.x}px`
                                    : textPosition === "bottom-right"
                                      ? `${imageRef.current.offsetLeft + imageRef.current.clientWidth - offset.x - (textRef.current?.offsetWidth || 0)}px`
                                      : "0",
                          top:
                            textPosition === "top-left" ||
                            textPosition === "top-right"
                              ? `${imageRef.current.offsetTop + offset.y}px`
                              : textPosition === "center"
                                ? `${imageRef.current.offsetTop + imageRef.current.clientHeight / 2}px`
                                : textPosition === "bottom-left" ||
                                    textPosition === "bottom-right"
                                  ? `${imageRef.current.offsetTop + imageRef.current.clientHeight - offset.y - (textRef.current?.offsetHeight || 0)}px`
                                  : "0",
                          transform:
                            textPosition === "center"
                              ? "translate(-50%, -50%)"
                              : undefined,
                        }}
                      >
                        {watermarkText}
                      </span>
                    )}
                  </div>
                )}
                {isPreview && (
                  <div
                    className="absolute bottom-2 right-2 z-50 tooltip tooltip-left tooltip-warning"
                    data-tip="Preview may not match final results"
                  >
                    <button className="btn btn-warning">Preview</button>
                  </div>
                )}
              </div>
              {help&&<div
                className="absolute top-2 left-2 z-50 tooltip tooltip-top tooltip-warning"
                data-tip="Click to get help"
              >
                <Link href={`/learn-more#${activeTab}`} target="_blank">
                  <button className="btn btn-warning">
                    <HelpCircle />
                    Help
                  </button>
                </Link>
              </div>}
            </div>
          </div>

          {/* Right Panel - Tools */}
          <div className="lg:col-span-1">
            {/* Desktop Tabs */}
            <div className="hidden lg:block card bg-base-200 shadow-lg">
              <div className="card-body p-0">
                {/* Tab Navigation */}
                <div className="tabs tabs-bordered" role="tablist">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      role="tab"
                      className={`tab text-xs sm:text-sm font-medium ${activeTab === tab.id ? "tab-active" : ""}`}
                      aria-selected={activeTab === tab.id}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-4 space-y-4">
                  <TabContent
                    activeTab={activeTab}
                    width={width}
                    setWidth={setWidth}
                    height={height}
                    setHeight={setHeight}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    cropMode={cropMode}
                    setCropMode={setCropMode}
                    gravity={gravity}
                    setGravity={setGravity}
                    grayscale={grayscale}
                    setGrayscale={setGrayscale}
                    quality={quality}
                    setQuality={setQuality}
                    borderWidth={borderWidth}
                    setBorderWidth={setBorderWidth}
                    format={format}
                    setFormat={setFormat}
                    sepia={sepia}
                    setSepia={setSepia}
                    cartoonify={cartoonify}
                    setCartoonify={setCartoonify}
                    oilPaint={oilPaint}
                    setOilPaint={setOilPaint}
                    brightness={brightness}
                    setBrightness={setBrightness}
                    contrast={contrast}
                    setContrast={setContrast}
                    saturation={saturation}
                    setSaturation={setSaturation}
                    blur={blur}
                    setBlur={setBlur}
                    pixelate={pixelate}
                    setPixelate={setPixelate}
                    applyFullImage={applyFullImage}
                    setApplyFullImage={setApplyFullImage}
                    applyFaces={applyFaces}
                    setApplyFaces={setApplyFaces}
                    borderColor={borderColor}
                    setBorderColor={setBorderColor}
                    backgroundColor={backgroundColor}
                    setBackgroundColor={setBackgroundColor}
                    makeCircular={makeCircular}
                    setMakeCircular={setMakeCircular}
                    removeBg={removeBg}
                    setRemoveBg={setRemoveBg}
                    applyBg={applyBg}
                    setApplyBg={setApplyBg}
                    watermarkText={watermarkText}
                    setWatermarkText={setWatermarkText}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    textColor={textColor}
                    setTextColor={setTextColor}
                    textPosition={textPosition}
                    setTextPosition={setTextPosition}
                    textOpacity={textOpacity}
                    setTextOpacity={setTextOpacity}
                    x={x}
                    setX={setX}
                    y={y}
                    setY={setY}
                    offset={offset}
                    setOffset={setOffset}
                    font={font}
                    setFont={setFont}
                  />
                </div>

                {/* Action Bar */}
                <div className="border-t border-base-300 p-4 space-y-2 bg-base-100">
                  <button
                    onClick={handleReset}
                    className="btn btn-outline btn-sm w-full"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    className="btn btn-secondary btn-sm w-full"
                    onClick={handleApplyChanges}
                    disabled={isLoading}
                  >
                    {isLoading ? "Applying Changes ..." : "Apply Changes"}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="btn btn-primary btn-sm w-full"
                  >
                    {isDownloading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Drawer Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileTabOpen(true)}
                className="btn btn-primary w-full mb-4"
              >
                Open Tools
              </button>

              {/* Mobile Bottom Sheet */}
              {mobileTabOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                  {/* Backdrop */}
                  <div
                    className="absolute inset-0 bg-base-300/50 backdrop-blur-sm"
                    onClick={() => setMobileTabOpen(false)}
                  />

                  {/* Bottom Sheet */}
                  <div className="absolute bottom-0 left-0 right-0 bg-base-100 rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-4">
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                      <div className="w-12 h-1 bg-base-300 rounded-full"></div>
                    </div>

                    {/* Tabs */}
                    <div className="tabs tabs-bordered px-4">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`tab text-xs font-medium ${activeTab === tab.id ? "tab-active" : ""}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                      <TabContent
                        activeTab={activeTab}
                        width={width}
                        setWidth={setWidth}
                        height={height}
                        setHeight={setHeight}
                        aspectRatio={aspectRatio}
                        setAspectRatio={setAspectRatio}
                        cropMode={cropMode}
                        setCropMode={setCropMode}
                        gravity={gravity}
                        setGravity={setGravity}
                        grayscale={grayscale}
                        setGrayscale={setGrayscale}
                        quality={quality}
                        setQuality={setQuality}
                        borderWidth={borderWidth}
                        setBorderWidth={setBorderWidth}
                        format={format}
                        setFormat={setFormat}
                        sepia={sepia}
                        setSepia={setSepia}
                        cartoonify={cartoonify}
                        setCartoonify={setCartoonify}
                        oilPaint={oilPaint}
                        setOilPaint={setOilPaint}
                        brightness={brightness}
                        setBrightness={setBrightness}
                        contrast={contrast}
                        setContrast={setContrast}
                        saturation={saturation}
                        setSaturation={setSaturation}
                        blur={blur}
                        setBlur={setBlur}
                        pixelate={pixelate}
                        setPixelate={setPixelate}
                        applyFullImage={applyFullImage}
                        setApplyFullImage={setApplyFullImage}
                        applyFaces={applyFaces}
                        setApplyFaces={setApplyFaces}
                        borderColor={borderColor}
                        setBorderColor={setBorderColor}
                        backgroundColor={backgroundColor}
                        setBackgroundColor={setBackgroundColor}
                        makeCircular={makeCircular}
                        setMakeCircular={setMakeCircular}
                        removeBg={removeBg}
                        setRemoveBg={setRemoveBg}
                        applyBg={applyBg}
                        setApplyBg={setApplyBg}
                        watermarkText={watermarkText}
                        setWatermarkText={setWatermarkText}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        textColor={textColor}
                        setTextColor={setTextColor}
                        textPosition={textPosition}
                        setTextPosition={setTextPosition}
                        textOpacity={textOpacity}
                        setTextOpacity={setTextOpacity}
                        x={x}
                        setX={setX}
                        y={y}
                        setY={setY}
                        offset={offset}
                        setOffset={setOffset}
                        font={font}
                        setFont={setFont}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-base-300 p-4 space-y-2 sticky bottom-0 bg-base-100">
                      <button
                        onClick={() => {
                          handleReset();
                          setMobileTabOpen(false);
                        }}
                        className="btn btn-outline btn-sm w-full"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                      <button
                        className="btn btn-secondary btn-sm w-full"
                        onClick={() => {
                          handleApplyChanges();
                          setMobileTabOpen(false);
                        }}
                      >
                        Apply Changes
                      </button>
                      <button
                        onClick={() => {
                          handleDownload();
                          setMobileTabOpen(false);
                        }}
                        disabled={isDownloading}
                        className="btn btn-primary btn-sm w-full"
                      >
                        {isDownloading ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Download
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
