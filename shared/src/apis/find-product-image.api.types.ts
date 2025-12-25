// packages/shared/src/apis/find-product-image.api.types.ts

/**
 * Request type for finding product image
 */
export interface FindProductImageRequest {
  /**
   * Item ID to find image for
   */
  itemId: string;
}

/**
 * Response type for finding product image
 */
export interface FindProductImageResponse {
  /**
   * Whether the operation was successful
   */
  success: boolean;

  /**
   * Message describing the result
   */
  message: string;

  /**
   * The image URL/path that was found and applied (if successful)
   */
  imageUrl?: string;
}
