const PORT = 8080;
export const BASE_URL = `http://localhost:${PORT}`;

const BASE_URL_ASK = `${BASE_URL}/ask`;
const BASE_URL_OFFER = `${BASE_URL}/offer`;
const BASE_URL_USER = `${BASE_URL}/user`;

export const ENDPOINTS_ASK = {
  GET_ONE: (id: string) => `${BASE_URL_ASK}/${id}`,
  GET_ALL: `${BASE_URL_ASK}`,
  GET_ALL_BY_USER: (id: string) => `${BASE_URL_ASK}/user/${id}`,
  GET_ALL_BY_CURRENT_USER: `${BASE_URL_ASK}/user`,
  CREATE: `${BASE_URL_ASK}`,
  DELETE: (id: string) => `${BASE_URL_ASK}/${id}`,
  UPDATE: (id: string) => `${BASE_URL_ASK}/${id}`,
};

export const ENDPOINTS_OFFER = {
  GET_ONE: (id: string) => `${BASE_URL_OFFER}/${id}`,
  GET_ALL: `${BASE_URL_OFFER}/`,
  GET_ALL_BY_USER: (id: string) => `${BASE_URL_OFFER}/user/${id}`,
  GET_ALL_BY_CURRENT_USER: `${BASE_URL_OFFER}/user`,
  CREATE: `${BASE_URL_OFFER}`,
  DELETE: (id: string) => `${BASE_URL_OFFER}/${id}`,
  UPDATE: (id: string) => `${BASE_URL_OFFER}/${id}`,
};

export const ENDPOINTS_USER = {
  UPDATE_CURRENT: `${BASE_URL_USER}`,
  GET_CURRENT: `${BASE_URL_USER}`,
  GET: (id: string) => `${BASE_URL_USER}/${id}`,
};
