import { getRecipe } from '../index';

// German
test('Get Recipe | chefkoch', async () => {
  const recipe = await getRecipe('https://www.chefkoch.de/rezepte/583381157461209/Ravioli-mit-gebratenen-Garnelen-und-Spargel-in-Kraeutersahne.html');
  //console.log(recipe);
  expect(recipe?.title).toBe('Ravioli mit gebratenen Garnelen und Spargel in Kräutersahne');
});
test('Get Recipe | lecker', async () => {
  const recipe = await getRecipe('https://www.lecker.de/erdbeer-tiramisu-83771.html');
  expect(recipe?.title).toBe('Erdbeer-Tiramisu');
});
test('Get Recipe | einfachbacken', async () => {
  const recipe = await getRecipe('https://www.einfachbacken.de/rezepte/pizzateig-grundrezept-original-wie-vom-italiener');
  expect(recipe?.title).toBe('Pizzateig Grundrezept - Original wie vom Italiener');
});

// English
test('Get Recipe | bbcgoodfood', async () => {
  const recipe = await getRecipe('https://www.bbcgoodfood.com/recipes/broken-biscuit-squares');
  expect(recipe?.title).toBe('Broken biscuit squares');
});
test('Get Recipe | allrecipes', async () => {
  const recipe = await getRecipe('https://www.allrecipes.com/recipe/285407/lemon-vanilla-french-toast/');
  expect(recipe?.title).toBe('Lemon-Vanilla French Toast');
});

test('Get Recipe | juliasalbum', async () =>  {
  const recipe = await getRecipe('https://juliasalbum.com/spinach-ravioli-cream-sauce-ricotta-cheese-filling-cherry-tomatoes-recipe/');
  expect(recipe?.title).toBe('Spinach Ravioli with Ricotta Cheese Filling, in Tomato Cream Sauce');
});
