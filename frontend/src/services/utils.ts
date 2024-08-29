export const postRequest = async <
  ResponseType extends any,
  RequestBody extends any = any
>(
  url: string,
  bodyObj: RequestBody
): Promise<ResponseType | null> => {
  const body = JSON.stringify(bodyObj);
  const headers = {
    "Content-Type": "application/json",
  };
  const method = "POST";
  const response = await fetch(url, { body, headers, method });
  if (!response.ok) {
    console.error(`Failed to fetch: POST ${url}`);
    return null;
  }
  const result = (await response.json()) as ResponseType;
  return result;
};

export const putRequest = async <
  ResponseType extends any,
  RequestBody extends any = any
>(
  url: string,
  bodyObj: RequestBody
): Promise<ResponseType | null> => {
  const body = JSON.stringify(bodyObj);
  const headers = {
    "Content-Type": "application/json",
  };
  const method = "PUT";

  try {
    const response = await fetch(url, { body, headers, method });

    if (!response.ok) {
      console.error(
        `Failed to fetch: PUT ${url}, Status: ${response.status}, StatusText: ${response.statusText}`
      );
      return null;
    }

    const result = (await response.json()) as ResponseType;
    return result;
  } catch (error) {
    console.error(`Error during PUT request to ${url}:`, error);
    return null;
  }
};

export const deleteRequest = async <ResponseType extends any>(
  url: string
): Promise<ResponseType | null> => {
  const headers = {
    "Content-Type": "application/json",
  };
  const method = "DELETE";
  const response = await fetch(url, { headers, method });
  if (!response.ok) {
    console.error(`Failed to fetch: DELETE ${url}`);
    return null;
  }
  const result = await response.json();
  return result;
};

export const getRequest = async <ResponseType extends any>(
  baseUrl: string,
  query?: Record<string, any>
): Promise<ResponseType | null> => {
  const headers = {
    "Content-Type": "application/json",
  };
  const parsedQuery = query ? parseQuery(query) : "";
  const url = `${baseUrl}${parsedQuery}`;
  const method = "GET";
  const response = await fetch(url, { headers, method });
  if (!response.ok) {
    console.error(`Failed to fetch: GET ${url}`);
    return null;
  }
  const result = await response.json();
  return result;
};

export const postAuthed = async <
  ResponseType extends any,
  RequestBody extends any = any
>(
  url: string,
  token: string,
  bodyObj: RequestBody
): Promise<ResponseType | null> => {
  const body = JSON.stringify(bodyObj);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const method = "POST";
  const response = await fetch(url, { body, headers, method });
  if (!response.ok) {
    console.error(`Failed to fetch: POST ${url}`);
    return null;
  }
  const result = (await response.json()) as ResponseType;
  return result;
};

export const putAuthed = async <
  ResponseType extends any,
  RequestBody extends any = any
>(
  url: string,
  token: string,
  bodyObj: RequestBody
): Promise<ResponseType | null> => {
  const body = JSON.stringify(bodyObj);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const method = "PUT";

  try {
    const response = await fetch(url, { body, headers, method });

    if (!response.ok) {
      console.error(
        `Failed to fetch: PUT ${url}, Status: ${response.status}, StatusText: ${response.statusText}`
      );
      return null;
    }

    const result = (await response.json()) as ResponseType;
    return result;
  } catch (error) {
    console.error(`Error during PUT request to ${url}:`, error);
    return null;
  }
};

export const deleteAuthed = async <ResponseType extends any>(
  url: string,
  token: string
): Promise<ResponseType | null> => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const method = "DELETE";
  const response = await fetch(url, { headers, method });
  if (!response.ok) {
    console.error(`Failed to fetch: DELETE ${url}`);
    return null;
  }
  const result = await response.json();
  return result;
};

export const getAuthed = async <ResponseType extends any>(
  baseUrl: string,
  token: string,
  query?: Record<string, any>
): Promise<ResponseType | null> => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const parsedQuery = query ? parseQuery(query) : "";
  const url = `${baseUrl}${parsedQuery}`;
  const method = "GET";
  const response = await fetch(url, { headers, method });
  if (!response.ok) {
    console.error(`Failed to fetch: GET ${url}`);
    return null;
  }
  const result = await response.json();
  return result;
};

const parseQuery = (query: Record<string, any>): string =>
  "?".concat(
    Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")
  );

export const parseDateStrings = <T extends { createdAt: string }>(obj: T) =>
  obj && { ...obj, createdAt: new Date(obj.createdAt) };
export const parseDateStringsA = <T extends { createdAt: string }>(obj: T[]) =>
  obj &&
  obj.map((item: T) => ({ ...item, createdAt: new Date(item.createdAt) }));
