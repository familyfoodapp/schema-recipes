import { NutritionInformation, Recipe as SchemaRecipe } from 'schema-dts';
import { RecipeIngredient, Recipe, RecipeInstructionStep, RecipeNutrition, RecipeImage } from './types/Recipe';
import { fetchHTML, fetchImageBase64 } from './requests/fetch';
import * as td from 'tinyduration';

export async function getSchemaRecipe(url: string): Promise<SchemaRecipe | null> {
  const html = await fetchHTML(url);
  const definitions = extractDefinitions(html);
  return extractSchemaRecipe(definitions);
}

export async function getRecipe(url: string, base64ImageDownload: boolean = false): Promise<Recipe | null> {
  const schemaRecipe = await getSchemaRecipe(url);
  return schemaRecipe ? await convertRecipe(schemaRecipe, base64ImageDownload) : null;
}

function extractDefinitions(html: string): any[] {

  let definitions: any[] = [];
  const regex = /(?<=(<script type( *?)=( *?)["']application\/ld\+json["'][^>]*?>))([\s\S]*?)(?=(<\/script>))/g;
  const regExpMatchArray = html.match(regex);
  try {
    if (regExpMatchArray) {
      regExpMatchArray.forEach((content) => {
        const definition = JSON.parse(content);
        definitions.push(definition);
      });
    }
  } catch (e) {
    console.log('Failed to parse!');
  }
  return definitions;
}

function extractSchemaRecipe(definitions: any[]): SchemaRecipe | null {
  let schemaRecipe: SchemaRecipe = recursiveTypeSearch(definitions, 'recipe') as unknown as SchemaRecipe;
  return schemaRecipe ?? null;
}

function recursiveTypeSearch(definitions: any[], type: string): any[] | null {
  for (const k in definitions) {
    if (k === '@type') {
      if (definitions[k].toLowerCase() === type) {
        return definitions;
      }
    }

    if (typeof definitions[k] == 'object' && definitions[k] !== null) {
      let definition = recursiveTypeSearch(definitions[k], type);
      if (definition) return definition;
    }
  }
  return null;
}

async function convertRecipe(schemaRecipe: SchemaRecipe, base64ImageDownload: boolean): Promise<Recipe> {
  const recipe = <Recipe>{
    title: convertString(schemaRecipe.name),
    description: convertString(schemaRecipe.description),
    category: convertStringArray(schemaRecipe.recipeCategory),
    cuisine: convertStringArray(schemaRecipe.recipeCuisine),
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
    keywords: convertStringArray(schemaRecipe.keywords),
    images: await extractImages(schemaRecipe.image, base64ImageDownload),
  };
  return recipe;
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

function extractNumber(string: any): number {
  if (typeof string === 'string') {
    const regExpMatchArray = string.match(/\d+/);
    if (regExpMatchArray) {
      return parseInt(regExpMatchArray[0]) ?? 0;
    }
  }
  return 0;
}


function convertString(value: any): string {
  let string: string = '';
  if (typeof value === 'string') {
    string = value;
  }
  return string;
}

function convertStringArray(value: any): string[] {
  const stringArray: string[] = [];
  if (Array.isArray(value)) {
    value.forEach((element) => {
      if (typeof element === 'string') stringArray.push(element);
    });
  }
  if (typeof value === 'string') {
    stringArray.push(value);
  }
  return stringArray;
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

function extractIngredient(ingredientString: string): RecipeIngredient {
  const index = ingredientString.indexOf(' ');
  const measure = ingredientString.substring(0, index).trim();
  const ingredient = ingredientString.substring(index).trim();
  return {
    ingredient: ingredient || '',
    measure: measure || '',
  };
}

async function extractImages(value: any, base64ImageDownload: boolean): Promise<RecipeImage[]> {
  const images: RecipeImage[] = [];
  const pushImage = async (element: string) => {
    images.push({
      base64: base64ImageDownload ? await fetchImageBase64(element) : null,
      url: element,
    });
  }

  if(value['@type'] === 'ImageObject'){
    await pushImage(value.url);
  }else if(Array.isArray(value)) {
    value.forEach(pushImage)
  } else{
    await pushImage(value);
  }

  return images;
}
