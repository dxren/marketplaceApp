import { useAuth } from "@clerk/clerk-react";
import { Offer } from "../../../shared/types";
import { parseDateStringsA, parseDateStrings, deleteAuthed, getAuthed, getRequest, postAuthed, putAuthed } from "./utils";
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

const OfferService = (getToken: () => Promise<string>, appStore: IAppStore, userSerivce: IUserService): IOfferService => ({
  fetchOffersByCurrentUser: async (options) => {
    const url = ENDPOINTS_OFFER.GET_MANY_BY_CURRENT_USER;
    const token = await getToken();
    const offers = parseDateStringsA(await getAuthed<GetManyOfferResponse>(url, token, options));
    if (!offers) return;
    appStore.setOffers(offers);
  },
  fetchOffersByUser: async (id, options) => {
    const url = ENDPOINTS_OFFER.GET_MANY_BY_USER(id);
    const offers = parseDateStringsA(await getRequest<GetManyOfferResponse>(url, options));
    if (!offers) return;
    appStore.setOffers(offers);
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
    const offer = parseDateStrings(await postAuthed<CreateOfferResponse>(url, token, bodyObj)) ?? null;
    OfferService(getToken, appStore, userSerivce).fetchOffers();
    userSerivce.fetchCurrentUser();
    return offer;
  },
  updateOfferForCurrentUser: async (id, bodyObj) => {
    const url = ENDPOINTS_OFFER.UPDATE(id);
    const token = await getToken();
    const offer = parseDateStrings(await putAuthed<UpdateOfferResponse>(url, token, bodyObj)) ?? null;
    OfferService(getToken, appStore, userSerivce).fetchOffers();
    userSerivce.fetchCurrentUser();
    return offer;
  },
  deleteOfferForCurrentUser: async (id) => {
    const url = ENDPOINTS_OFFER.DELETE(id);
    const token = await getToken();
    const offer = parseDateStrings(await deleteAuthed<DeleteOfferResponse>(url, token)) ?? null;
    OfferService(getToken, appStore, userSerivce).fetchOffers();
    userSerivce.fetchCurrentUser();
    return offer;
  },
  fetchOffers: async (options) => {
    const url = ENDPOINTS_OFFER.GET_MANY;
    const offers = parseDateStringsA(await getRequest<GetManyOfferResponse>(url, options));
    if (!offers) return;
    appStore.setOffers(offers);
  },
});

export const useOfferService = (): IOfferService => {
  const { getToken } = useAuth();
  const appStore = useAppStore();
  const userService = useUserService();

  const getTokenOrThrow = async () => {
    const token = await getToken();
    if (!token) throw new Error("Unable to fetch Clerk token.");
    return token;
  };

  const offerService = OfferService(getTokenOrThrow, appStore, userService);
  return offerService;
};
