import { Recipe as SchemaRecipe, WebSite as SchemaWebSite } from 'schema-dts';
import { Recipe } from './types/Recipe';
import { fetchHTML } from './requests/fetch';
import { extractRecipe } from './extractRecipe';

export async function getSchemaRecipe(url: string): Promise<SchemaRecipe | null> {
  const html = await fetchHTML(url);
  const definitions = extractDefinitions(html);
  return extractSchemaRecipe(definitions);
}

export async function getRecipe(url: string, base64ImageDownload: boolean = false): Promise<Recipe | null> {
  const html = await fetchHTML(url);
  const definitions = extractDefinitions(html);
  const schemaWebSite = extractSchemaWebSite(definitions);
  const schemaRecipe = extractSchemaRecipe(definitions);
  return  schemaRecipe ? await extractRecipe(schemaRecipe, schemaWebSite, url, base64ImageDownload) : null;
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

function extractSchemaWebSite(definitions: any[]): SchemaWebSite | null {
  let schemaWebSite: SchemaWebSite = recursiveTypeSearch(definitions, 'website') as unknown as SchemaWebSite;
  return schemaWebSite ?? null;
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
