import { getSchemaRecipe } from '../index';

// German
test('Get Schema Recipe | chefkoch', async () => {
  const recipe = await getSchemaRecipe('https://www.chefkoch.de/rezepte/583381157461209/Ravioli-mit-gebratenen-Garnelen-und-Spargel-in-Kraeutersahne.html');
  expect(recipe?.name).toBe('Ravioli mit gebratenen Garnelen und Spargel in Kräutersahne');
});
test('Get Schema Recipe | lecker', async () => {
  const recipe = await getSchemaRecipe('https://www.lecker.de/erdbeer-tiramisu-83771.html');
  console.log(recipe)
  expect(recipe?.name).toBe('Erdbeer-Tiramisu');
});
test('Get Schema Recipe | einfachbacken', async () => {
  const recipe = await getSchemaRecipe('https://www.einfachbacken.de/rezepte/pizzateig-grundrezept-original-wie-vom-italiener');
  expect(recipe?.name).toBe('Pizzateig Grundrezept - Original wie vom Italiener');
});

// English
test('Get Schema Recipe | bbcgoodfood', async () => {
  const recipe = await getSchemaRecipe('https://www.bbcgoodfood.com/recipes/broken-biscuit-squares');
  expect(recipe?.name).toBe('Broken biscuit squares');
});
test('Get Schema Recipe | allrecipes', async () => {
  const recipe = await getSchemaRecipe('https://www.allrecipes.com/recipe/285407/lemon-vanilla-french-toast/');
  expect(recipe?.name).toBe('Lemon-Vanilla French Toast');
});
