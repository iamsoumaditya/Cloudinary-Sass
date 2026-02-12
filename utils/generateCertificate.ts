export async function generateCertificate(
  name: string,
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
      // Match canvas to template
      canvas.width = bg.width;
      canvas.height = bg.height;

      ctx.drawImage(bg, 0, 0);

      // ✅ Ensure fonts are loaded
      await document.fonts.ready;

      // ===== Name Auto-Scale =====
      let fontSize = 40;
      ctx.font = `${fontSize}px serif`;

      // Reduce font if name too long
      while (ctx.measureText(name).width > canvas.width - 200) {
        fontSize -= 2;
        ctx.font = `${fontSize}px serif`;
      }

      ctx.fillStyle = "#000";
      ctx.textAlign = "center";

      // ===== Draw Name =====
      ctx.fillText(name, canvas.width / 2, 300);

      // ===== Draw Certificate ID =====
      ctx.font = "24px serif";
      ctx.fillText(`ID: ${id}`, canvas.width / 2, 360);

      // ===== Download PNG =====
      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();

      resolve();
    };

    bg.onerror = () => reject(new Error("Failed to load certificate template"));
  });
}
