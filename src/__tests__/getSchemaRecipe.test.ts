import { getSchemaRecipe } from '../index';
test('Get Recipe | chefkoch', async () => {
  const recipe = await getSchemaRecipe('https://www.chefkoch.de/rezepte/583381157461209/Ravioli-mit-gebratenen-Garnelen-und-Spargel-in-Kraeutersahne.html');
  expect(recipe.name).toBe('Ravioli mit gebratenen Garnelen und Spargel in Kräutersahne');
});
test('Get Recipe | lecker', async () => {
  const recipe = await getSchemaRecipe('https://www.lecker.de/erdbeer-tiramisu-83771.html');
  expect(recipe.name).toBe('Erdbeer-Tiramisu');
});
test('Get Recipe | bbcgoodfood', async () => {
  const recipe = await getSchemaRecipe('https://www.bbcgoodfood.com/recipes/broken-biscuit-squares');
  expect(recipe.name).toBe('Broken biscuit squares');
});
