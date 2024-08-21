import { useAuth } from "@clerk/clerk-react";
import { Ask } from "../../../shared/types";
import {
  parseDateStringsA,
  deleteAuthed,
  getAuthed,
  getRequest,
  postAuthed,
  putAuthed,
} from "./utils";
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
import { IAppStore, useAppStore } from "../appStore";
import { parseDateStrings } from "./utils";
import { IUserService, useUserService } from "./userService";

export interface IAskService {
  fetchAsksByCurrentUser(options?: GetManyOptions): Promise<void>;
  fetchAsksByUser(id: string, options?: GetManyOptions): Promise<void>;
  getAskById(id: string): Promise<Ask | null>;
  createAskForCurrentUser(bodyObj: CreateAskBody): Promise<Ask | null>;
  updateAskForCurrentUser(
    id: string,
    bodyObj: UpdateAskBody
  ): Promise<Ask | null>;
  deleteAskForCurrentUser(id: string): Promise<Ask | null>;
  fetchAsks(options?: GetManyOptions): Promise<void>;
  fetchAsksFavoritedByUser(id: string, options?: GetManyOptions): Promise<void>;
}

const AskService = (
  getToken: () => Promise<string>,
  appStore: IAppStore,
  userService: IUserService
): IAskService => ({
  fetchAsksByCurrentUser: async (options) => {
    const url = ENDPOINTS_ASK.GET_MANY_BY_CURRENT_USER;
    const token = await getToken();
    const response = await getAuthed<GetManyAskResponse>(url, token, options);
    if (!response) return;
    const asks = parseDateStringsA(response.asks);
    appStore.setAsks(asks);
    appStore.setCount({ asks: response.count });
  },
  fetchAsksByUser: async (id, options) => {
    const url = ENDPOINTS_ASK.GET_MANY_BY_USER(id);
    const response = await getRequest<GetManyAskResponse>(url, options);
    if (!response) return;
    const asks = parseDateStringsA(response.asks);
    appStore.setAsks(asks);
    appStore.setCount({ asks: response.count });
  },
  getAskById: async (id) => {
    const url = ENDPOINTS_ASK.GET_ONE(id);
    const token = await getToken();
    const response = await getAuthed<GetOneAskResponse>(url, token);
    if (!response) return null;
    const ask = parseDateStrings(response);
    return ask;
  },
  createAskForCurrentUser: async (bodyObj) => {
    const url = ENDPOINTS_ASK.CREATE;
    const token = await getToken();
    const response = await postAuthed<CreateAskResponse>(url, token, bodyObj);
    if (!response) return null;
    const ask = parseDateStrings(response);
    AskService(getToken, appStore, userService).fetchAsks();
    userService.fetchCurrentUser();
    return ask;
  },
  updateAskForCurrentUser: async (id, bodyObj) => {
    const url = ENDPOINTS_ASK.UPDATE(id);
    const token = await getToken();
    const response = await putAuthed<UpdateAskResponse>(url, token, bodyObj);
    if (!response) return null;
    const ask = parseDateStrings(response);
    AskService(getToken, appStore, userService).fetchAsks();
    userService.fetchCurrentUser();
    return ask;
  },
  deleteAskForCurrentUser: async (id) => {
    const url = ENDPOINTS_ASK.DELETE(id);
    const token = await getToken();
    const response = await deleteAuthed<DeleteAskResponse>(url, token);
    if (!response) return null;
    const ask = parseDateStrings(response);
    AskService(getToken, appStore, userService).fetchAsks();
    userService.fetchCurrentUser();
    return ask;
  },
  fetchAsks: async (options) => {
    const url = ENDPOINTS_ASK.GET_MANY;
    const response = await getRequest<GetManyAskResponse>(url, options);
    if (!response) return;
    const asks = parseDateStringsA(response.asks);
    appStore.setAsks(asks);
    appStore.setCount({asks: response.count});
  },
  fetchAsksFavoritedByUser: async (id, options) => {
    const url = ENDPOINTS_ASK.GET_FAVORITED_BY_USER(id);
    const response = await getRequest<GetManyAskResponse>(url, options);
    if (!response) return;
    const asks = parseDateStringsA(response.asks);
    appStore.setAsks(asks);
    appStore.setCount({ asks: response.count });
  },
});

export const useAskService = (): IAskService => {
  const { getToken } = useAuth();
  const appStore = useAppStore();
  const userSerivce = useUserService();

  const getTokenOrThrow = async () => {
    const token = await getToken();
    if (!token) throw new Error("Unable to fetch Clerk token.");
    return token;
  };

  const askService = AskService(getTokenOrThrow, appStore, userSerivce);
  return askService;
};
