import { useAuth } from "@clerk/clerk-react";
import { Offer } from "../../../shared/types";
import { parseDateStringsA, deleteAuthed, getAuthed, getRequest, postAuthed, putAuthed } from "./utils";
import { ENDPOINTS_OFFER } from "./endpoints";
import {
  CreateOfferBody,
  CreateOfferResponse,
  DeleteOfferResponse,
  GetManyOfferResponse,
  GetManyOptions,
  UpdateOfferBody,
  UpdateOfferResponse,
} from "../../../shared/apiTypes";
import { IAppStore, useAppStore } from "../appStore";
import { parseDateStrings } from "./utils";
import { IUserService, useUserService } from "./userService";

export interface IOfferService {
  fetchOffersByCurrentUser(options?: GetManyOptions): Promise<void>;
  fetchOffersByUser(id: string, options?: GetManyOptions): Promise<void>;
//   getOfferById(id: string): Promise<Offer | null>;
  createOfferForCurrentUser(bodyObj: CreateOfferBody): Promise<Offer | null>;
  updateOfferForCurrentUser(id: string, bodyObj: UpdateOfferBody): Promise<Offer | null>;
  deleteOfferForCurrentUser(id: string): Promise<Offer | null>;
  fetchOffers(options?: GetManyOptions): Promise<void>;
}

const OfferService = (getToken: () => Promise<string>, appStore: IAppStore, userService: IUserService): IOfferService => ({
  fetchOffersByCurrentUser: async (options) => {
    const url = ENDPOINTS_OFFER.GET_MANY_BY_CURRENT_USER;
    const token = await getToken();
    const response = await getAuthed<GetManyOfferResponse>(url, token, options)
    if (!response) return;
    const offers = parseDateStringsA(response.offers);
    appStore.setOffers(offers);
    appStore.setCount({offers: response.count});
  },
  fetchOffersByUser: async (id, options) => {
    const url = ENDPOINTS_OFFER.GET_MANY_BY_USER(id);
    const response = await getRequest<GetManyOfferResponse>(url, options)
    if (!response) return;
    const offers = parseDateStringsA(response.offers);
    appStore.setOffers(offers);
    appStore.setCount({offers: response.count});
  },
//   getOfferById: async (id) => {
//     const url = ENDPOINTS_OFFER.GET_ONE(id);
//     const token = await getToken();
//     const offer = await getAuthed<GetOneOfferResponse>(url, token);
//     return offer;
//   },
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
    appStore.setCount({offers: response.count});
  }
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
