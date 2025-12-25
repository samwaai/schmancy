/**
 * Hannah Image Optimization Types
 * Types for the menu item image optimization feature
 */

/**
 * Quality presets for image optimization
 * Uses Sharp WebP with effort and preset options for significant file size differences
 *
 * | Preset | Quality | Effort | Description |
 * |--------|---------|--------|-------------|
 * | low    | 40      | 6      | Smallest file (~10-20KB), visible compression |
 * | medium | 60      | 5      | Balanced (~20-40KB), slight quality loss |
 * | high   | 80      | 4      | Good quality (~40-80KB), minimal artifacts |
 * | max    | 90      | 3      | Best quality (~80-150KB), near-original |
 *
 * All presets use preset='photo' and smartSubsample for optimal food photo compression
 */
export type ImageQualityPreset = 'low' | 'medium' | 'high' | 'max'

export interface OptimizeMenuItemImageRequest {
  orgId: string
  businessId: string
  itemId: string
  /** Quality preset - defaults to 'high' if not specified */
  quality?: ImageQualityPreset
}

export interface ImageSizeResult {
  originalSize: number
  optimizedSize: number
  url: string
}

export interface OptimizeMenuItemImageResponse {
  success: boolean
  hasTransparency: boolean
  format: 'webp'
  sizes: {
    thumbnail: ImageSizeResult  // 200x150
    medium: ImageSizeResult     // 400x300
    large: ImageSizeResult      // 800x600
  }
  totalOriginalSize: number
  totalOptimizedSize: number
}
