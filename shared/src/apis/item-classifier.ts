// packages/shared/src/apis/item-classifier.ts

/**
 * Request type for ingredient classification
 */
export interface ItemClassificationRequest {
  /**
   * Item ID to classify
   */
  itemId: string;

  /**
   * Optional guidance notes from the user
   */
  userNotes?: string;

  /**
   * Optional user-suggested ingredient name
   */
  suggestedIngredient?: string;
}

/**
 * Response type for ingredient classification
 */
export interface ItemClassificationResponse {
  /**
   * Whether the classification was successful
   */
  success: boolean;

  /**
   * Any messages to display to the user
   */
  message: string;

  /**
   * The classified ingredient name
   */
  ingredient?: string;

  /**
   * Related tags for the ingredient
   */
  tags?: string[];

  /**
   * Confidence level (0.0-1.0)
   */
  confidence?: number;
}
