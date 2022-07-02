import * as measurementUnits from './data/measurement_units.json';
import {
  Recipe,
  RecipeImage,
  RecipeIngredient,
  RecipeInstructionStep,
  RecipeNutrition,
  RecipeSource,
} from './types/Recipe';
import { Recipe as SchemaRecipe, WebSite as SchemaWebSite } from 'schema-dts';
import * as td from 'tinyduration';
import { fetchImageBase64 } from './requests/fetch';
import { extractNumber, extractString, extractStringArray } from './extractTools';

export async function extractRecipe(schemaRecipe: SchemaRecipe, schemaWebSite: SchemaWebSite | null, url: string, base64ImageDownload: boolean): Promise<Recipe> {
  return <Recipe>{
    title: extractString(schemaRecipe.name),
    description: extractString(schemaRecipe.description),
    category: extractStringArray(schemaRecipe.recipeCategory),
    cuisine: extractStringArray(schemaRecipe.recipeCuisine),
    yield: extractNumber(schemaRecipe.recipeYield),
    duration: {
      preparationTime: extractMinutes(schemaRecipe.prepTime),
      cookingTime: extractMinutes(schemaRecipe.cookTime),
      performTime: extractMinutes(schemaRecipe.performTime),
      totalTime: extractMinutes(schemaRecipe.totalTime),
    },
    instruction: extractInstruction(schemaRecipe.recipeInstructions),
    ingredients: extractIngredients(schemaRecipe.recipeIngredient),
    nutrition: extractNutrition(schemaRecipe.nutrition),
    keywords: extractStringArray(schemaRecipe.keywords),
    images: await extractImages(schemaRecipe.image, base64ImageDownload),
    source: extractSource(schemaWebSite, url, schemaRecipe.author, schemaRecipe.publisher),
  };
}


function extractSource(schemaWebSite: SchemaWebSite | null, url: string, author: any, publisher: any): RecipeSource {
  const authorName = typeof author?.name === 'string' ? author?.name : '';
  const publisherName = typeof publisher?.name === 'string' ? publisher?.name : '';
  let publisherUrl = '';

  if (schemaWebSite) {
    publisherUrl = typeof schemaWebSite?.url === 'string' ? schemaWebSite?.url : '';
  }

  return <RecipeSource>{
    author: authorName,
    publisher: publisherName,
    publisherUrl,
    url,
  };
}

function extractNutrition(value: any): RecipeNutrition {
  return {
    calories: extractNumber(value.calories),
    carbohydrateContent: extractNumber(value.carbohydrateContent),
    cholesterolContent: extractNumber(value.cholesterolContent),
    fatContent: extractNumber(value.fatContent),
    fiberContent: extractNumber(value.fiberContent),
    proteinContent: extractNumber(value.proteinContent),
    saturatedFatContent: extractNumber(value.saturatedFatContent),
    servingSize: extractNumber(value.servingSize),
    sodiumContent: extractNumber(value.sodiumContent),
    sugarContent: extractNumber(value.sugarContent),
    transFatContent: extractNumber(value.transFatContent),
    unsaturatedFatContent: extractNumber(value.unsaturatedFatContent),
  };
}

function extractMinutes(duration: any): number {
  let minutes = 0;
  if (typeof duration === 'string') {
    const cookTimeObject = td.parse(duration);
    if (cookTimeObject.minutes) {
      minutes += cookTimeObject.minutes;
    }
    if (cookTimeObject.hours) {
      minutes += cookTimeObject.hours * 60;
    }
  }
  return minutes;
}

function extractInstruction(value: any): RecipeInstructionStep[] {

  const instructionSteps: RecipeInstructionStep[] = [];

  if (Array.isArray(value)) {
    value.forEach((step) => {
      switch (step['@type']) {
        case 'HowToStep':
          instructionSteps.push({
            name: step.name || '',
            text: step.text || '',
            steps: null,
          });
          break;
        case 'HowToSection':
          instructionSteps.push({
            name: step.name || '',
            text: '',
            steps: extractInstruction(step.itemListElement),
          });
          break;
      }
    });
  }

  if (typeof value === 'string') {
    instructionSteps.push({
      name: '',
      text: value,
      steps: null,
    });
  }

  return instructionSteps;
}

function extractIngredients(value: any): RecipeIngredient[] {
  const recipeIngredients: RecipeIngredient[] = [];
  if (Array.isArray(value)) {
    value.forEach((ingredientString: string) => {
      recipeIngredients.push(extractIngredient(ingredientString));
    });
  }
  return recipeIngredients;
}

export function extractIngredient(ingredientString: string): RecipeIngredient {
  let ingredient = ingredientString;
  let unit = '';
  for (const measurementUnit of measurementUnits) {
    const regexString = '(\\d|\\s|^)' + measurementUnit + '(\\s|$)';
    const regex = new RegExp(regexString, 'gi');
    if (regex.test(ingredientString)) {
      ingredient = ingredient.replace(regex, '');
      unit = measurementUnit;
    }
  }

  ingredient = ingredient.replace(/\d+/, '').trim();

  return {
    ingredient,
    measure: extractNumber(ingredientString) || null,
    unit,
  };
}

async function extractImages(value: any, base64ImageDownload: boolean): Promise<RecipeImage[]> {
  const images: RecipeImage[] = [];
  const pushImage = async (element: string) => {
    images.push({
      base64: base64ImageDownload ? await fetchImageBase64(element) : null,
      url: element,
    });
  };

  if (value['@type'] === 'ImageObject') {
    await pushImage(value.url);
  } else if (Array.isArray(value)) {
    value.forEach(pushImage);
  } else {
    await pushImage(value);
  }

  return images;
}


