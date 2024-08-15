import { useAuth } from "@clerk/clerk-react";
import { Offer } from "../../../shared/types";
import { deleteAuthed, getAuthed, postAuthed, putAuthed } from "./utils";
import { ENDPOINTS_OFFER } from "./endpoints";
import {
  CreateOfferBody,
  CreateOfferResponse,
  DeleteOfferResponse,
  GetManyOfferResponse,
  GetOneOfferResponse,
  UpdateOfferBody,
  UpdateOfferResponse,
} from "../../../shared/apiTypes";

export interface IOfferService {
  getOffersByCurrentUser(): Promise<Offer[] | null>;
  getOffersByUser(id: string): Promise<Offer[] | null>;
  getOfferById(id: string): Promise<Offer | null>;
  createOfferForCurrentUser(
    title: string,
    description?: string
  ): Promise<Offer | null>;
  updateOfferForCurrentUser(
    id: string,
    description: string
  ): Promise<Offer | null>;
  deleteOfferForCurrentUser(id: string): Promise<Offer | null>;
  getOffers(): Promise<Offer[] | null>;
}

const OfferService = (getToken: () => Promise<string>): IOfferService => ({
  getOffersByCurrentUser: async () => {
    const url = ENDPOINTS_OFFER.GET_ALL_BY_CURRENT_USER;
    const token = await getToken();
    const offers = await getAuthed<GetManyOfferResponse>(url, token);
    return offers;
  },
  getOffersByUser: async (id: string) => {
    const url = ENDPOINTS_OFFER.GET_ALL_BY_USER(id);
    const token = await getToken();
    const offers = await getAuthed<GetManyOfferResponse>(url, token);
    return offers;
  },
  getOfferById: async (id: string) => {
    const url = ENDPOINTS_OFFER.GET_ONE(id);
    const token = await getToken();
    const offer = await getAuthed<GetOneOfferResponse>(url, token);
    return offer;
  },
  createOfferForCurrentUser: async (title: string, description?: string) => {
    const url = ENDPOINTS_OFFER.CREATE;
    const token = await getToken();
    const bodyObj: CreateOfferBody = { title, description };
    const offer = await postAuthed<CreateOfferResponse>(url, token, bodyObj);
    return offer;
  },
  updateOfferForCurrentUser: async (id: string, description: string) => {
    const url = ENDPOINTS_OFFER.UPDATE(id);
    const token = await getToken();
    const bodyObj: UpdateOfferBody = { description };
    const offer = await putAuthed<UpdateOfferResponse>(url, token, bodyObj);
    return offer;
  },
  deleteOfferForCurrentUser: async (id: string) => {
    const url = ENDPOINTS_OFFER.DELETE(id);
    const token = await getToken();
    const offer = await deleteAuthed<DeleteOfferResponse>(url, token);
    return offer;
  },
  getOffers: async () => {
    const url = ENDPOINTS_OFFER.GET_ALL;
    const token = await getToken();
    const offers = await getAuthed<GetManyOfferResponse>(url, token);
    return offers;
  },
});

export const useOfferService = (): IOfferService => {
  const { getToken } = useAuth();

  const getTokenOrThrow = async () => {
    const token = await getToken();
    if (!token) throw new Error("Unable to fetch Clerk token.");
    return token;
  };

  const offerService = OfferService(getTokenOrThrow);
  return offerService;
};
