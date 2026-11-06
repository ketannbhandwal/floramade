/**
 * Client-side media upload and image compression utility.
 * Optimizes large images in the browser before sending to /api/upload.
 * Prevents Vercel 4.5MB "Request Entity Too Large" errors (413) and
 * speeds up banner and product image uploads dramatically.
 */

export async function compressImageFile(file, options = {}) {
  const {
    maxWidth = 2560,
    maxHeight = 2560,
    quality = 0.88,
    targetMaxBytes = 2 * 1024 * 1024, // 2MB target
  } = options;

  if (typeof window === "undefined" || !file || !file.type) {
    return file;
  }

  // Only compress raster images; skip SVG, GIF (animations), and videos
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  // If already small and reasonable size (< 350 KB), skip compression
  if (file.size <= 350 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        let width = img.naturalWidth || img.width || 1920;
        let height = img.naturalHeight || img.height || 1080;

        // Downscale proportionally if dimensions exceed max
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for optimal compression with transparency support
        const tryExport = (mimeType, q) => {
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                const ext = mimeType === "image/webp" ? ".webp" : ".jpg";
                const newName = file.name.replace(/\.[^.]+$/, ext);
                const optimizedFile = new File([blob], newName, {
                  type: mimeType,
                  lastModified: Date.now(),
                });
                resolve(optimizedFile);
              } else if (mimeType === "image/webp") {
                // If WebP is not supported or larger, try JPEG fallback
                tryExport("image/jpeg", q);
              } else {
                resolve(file);
              }
            },
            mimeType,
            q
          );
        };

        tryExport("image/webp", quality);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    } catch {
      resolve(file);
    }
  });
}

/**
 * Universal safe media uploader.
 * Uses FormData to avoid 33% base64 bloat, compresses images first,
 * and handles HTTP 413 / non-JSON responses safely without crashing.
 */
export async function uploadMediaFile(file, options = {}) {
  if (!file) throw new Error("No file selected.");

  const {
    type = "image",
    maxWidth = 2560,
    maxHeight = 2560,
    quality = 0.88,
  } = options;

  // 1. Optimize image in browser if applicable
  let fileToUpload = file;
  if (file.type && file.type.startsWith("image/")) {
    fileToUpload = await compressImageFile(file, { maxWidth, maxHeight, quality });
  } else if (file.type && file.type.startsWith("video/")) {
    if (file.size > 20 * 1024 * 1024) {
      throw new Error("Videos must be 20 MB or smaller.");
    }
  }

  // 2. Prepare FormData
  const formData = new FormData();
  formData.append("file", fileToUpload);
  formData.append("type", type);

  // 3. Send upload request
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  // 4. Safe response parsing (never crash with Unexpected token 'R' on 413/HTML)
  const contentType = res.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
    }
  }

  if (!res.ok) {
    if (res.status === 413) {
      throw new Error("File is too large for upload. Please choose an image under 5 MB.");
    }
    const errorText = data?.error || data?.message;
    if (errorText) throw new Error(errorText);

    const rawText = !data ? await res.text().catch(() => "") : "";
    if (rawText.includes("Request Entity Too Large") || rawText.includes("Payload Too Large")) {
      throw new Error("File is too large for upload. Please choose an image under 5 MB.");
    }
    throw new Error(rawText || `Upload failed with status ${res.status}`);
  }

  if (!data?.url) {
    throw new Error("Server did not return a valid media URL.");
  }

  return data.url;
}

