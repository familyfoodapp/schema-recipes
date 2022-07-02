export interface Recipe {
  title: string;
  description: string;
  category: string[];
  cuisine: string[];
  yield: number;
  duration: RecipeDuration,
  ingredients: RecipeIngredient[];
  instruction: RecipeInstructionStep[];
  nutrition: RecipeNutrition,
  keywords: string[],
  images: RecipeImage[],
  source: RecipeSource,
}

export interface RecipeDuration {
  preparationTime: number,
  cookingTime: number,
  performTime: number,
  totalTime: number,
}

export interface RecipeIngredient {
  ingredient: string;
  measure: number | null;
  unit: string,
}

export interface RecipeImage {
  base64: string | null,
  url: string,
}

export interface RecipeInstructionStep {
  name: string,
  text: string,
  steps: RecipeInstructionStep[] | null,
}

export interface RecipeNutrition {
  calories: number,
  carbohydrateContent: number,
  cholesterolContent: number,
  fatContent: number
  fiberContent: number,
  proteinContent: number,
  saturatedFatContent: number,
  servingSize: number,
  sodiumContent: number,
  sugarContent: number,
  transFatContent: number,
  unsaturatedFatContent: number,
}

export interface RecipeSource {
  author: string,
  publisher: string,
  publisherUrl: string,
  url: string,
  language: string,
}
