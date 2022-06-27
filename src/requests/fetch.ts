import { axios } from './axiosInit';

export async function fetchImage(url: string) {
  return axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

export async function fetchHTML(url: string) : Promise<string> {
  return (await axios.get(url)).data;
}
