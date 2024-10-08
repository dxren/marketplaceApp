const BASE_URL = import.meta.env.VITE_SERVER_URL;
if (!BASE_URL) throw new Error('Unable to load environment variable VITE_SERVER_URL.');

const BASE_URL_ASK = `${BASE_URL}/ask`;
const BASE_URL_OFFER = `${BASE_URL}/offer`;
const BASE_URL_USER = `${BASE_URL}/user`;
const BASE_URL_SOCIAL = `${BASE_URL}/social`;

export const ENDPOINTS_ASK = {
  GET_ONE: (id: string) => `${BASE_URL_ASK}/${id}`,
  GET_MANY: `${BASE_URL_ASK}`,
  GET_MANY_BY_USER: (id: string) => `${BASE_URL_ASK}/user/${id}`,
  GET_MANY_BY_CURRENT_USER: `${BASE_URL_ASK}/user`,
  CREATE: `${BASE_URL_ASK}`,
  DELETE: (id: string) => `${BASE_URL_ASK}/${id}`,
  UPDATE: (id: string) => `${BASE_URL_ASK}/${id}`,
  GET_FAVORITED_BY_CURRENT_USER: `${BASE_URL_ASK}/favoritedBy`,
  ADD_FAVORITE: (id: string) => `${BASE_URL_ASK}/favorite/${id}`,
  REMOVE_FAVORITE: (id: string) => `${BASE_URL_ASK}/favorite/${id}`,
};

export const ENDPOINTS_OFFER = {
  GET_ONE: (id: string) => `${BASE_URL_OFFER}/${id}`,
  GET_MANY: `${BASE_URL_OFFER}/`,
  GET_MANY_BY_USER: (id: string) => `${BASE_URL_OFFER}/user/${id}`,
  GET_MANY_BY_CURRENT_USER: `${BASE_URL_OFFER}/user`,
  CREATE: `${BASE_URL_OFFER}`,
  DELETE: (id: string) => `${BASE_URL_OFFER}/${id}`,
  UPDATE: (id: string) => `${BASE_URL_OFFER}/${id}`,
  GET_FAVORITED_BY_CURRENT_USER: `${BASE_URL_OFFER}/favoritedBy`,
  ADD_FAVORITE: (id: string) => `${BASE_URL_OFFER}/favorite/${id}`,
  REMOVE_FAVORITE: (id: string) => `${BASE_URL_OFFER}/favorite/${id}`,
};

export const ENDPOINTS_USER = {
    UPDATE_CURRENT: `${BASE_URL_USER}`,
    GET_CURRENT: `${BASE_URL_USER}`,
    GET: (id: string) => `${BASE_URL_USER}/${id}`,
};

export const ENDPOINTS_SOCIAL = {
    DELETE: (id: string) => `${BASE_URL_SOCIAL}/${id}`,
    CREATE: `${BASE_URL_SOCIAL}`,
    UPDATE: (id: string) => `${BASE_URL_SOCIAL}/${id}`,
};
