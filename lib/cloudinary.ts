import { buildUrl } from 'cloudinary-build-url'

export function getCloudinaryImageUrl(publicId: string, options?: {
  width?: number
  height?: number
  quality?: number
}) {
  return buildUrl(publicId, {
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
    transformations: {
      quality: options?.quality || 'auto',
      width: options?.width,
      height: options?.height,
    },
  })
} 