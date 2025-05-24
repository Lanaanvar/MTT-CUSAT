import { AppError, ErrorType, ErrorMessages, validateImageFile } from '@/lib/utils/error-handling';

export async function uploadImage(file: File): Promise<string> {
  try {
    // Validate the file first
    validateImageFile(file);

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName) {
      throw new AppError(
        ErrorMessages.CLOUDINARY.MISSING_CONFIG,
        ErrorType.UPLOAD
      );
    }

    const formData = new FormData();
    formData.append('file', file);
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
        const errorData = await response.json().catch(() => null);
        throw new AppError(
          `Failed to upload image: ${response.status} ${response.statusText}${
            errorData ? ` - ${errorData.error?.message || JSON.stringify(errorData)}` : ''
          }`,
          ErrorType.UPLOAD,
          errorData
        );
      }

      const data = await response.json();
      if (!data.secure_url) {
        throw new AppError(
          'No secure URL received from Cloudinary',
          ErrorType.UPLOAD
        );
      }

      return data.secure_url;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorMessages.CLOUDINARY.UPLOAD_FAILED,
        ErrorType.UPLOAD,
        error
      );
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
} 