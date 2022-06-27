import { Recipe as SchemaRecipe } from 'schema-dts';
import { Recipe } from './types/Recipe';
import { fetchHTML } from './requests/fetch';


export async function getSchemaRecipe(url: string): Promise<SchemaRecipe | null> {
  const html = await fetchHTML(url);
  const definitions = extractDefinitions(html);
  return extractSchemaRecipe(definitions);
}

export async function getRecipe(url: string): Promise<Recipe | null> {
  const schemaRecipe = await getSchemaRecipe(url);
  return schemaRecipe ? convertRecipe(schemaRecipe) : null;
}

function extractDefinitions(html: string) : any[] {

  let definitions: any[] = [];
  const regex = /(?<=(<script type="application\/ld\+json">))([\s\S]*?)(?=(<\/script>))/g
  const regExpMatchArray = html.match(regex);
  try {
    if (regExpMatchArray) {
      regExpMatchArray.forEach((content) => {
        const definition = JSON.parse(content);
        definitions.push(definition);
      })
    }
  }catch (e){
    console.log("Failed to parse!")
  }
  return definitions;
}

function extractSchemaRecipe(definitions: any[]): SchemaRecipe | null {
  let schemaRecipe: SchemaRecipe = recursiveTypeSearch(definitions, 'recipe') as unknown as SchemaRecipe;
  return schemaRecipe ?? null;
}

function recursiveTypeSearch(definitions: any[], type: string) : any[] | null {
  for (const k in definitions) {
    if(k === '@type'){
      if (definitions[k].toLowerCase() === type) {
        return definitions;
      }
    }

    if (typeof definitions[k] == "object" && definitions[k] !== null){
      let definition = recursiveTypeSearch(definitions[k], type);
      if(definition) return definition;
    }
  }
  return null;
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
