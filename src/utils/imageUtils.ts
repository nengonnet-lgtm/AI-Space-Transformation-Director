import { ReferenceImageItem } from '../types/director';

/**
 * Resizes an image on the client to prevent excessive memory & LocalStorage usage
 * while maintaining crisp resolution for preview and director references.
 */
export async function processImageFile(
  file: File,
  maxDimension = 1200,
  quality = 0.85
): Promise<ReferenceImageItem> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`));
    };

    reader.onload = () => {
      const dataUrl = reader.result as string;

      // If not an image or SVG, return as is
      if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
        resolve({
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          previewUrl: dataUrl,
          size: file.size,
          uploadedAt: Date.now(),
        });
        return;
      }

      const img = new Image();
      img.onerror = () => {
        // Fallback to original dataUrl if image loading fails
        resolve({
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          previewUrl: dataUrl,
          size: file.size,
          uploadedAt: Date.now(),
        });
      };

      img.onload = () => {
        let { width, height } = img;

        if (width <= maxDimension && height <= maxDimension && file.size < 500 * 1024) {
          // Image is already compact, no need to redraw canvas
          resolve({
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: file.name,
            previewUrl: dataUrl,
            size: file.size,
            uploadedAt: Date.now(),
          });
          return;
        }

        // Calculate proportional dimensions
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: file.name,
            previewUrl: dataUrl,
            size: file.size,
            uploadedAt: Date.now(),
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const optimizedUrl = canvas.toDataURL('image/jpeg', quality);

        resolve({
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          previewUrl: optimizedUrl,
          size: Math.round((optimizedUrl.length * 3) / 4), // Approximate byte size from base64
          uploadedAt: Date.now(),
        });
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
