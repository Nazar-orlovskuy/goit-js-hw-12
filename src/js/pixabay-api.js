import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '52456910-518eb224c41e0afc98afec318';

export async function getImagesByQuery(query, page = 1, perPage = 15) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page,
  };

  const { data } = await axios.get(BASE_URL, { params });
  return data;
}
