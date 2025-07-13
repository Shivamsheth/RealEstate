// src/utils/cloudinaryUpload.js

/**
 * Uploads multiple image files to Cloudinary using an unsigned preset.
 * @param {File[]} files - Array of image files to upload.
 * @param {(index: number, percent: number) => void} [onProgress] - Optional progress callback.
 * @returns {Promise<string[]>} - Array of secure image URLs.
 */
export const uploadMultipleToCloudinary = async (files, onProgress) => {
  const cloudName = 'dcrltbxgq'; // your Cloudinary cloud name
  const uploadPreset = 'rudra_property_upload'; // your unsigned preset
  const urls = [];

  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();
    formData.append('file', files[i]);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed for image ${i + 1}: ${errorText}`);
      }

      const data = await response.json();
      urls.push(data.secure_url);

      if (onProgress) onProgress(i, 100); // Simulated progress
    } catch (error) {
      console.error(`Error uploading image ${i + 1}:`, error);
      throw error;
    }
  }

  return urls;
};  