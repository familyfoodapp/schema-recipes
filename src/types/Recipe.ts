export interface Recipe {
  title: string;
  description: string;
  portions: number;
  ingredients: Ingredient[];
  cookingTime: number;
  preparation: string;
  kiloCalories: number;
  fat: number;
  saturatedFattyAcids: number;
  carbs: number;
  sugar: number;
  proteins: number;
  fiber: number;
  salt: number;
  image: string;
  veganLevel: number;
  createdAt: string;
}

export interface Ingredient {
  ingredient: string;
  measure: string;
}
