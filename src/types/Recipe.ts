export interface Recipe {
  title: string | null;
  description: string | null;
  category: string[];
  cuisine: string[];
  yield: number | null;
  duration: RecipeDuration,
  ingredients: RecipeIngredient[];
  instruction: RecipeInstructionStep[];
  nutrition: RecipeNutrition,
  keywords: string[],
  images: RecipeImage[],
  source: RecipeSource,
}

export interface RecipeDuration {
  preparationTime: number | null,
  cookingTime: number | null,
  performTime: number | null,
  totalTime: number | null,
}

export interface RecipeIngredient {
  ingredient: string | null;
  measure: number | null;
  unit: string | null,
}

export interface RecipeImage {
  base64: string | null,
  url: string | null,
}

export interface RecipeInstructionStep {
  name: string | null,
  text: string | null,
  steps: RecipeInstructionStep[] | null,
}

export interface RecipeNutrition {
  calories: number | null,
  carbohydrateContent: number | null,
  cholesterolContent: number | null,
  fatContent: number | null,
  fiberContent: number | null,
  proteinContent: number | null,
  saturatedFatContent: number | null,
  servingSize: number | null,
  sodiumContent: number | null,
  sugarContent: number | null,
  transFatContent: number | null,
  unsaturatedFatContent: number | null,
}

export interface RecipeSource {
  author: string | null,
  publisher: string | null,
  publisherUrl: string | null,
  url: string | null,
  language: string | null,
}
