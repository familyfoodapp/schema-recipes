import { Recipe as SchemaRecipe } from 'schema-dts';
import { Recipe } from './types/Recipe';
import { fetchSchemas } from './requests/fetch';


export async function getSchemaRecipe(url: string): Promise<SchemaRecipe> {
  const definitions = await fetchSchemas(url);
  return extractSchemaRecipe(definitions);
}

export async function getRecipe(url: string): Promise<Recipe> {
  const schemaRecipe = await getSchemaRecipe(url);
  return convertRecipe(schemaRecipe);
}

function extractSchemaRecipe(definitions: any[]): SchemaRecipe {
  let schemaRecipe: SchemaRecipe = { "@type": 'Recipe' };
  for (const definition of definitions) {
    if(definition['@type']?.toLowerCase() === 'recipe') {
      schemaRecipe = definition;
    }
  }
  return schemaRecipe;
}

function convertRecipe(schemaRecipe: SchemaRecipe): Recipe {
  return <Recipe>{
    carbs: 0,
    cookingTime: 0,
    createdAt: '',
    description: schemaRecipe.description,
    fat: 0,
    fiber: 0,
    image: '',
    ingredients: [],
    kiloCalories: 0,
    portions: 0,
    preparation: '',
    proteins: 0,
    salt: 0,
    saturatedFattyAcids: 0,
    sugar: 0,
    title: schemaRecipe.name,
    veganLevel: 0
  }
}
