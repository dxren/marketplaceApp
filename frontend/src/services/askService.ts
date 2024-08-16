import { useAuth } from "@clerk/clerk-react";
import { Ask } from "../../../shared/types";
import { deleteAuthed, getAuthed, postAuthed, putAuthed } from "./utils";
import { ENDPOINTS_ASK } from "./endpoints";
import {
  CreateAskBody,
  CreateAskResponse,
  DeleteAskResponse,
  GetManyAskResponse,
  GetManyOptions,
  GetOneAskResponse,
  UpdateAskBody,
  UpdateAskResponse,
} from "../../../shared/apiTypes";

export interface IAskService {
  getAsksByCurrentUser(options?: GetManyOptions): Promise<Ask[] | null>;
  getAsksByUser(id: string, options?: GetManyOptions): Promise<Ask[] | null>;
  getAskById(id: string): Promise<Ask | null>;
  createAskForCurrentUser(bodyObj: CreateAskBody): Promise<Ask | null>;
  updateAskForCurrentUser(id: string, bodyObj: UpdateAskBody): Promise<Ask | null>;
  deleteAskForCurrentUser(id: string): Promise<Ask | null>;
  getAsks(options?: GetManyOptions): Promise<Ask[] | null>;
}

const AskService = (getToken: () => Promise<string>): IAskService => ({
  getAsksByCurrentUser: async (options) => {
    const url = ENDPOINTS_ASK.GET_MANY_BY_CURRENT_USER;
    const token = await getToken();
    const asks = await getAuthed<GetManyAskResponse>(url, token, options);
    return asks;
  },
  getAsksByUser: async (id, options) => {
    const url = ENDPOINTS_ASK.GET_MANY_BY_USER(id);
    const token = await getToken();
    const asks = await getAuthed<GetManyAskResponse>(url, token, options);
    return asks;
  },
  getAskById: async (id) => {
    const url = ENDPOINTS_ASK.GET_ONE(id);
    const token = await getToken();
    const ask = await getAuthed<GetOneAskResponse>(url, token);
    return ask;
  },
  createAskForCurrentUser: async (bodyObj) => {
    const url = ENDPOINTS_ASK.CREATE;
    const token = await getToken();
    const ask = await postAuthed<CreateAskResponse>(url, token, bodyObj);
    return ask;
  },
  updateAskForCurrentUser: async (id, bodyObj) => {
    const url = ENDPOINTS_ASK.UPDATE(id);
    const token = await getToken();
    const ask = await putAuthed<UpdateAskResponse>(url, token, bodyObj);
    return ask;
  },
  deleteAskForCurrentUser: async (id) => {
    const url = ENDPOINTS_ASK.DELETE(id);
    const token = await getToken();
    const ask = await deleteAuthed<DeleteAskResponse>(url, token);
    return ask;
  },
  getAsks: async (options) => {
    const url = ENDPOINTS_ASK.GET_MANY;
    const token = await getToken();
    const asks = await getAuthed<GetManyAskResponse>(url, token, options);
    return asks;
  },
});

export const useAskService = (): IAskService => {
  const { getToken } = useAuth();

  const getTokenOrThrow = async () => {
    const token = await getToken();
    if (!token) throw new Error("Unable to fetch Clerk token.");
    return token;
  };

  const askService = AskService(getTokenOrThrow);
  return askService;
};
