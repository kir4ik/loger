import request from 'request';
import keys from '../config/keys';

const url = `https://www.googleapis.com/customsearch/v1?key=${
  keys.apiKeyCSE
}&cx=${keys.cx}&q=`;
const cache = new Map();

export default query => {
  if (cache.has(query)) return Promise.resolve(cache.get(query));

  return new Promise((resolve, reject) => {
    request(encodeURI(url + query), (err, res, body) => {
      if (err) return reject(err);
      if (res.statusCode === 200) {
        const data = JSON.parse(body);
        cache.set(query, data);
        return resolve(data);
      }

      return reject('Что-то пошло не так');
    });
  });
};
