import { useAuth } from "@clerk/clerk-react";
import { Offer } from "../../../shared/types";
import {
  parseDateStringsA,
  deleteAuthed,
  getAuthed,
  getRequest,
  postAuthed,
  putAuthed,
} from "./utils";
import { ENDPOINTS_OFFER } from "./endpoints";
import {
  CreateOfferBody,
  CreateOfferResponse,
  DeleteOfferResponse,
  GetManyOfferResponse,
  GetOneOfferResponse,
  GetManyOptions,
  UpdateOfferBody,
  UpdateOfferResponse,
  FavoriteOfferResponse,
} from "../../../shared/apiTypes";
import { IAppStore, useAppStore } from "../appStore";
import { parseDateStrings } from "./utils";
import { IUserService, useUserService } from "./userService";

export interface IOfferService {
  fetchOffersByCurrentUser(options?: GetManyOptions): Promise<void>;
  fetchOffersByUser(id: string, options?: GetManyOptions): Promise<void>;
  getOfferById(id: string): Promise<Offer | null>;
  createOfferForCurrentUser(bodyObj: CreateOfferBody): Promise<Offer | null>;
  updateOfferForCurrentUser(
    id: string,
    bodyObj: UpdateOfferBody
  ): Promise<Offer | null>;
  deleteOfferForCurrentUser(id: string): Promise<Offer | null>;
  fetchOffers(options?: GetManyOptions): Promise<void>;
  fetchFavoriteOffersByCurrentUser(options?: GetManyOptions): Promise<void>;
  addFavoriteOffer(id: string): Promise<boolean>;
  removeFavoriteOffer(id: string): Promise<boolean>;
}

const OfferService = (
  getToken: () => Promise<string>,
  appStore: IAppStore,
  userService: IUserService
): IOfferService => ({
  fetchOffersByCurrentUser: async (options) => {
    const url = ENDPOINTS_OFFER.GET_MANY_BY_CURRENT_USER;
    const token = await getToken();
    const response = await getAuthed<GetManyOfferResponse>(url, token, options);
    if (!response) return;
    const offers = parseDateStringsA(response.offers);
    appStore.setOffers(offers);
    appStore.setCount({ offers: response.count });
  },
  fetchOffersByUser: async (id, options) => {
    const url = ENDPOINTS_OFFER.GET_MANY_BY_USER(id);
    const response = await getRequest<GetManyOfferResponse>(url, options);
    if (!response) return;
    const offers = parseDateStringsA(response.offers);
    appStore.setOffers(offers);
    appStore.setCount({ offers: response.count });
  },
  getOfferById: async (id) => {
    const url = ENDPOINTS_OFFER.GET_ONE(id);
    const token = await getToken();
    const response = await getAuthed<GetOneOfferResponse>(url, token);
    if (!response) return null;
    const offer = parseDateStrings(response);
    return offer;
  },
  createOfferForCurrentUser: async (bodyObj) => {
    const url = ENDPOINTS_OFFER.CREATE;
    const token = await getToken();
    const response = await postAuthed<CreateOfferResponse>(url, token, bodyObj);
    if (!response) return null;
    const offer = parseDateStrings(response);
    OfferService(getToken, appStore, userService).fetchOffers();
    userService.fetchCurrentUser();
    return offer;
  },
  updateOfferForCurrentUser: async (id, bodyObj) => {
    const url = ENDPOINTS_OFFER.UPDATE(id);
    const token = await getToken();
    const response = await putAuthed<UpdateOfferResponse>(url, token, bodyObj);
    if (!response) return null;
    const offer = parseDateStrings(response);
    OfferService(getToken, appStore, userService).fetchOffers();
    userService.fetchCurrentUser();
    return offer;
  },
  deleteOfferForCurrentUser: async (id) => {
    const url = ENDPOINTS_OFFER.DELETE(id);
    const token = await getToken();
    const response = await deleteAuthed<DeleteOfferResponse>(url, token);
    if (!response) return null;
    const offer = parseDateStrings(response);
    OfferService(getToken, appStore, userService).fetchOffers();
    userService.fetchCurrentUser();
    return offer;
  },
  fetchOffers: async (options) => {
    const url = ENDPOINTS_OFFER.GET_MANY;
    const response = await getRequest<GetManyOfferResponse>(url, options);
    if (!response) return;
    const offers = parseDateStringsA(response.offers);
    if (!offers) return;
    appStore.setOffers(offers);
    appStore.setCount({ offers: response.count });
  },
  fetchFavoriteOffersByCurrentUser: async (options) => {
    const url = ENDPOINTS_OFFER.GET_FAVORITED_BY_CURRENT_USER;
    const token = await getToken();
    const response = await getAuthed<GetManyOfferResponse>(url, token, options);
    if (!response) return;
    const offers = parseDateStringsA(response.offers);
    appStore.setFavoriteOffers(offers);
    appStore.setCount({ favoriteOffers: response.count });
  },
  addFavoriteOffer: async (id) => {
    if (!appStore.currentUser) {
      console.error("Current user has not been fetched.");
      return false;
    }
    const url = ENDPOINTS_OFFER.ADD_FAVORITE(id);
    const token = await getToken();

    const originalUser = structuredClone(appStore.currentUser);
    const optimisticUser = structuredClone(appStore.currentUser);
    optimisticUser.favoriteOffers = [...optimisticUser.favoriteOffers, id];
    appStore.setCurrentUser(optimisticUser);

    const response = await postAuthed<FavoriteOfferResponse>(url, token, {});
    if (!response) appStore.setCurrentUser(originalUser);
    OfferService(
      getToken,
      appStore,
      userService
    ).fetchFavoriteOffersByCurrentUser();
    return Boolean(response);
  },
  removeFavoriteOffer: async (id) => {
    if (!appStore.currentUser) {
      console.error("Current user has not been fetched.");
      return false;
    }
    const url = ENDPOINTS_OFFER.REMOVE_FAVORITE(id);
    const token = await getToken();

    const originalUser = structuredClone(appStore.currentUser);
    const optimisticUser = structuredClone(appStore.currentUser);
    optimisticUser.favoriteOffers = optimisticUser.favoriteOffers.filter(
      (offerId) => offerId !== id
    );
    OfferService(
      getToken,
      appStore,
      userService
    ).fetchFavoriteOffersByCurrentUser();
    appStore.setCurrentUser(optimisticUser);

    const response = await deleteAuthed<FavoriteOfferResponse>(url, token);
    if (!response) appStore.setCurrentUser(originalUser);
    return Boolean(response);
  },
});

export const useOfferService = (): IOfferService => {
  const { getToken } = useAuth();
  const appStore = useAppStore();
  const userSerivce = useUserService();

  const getTokenOrThrow = async () => {
    const token = await getToken();
    if (!token) throw new Error("Unable to fetch Clerk token.");
    return token;
  };

  const offerService = OfferService(getTokenOrThrow, appStore, userSerivce);
  return offerService;
};
