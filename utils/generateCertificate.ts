import axios from "axios";
import toast from "react-hot-toast";
import { isDate } from "util/types";

export async function generateCertificate(
  name: string,
  email: string | undefined,
  id: string,
  templateSrc: string = "/certificate-template.png",
  fileName: string = `certificate-${id}.png`,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    const bg = new Image();
    bg.crossOrigin = "anonymous";
    bg.src = templateSrc;

    bg.onload = async () => {
      canvas.width = bg.width;
      canvas.height = bg.height;

      ctx.drawImage(bg, 0, 0);

      await document.fonts.ready;

      // ==============================
      // Student Name (Main Center Line)
      // ==============================

      let fontSize = 60;
      ctx.font = `bold ${fontSize}px serif`;

      while (ctx.measureText(name).width > canvas.width - 300) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px serif`;
      }

      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "center";

      // EXACT center on name line
      ctx.fillText(name, canvas.width / 2, 545);

      // ==============================
      // Certificate ID (Bottom Right Line)
      // ==============================

      ctx.font = "26px serif";
      ctx.fillStyle = "#1f2937";
      ctx.textAlign = "left";

      // aligned with "Certificate ID: ______"
      ctx.fillText(`${id.slice(0, 13)}`, 1190, 890);

      // ==============================
      // Date (Bottom Left Line)
      // ==============================

      const date = new Date();

      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      };

      const istDate = date.toLocaleDateString("en-GB", options);

      ctx.font = "26px serif";
      ctx.fillStyle = "#1f2937";
      ctx.textAlign = "left";

      // aligned with "Date: ______"
      ctx.fillText(istDate, 320, 870);

      // ==============================
      // Email
      // ==============================

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();

        formData.append("certificate", blob, `certificate-${id}.png`);
        formData.append("name", name);
        formData.append("subject", "Congratulations — You're Now Certified!");
        formData.append("email", email || "");
        formData.append("id", id);

        try {
          await axios.post("/api/certify", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          toast.success("Certificate is mailed to you, Check inbox.");
        } catch (error: any) {
          console.log(error);
          if (error.response) {
            toast.error(error.response.data.error);
          } else {
            toast.error("Error occurred while sending mail");
          }
        }
      }, "image/png");
      // ==============================
      // Download
      // ==============================

      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();

      resolve();
    };

    bg.onerror = () => reject(new Error("Failed to load certificate template"));
  });
}
