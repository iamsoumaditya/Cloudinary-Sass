import { off } from "process";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

export default function TabContent({
  activeTab,
  width,
  setWidth,
  height,
  setHeight,
  aspectRatio,
  setAspectRatio,
  cropMode,
  setCropMode,
  gravity,
  setGravity,
  grayscale,
  setGrayscale,
  quality,
  setQuality,
  borderWidth,
  setBorderWidth,
  format,
  setFormat,
  sepia,
  setSepia,
  cartoonify,
  setCartoonify,
  oilPaint,
  setOilPaint,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation,
  blur,
  setBlur,
  pixelate,
  setPixelate,
  applyFullImage,
  setApplyFullImage,
  applyFaces,
  setApplyFaces,
  borderColor,
  setBorderColor,
  backgroundColor,
  setBackgroundColor,
  makeCircular,
  setMakeCircular,
  removeBg,
  setRemoveBg,
  applyBg,
  setApplyBg,
  watermarkText,
  setWatermarkText,
  fontSize,
  setFontSize,
  textColor,
  setTextColor,
  textPosition,
  setTextPosition,
  textOpacity,
  setTextOpacity,
  x,
  y,
  setX,
  setY,
  offset,
  setOffset,
  font,
  setFont,
}: {
  x: number;
  y: number;
  setX: Dispatch<SetStateAction<number>>;
  setY: Dispatch<SetStateAction<number>>;
  activeTab: string;
  width: string;
  setWidth: Dispatch<SetStateAction<string>>;
  height: string;
  setHeight: Dispatch<SetStateAction<string>>;
  aspectRatio: string;
  setAspectRatio: Dispatch<SetStateAction<string>>;
  cropMode: "fit" | "fill" | "scale" | "thumb" | "limit" | "pad";
  setCropMode: Dispatch<
    SetStateAction<"fit" | "fill" | "scale" | "thumb" | "limit" | "pad">
  >;
  gravity: string;
  setGravity: Dispatch<SetStateAction<string>>;
  grayscale: boolean;
  setGrayscale: Dispatch<SetStateAction<boolean>>;
  quality: number;
  setQuality: Dispatch<SetStateAction<number>>;
  borderWidth: number;
  setBorderWidth: Dispatch<SetStateAction<number>>;
  format: string;
  setFormat: Dispatch<SetStateAction<string>>;
  sepia: boolean;
  setSepia: Dispatch<SetStateAction<boolean>>;
  cartoonify: boolean;
  setCartoonify: Dispatch<SetStateAction<boolean>>;
  oilPaint: boolean;
  setOilPaint: Dispatch<SetStateAction<boolean>>;
  brightness: number;
  setBrightness: Dispatch<SetStateAction<number>>;
  contrast: number;
  setContrast: Dispatch<SetStateAction<number>>;
  saturation: number;
  setSaturation: Dispatch<SetStateAction<number>>;
  blur: number;
  setBlur: Dispatch<SetStateAction<number>>;
  pixelate: number;
  setPixelate: Dispatch<SetStateAction<number>>;
  applyFullImage: boolean;
  setApplyFullImage: Dispatch<SetStateAction<boolean>>;
  applyFaces: boolean;
  setApplyFaces: Dispatch<SetStateAction<boolean>>;
  borderColor: string;
  setBorderColor: Dispatch<SetStateAction<string>>;
  backgroundColor: string;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  makeCircular: boolean;
  setMakeCircular: Dispatch<SetStateAction<boolean>>;
  removeBg: boolean;
  setRemoveBg: Dispatch<SetStateAction<boolean>>;
  applyBg: boolean;
  setApplyBg: Dispatch<SetStateAction<boolean>>;
  watermarkText: string;
  setWatermarkText: Dispatch<SetStateAction<string>>;
  fontSize: number;
  setFontSize: Dispatch<SetStateAction<number>>;
  textColor: string;
  setTextColor: Dispatch<SetStateAction<string>>;
  textPosition: string;
  setTextPosition: Dispatch<SetStateAction<string>>;
  textOpacity: number;
  setTextOpacity: Dispatch<SetStateAction<number>>;
  offset: { x: number; y: number };
  setOffset: Dispatch<SetStateAction<{ x: number; y: number }>>;
  font:string;
  setFont:Dispatch<SetStateAction<string>>;
}) {
  const handleHeightAccordingToAspectRatio = (ratio: string, w: string) => {
    if (ratio === "free") return;
    const parts = ratio.split(":");
    const height = Math.ceil(Number(w) / (Number(parts[0]) / Number(parts[1])));
    setHeight(JSON.stringify(height));
  };

  switch (activeTab) {
    case "resize":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label label-text text-sm font-semibold mb-1">
                Width
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => {
                  setWidth(
                    JSON.stringify(
                      Math.min(
                        10000,
                        Math.max(1, parseInt(e.target.value) || 1),
                      ),
                    ),
                  );
                  if (aspectRatio !== "free") {
                    handleHeightAccordingToAspectRatio(
                      aspectRatio,
                      e.target.value,
                    );
                  }
                }}
                className="input input-bordered input-sm w-full outline-0 disabled:bg-base-300"
              />
            </div>
            <div>
              <label className="label label-text text-sm font-semibold mb-1">
                Height
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) =>
                  setHeight(
                    JSON.stringify(
                      Math.min(
                        10000,
                        Math.max(1, parseInt(e.target.value) || 1),
                      ),
                    ),
                  )
                }
                className="input input-bordered input-sm w-full outline-0 disabled:bg-base-300"
                disabled={aspectRatio === "free" ? false : true}
              />
            </div>
          </div>

          <div>
            <label className="label label-text text-sm font-semibold mb-2">
              Aspect Ratio
            </label>
            <div className="space-y-2">
              {[
                { value: "free", label: "Free" },
                { value: "1:1", label: "1:1" },
                { value: "16:9", label: "16:9" },
                { value: "9:16", label: "9:16" },
                { value: "4:5", label: "4:5" },
              ].map((ratio) => (
                <label
                  key={ratio.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="aspect"
                    value={ratio.value}
                    checked={aspectRatio === ratio.value}
                    onChange={(e) => {
                      setAspectRatio(e.target.value);
                      handleHeightAccordingToAspectRatio(e.target.value, width);
                    }}
                    className="radio radio-sm"
                  />
                  <span className="text-sm">{ratio.label}</span>
                </label>
              ))}
            </div>
            {aspectRatio === "1:1" && (
              <label className="flex mt-2 items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={makeCircular}
                  onChange={(e) => setMakeCircular(e.target.checked)}
                  className="checkbox checkbox-sm"
                />
                <span className="text-sm font-medium">Make Circular</span>
              </label>
            )}
          </div>

          <div>
            <label className="label label-text text-sm font-semibold mb-2">
              Crop Mode
            </label>
            <select
              value={cropMode}
              onChange={(e) =>
                setCropMode(
                  e.target.value as
                    | "fit"
                    | "fill"
                    | "scale"
                    | "thumb"
                    | "limit"
                    | "pad",
                )
              }
              className="select select-bordered select-sm w-full outline-0"
            >
              <option value="fill">Fill</option>
              <option value="fit">Fit</option>
              <option value="scale">Scale</option>
              <option value="thumb">Thumb</option>
              <option value="limit">Limit</option>
              <option value="pad">Pad</option>
            </select>
          </div>

          <div>
            <label className="label label-text text-sm font-semibold mb-2">
              Gravity
            </label>
            <select
              value={gravity}
              onChange={(e) => setGravity(e.target.value)}
              className="select select-bordered select-sm w-full outline-0"
            >
              <option value="auto">Auto</option>
              <option value="center">Center</option>
              <option value="north">Top</option>
              <option value="south">Bottom</option>
              <option value="west">Left</option>
              <option value="east">Right</option>
            </select>
          </div>
        </div>
      );

    case "quality":
      return (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label label-text text-sm font-semibold">
                Quality: {quality}%
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="range range-sm"
              disabled={quality === 0}
            />
          </div>

          <div>
            <label className="label label-text text-sm font-semibold mb-2">
              Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Auto", value: 0 },
                { label: "High", value: 95 },
                { label: "Medium", value: 70 },
                { label: "Low", value: 40 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setQuality(preset.value)}
                  className={`btn btn-sm ${quality === preset.value ? "btn-primary" : "btn-ghost"}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case "format":
      return (
        <div className="space-y-3">
          <label className="label label-text text-sm font-semibold">
            Output Format
          </label>
          <div className="space-y-2">
            {[
              { value: "auto", label: "Auto" },
              { value: "jpg", label: "JPG" },
              { value: "png", label: "PNG" },
              { value: "webp", label: "WEBP" },
              { value: "avif", label: "AVIF" },
            ].map((fmt) => (
              <label
                key={fmt.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="format"
                  value={fmt.value}
                  checked={format === fmt.value}
                  onChange={(e) => setFormat(e.target.value)}
                  className="radio radio-sm"
                />
                <span className="text-sm font-medium">{fmt.label}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case "filters":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            {[
              { name: "Grayscale", state: grayscale, setter: setGrayscale },
              { name: "Sepia", state: sepia, setter: setSepia },
              { name: "Cartoonify", state: cartoonify, setter: setCartoonify },
              { name: "Oil Paint", state: oilPaint, setter: setOilPaint },
            ].map((filter) => (
              <label
                key={filter.name}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filter.state}
                  onChange={() => {
                    setGrayscale(false);
                    setSepia(false);
                    setCartoonify(false);
                    setOilPaint(false);
                    filter.setter(true);
                  }}
                  className="checkbox checkbox-sm"
                />
                <span className="text-sm font-medium">{filter.name}</span>
              </label>
            ))}
          </div>

          <div className="divider my-2"></div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label label-text text-sm font-semibold">
                Brightness: {brightness}%
              </label>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="range range-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label label-text text-sm font-semibold">
                Contrast: {contrast}%
              </label>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))}
              className="range range-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label label-text text-sm font-semibold">
                Saturation: {saturation}%
              </label>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value))}
              className="range range-sm"
            />
          </div>
        </div>
      );

    case "blur":
      return (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label label-text text-sm font-semibold">
                Blur Strength: {blur}px
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value))}
              className="range range-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label label-text text-sm font-semibold">
                Pixelation: {pixelate}px
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              value={pixelate}
              onChange={(e) => setPixelate(parseInt(e.target.value))}
              className="range range-sm"
            />
          </div>

          <div className="space-y-2">
            {[
              {
                name: "Apply to full image",
                state: applyFullImage,
                setter: setApplyFullImage,
              },
              {
                name: "Apply to faces",
                state: applyFaces,
                setter: setApplyFaces,
              },
            ].map((filter) => (
              <label
                key={filter.name}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filter.state}
                  onChange={(e) => {
                    setApplyFaces(false);
                    setApplyFullImage(false);
                    filter.setter(e.target.checked);
                  }}
                  className="checkbox checkbox-sm"
                />
                <span className="text-sm font-medium">{filter.name}</span>
              </label>
            ))}
          </div>
          {!applyFullImage && !applyFaces && (
            <>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label label-text text-sm font-semibold">
                    X: {x}px
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={x}
                  onChange={(e) => setX(parseInt(e.target.value))}
                  className="range range-sm"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label label-text text-sm font-semibold">
                    Y: {y}px
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={y}
                  onChange={(e) => setY(parseInt(e.target.value))}
                  className="range range-sm"
                />
              </div>
            </>
          )}
        </div>
      );

    case "border":
      return (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label label-text text-sm font-semibold">
                Border Width: {borderWidth}px
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={borderWidth}
              onChange={(e) => setBorderWidth(parseInt(e.target.value))}
              className="range range-sm"
            />
          </div>

          <div>
            <label className="label label-text text-sm font-semibold mb-2">
              Border Color
            </label>
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="input input-bordered p-2 h-10 w-full cursor-pointer outline-0"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={removeBg}
              onChange={(e) => setRemoveBg(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm font-medium">Remove Background</span>
          </label>

          {removeBg && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={applyBg}
                onChange={(e) => setApplyBg(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm font-medium">Apply Background</span>
            </label>
          )}

          {applyBg && (
            <div>
              <label className="label label-text text-sm font-semibold mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => {
                  setBackgroundColor(e.target.value);
                  setCropMode("pad");
                }}
                className="input input-bordered p-2 h-10 w-full cursor-pointer outline-0"
              />
            </div>
          )}
        </div>
      );

    case "text":
      return (
        <div className="space-y-4">
          <div>
            <label className="label label-text text-sm font-semibold mb-1">
              Watermark Text
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="Enter watermark text"
              className="input input-bordered input-sm w-full outline-0"
            />
          </div>

          <div>
            <label className="label label-text text-sm font-semibold mb-2">
              Font Family
            </label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="select select-bordered select-sm w-full outline-0"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Georgia">Georgia</option>
              <option value="Impact">Impact</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label label-text text-sm font-semibold">
                Font Size: {fontSize}px
              </label>
            </div>
            <input
              type="range"
              min="12"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="range range-sm outline-0"
            />
          </div>

          <div>
            <label className="label label-text text-sm font-semibold mb-2">
              Text Color
            </label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="input input-bordered p-2 h-10 w-full cursor-pointer outline-0"
            />
          </div>

          <div>
            <label className="label label-text text-sm font-semibold mb-2">
              Position
            </label>
            <select
              value={textPosition}
              onChange={(e) => setTextPosition(e.target.value)}
              className="select select-bordered select-sm w-full outline-0"
            >
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="center">Center</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label label-text text-sm font-semibold">
                Move along width: {offset.x}px
              </label>
            </div>
            <input
              type="range"
              min={-width}
              max={width}
              value={offset.x}
              onChange={(e) =>
                setOffset((prev) => ({ ...prev, x: parseInt(e.target.value) }))
              }
              className="range range-sm"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label label-text text-sm font-semibold">
                Move along height: {offset.y}px
              </label>
            </div>
            <input
              type="range"
              min={-height}
              max={height}
              value={offset.y}
              onChange={(e) =>
                setOffset((prev) => ({ ...prev, y: parseInt(e.target.value) }))
              }
              className="range range-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label label-text text-sm font-semibold">
                Opacity: {textOpacity}%
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={textOpacity}
              onChange={(e) => setTextOpacity(parseInt(e.target.value))}
              className="range range-sm"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}
