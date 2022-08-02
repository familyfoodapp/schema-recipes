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
  const language = extractLanguage(html);
  return schemaRecipe ? await extractRecipe(schemaRecipe, schemaWebSite, url, language, base64ImageDownload) : null;
}

export async function getSchemaWebSite(url: string): Promise<SchemaWebSite | null> {
  const html = await fetchHTML(url);
  const definitions = extractDefinitions(html);
  return extractSchemaWebSite(definitions);
}

function extractDefinitions(html: string): any[] {
  const definitions: any[] = [];
  const regex = /(?:<script[^>]*?type(?:\s*?)=(?:\s*?)["']application\/ld\+json["'][^>]*?>)([\s\S]*?)(?=<\/script>)/gi;

  const matches = Array.from(html.matchAll(regex), (m) => m[1]);

  matches.forEach((content) => {
    try {
      const clearedContent = content.replace(/[\r\n]/gm, '');
      const definition = JSON.parse(clearedContent);
      definitions.push(definition);
    } catch (e) {
      return;
    }
  });

  return definitions;
}

function extractSchemaRecipe(definitions: any[]): SchemaRecipe | null {
  const schemaRecipe: SchemaRecipe = recursiveTypeSearch(definitions, 'recipe') as unknown as SchemaRecipe;
  return schemaRecipe ?? null;
}

function extractSchemaWebSite(definitions: any[]): SchemaWebSite | null {
  const schemaWebSite: SchemaWebSite = recursiveTypeSearch(definitions, 'website') as unknown as SchemaWebSite;
  return schemaWebSite ?? null;
}

function extractLanguage(html: string): string | null {
  const languageCode = null;
  const regex = /(?:<html[^>]*?lang(?:\s*?)=(?:\s*?)["'])([A-z|-]*)(?:["'][^>]*?>)/gi;
  const matches = Array.from(html.matchAll(regex), (m) => m[1]);
  if (matches) {
    if (matches.length > 0) return matches[0];
  }
  return languageCode;
}

function recursiveTypeSearch(definitions: any[], type: string): any[] | null {
  // tslint:disable-next-line:forin
  for (const k in definitions) {
    if (k === '@type') {
      if (definitions[k].toLowerCase() === type) {
        return definitions;
      }
    }

    if (typeof definitions[k] === 'object' && definitions[k] !== null) {
      const definition = recursiveTypeSearch(definitions[k], type);
      if (definition) return definition;
    }
  }
  return null;
}
