import { axios } from './axiosInit';
import * as cheerio from 'cheerio';

export async function fetchImage(url: string) {
  return axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

export async function fetchSchemas(url: string) {
  const html = (await axios.get(url)).data;

  const $ = cheerio.load(html);

  let definitions: any[] = [];
  const element = $("script[type='application/ld+json']");
  element.each((i, rawDefinition) => {

    const raw = $(rawDefinition).contents().text().trim();
    try {

      const definition = JSON.parse(raw);
      definitions.push(definition);

    } catch (e) {
      console.log(e);
    }
  });
  return definitions;
}
