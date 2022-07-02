# schema-recipes

This library provides functions to retrieve recipe data from any website URL. The website data must be in schema.org format https://schema.org/.

The recipe schema data can be converted into a structured recipe object.

Get the recipe as a structured object:
```JS
const recipe = await getRecipe('https://<example.com/recipe>');
```

Get only the schema.org recipe format:
```JS
const recipe = await getSchemaRecipe('https://<example.com/recipe>');
```

Get a website info in the schema.org format:
```JS
const recipe = await getSchemaWebSite('https://<example.com>');
```
