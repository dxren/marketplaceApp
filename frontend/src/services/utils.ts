import { z } from "zod";

export const postRequest = async <T extends z.ZodType>(url: string, bodyObj: unknown, responseSchema: T): Promise<z.infer<T> | null> => {
    const body = JSON.stringify(bodyObj);
    const headers = {
        'Content-Type': 'application/json',
    };
    const method = 'POST';
    const response = await fetch(url, {body, headers, method});
    if (!response.ok) {
        console.error(`Failed to fetch: POST ${url}`);
        return null;
    }
    try {
        const result = responseSchema.parse(await response.json());
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const putRequest = async <T extends z.ZodType>(url: string, bodyObj: unknown, responseSchema: T): Promise<z.infer<T> | null> => {
    const body = JSON.stringify(bodyObj);
    const headers = {
        'Content-Type': 'application/json',
    };
    const method = 'PUT';

    const response = await fetch(url, { body, headers, method });
    if (!response.ok) {
        console.error(`Failed to fetch: PUT ${url}, Status: ${response.status}, StatusText: ${response.statusText}`);
        return null;
    }
    
    try {
        const result = responseSchema.parse(await response.json());
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const deleteRequest = async <T extends z.ZodType>(url: string, responseSchema?: T): Promise<(T extends z.ZodType ? z.infer<T> : null) | null> => {
    const headers = {
        'Content-Type': 'application/json',
    };
    const method = 'DELETE';
    const response = await fetch(url, {headers, method});
    if (!response.ok) {
        console.error(`Failed to fetch: DELETE ${url}`);
        return null;
    }
    try {
        const result = responseSchema?.parse(await response.json()) ?? null;
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const getRequest = async <T extends z.ZodType>(baseUrl: string, responseSchema: T, query?: Record<string, any>): Promise<z.infer<T> | null> => {
    const headers = {
        'Content-Type': 'application/json',
    };
    const parsedQuery = query ? parseQuery(query) : '';
    const url = `${baseUrl}${parsedQuery}`;
    const method = 'GET';
    const response = await fetch(url, {headers, method});
    if (!response.ok) {
        console.error(`Failed to fetch: GET ${url}`);
        return null;
    }
    try {
        const result = responseSchema.parse(await response.json());
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const postAuthed = async <T extends z.ZodType>(url: string, token: string, bodyObj: unknown, responseSchema: T): Promise<z.infer<T> | null> => {
    const body = JSON.stringify(bodyObj);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const method = 'POST';
    const response = await fetch(url, {body, headers, method});
    if (!response.ok) {
        console.error(`Failed to fetch: POST ${url}`);
        return null;
    }
    try {
        const result = responseSchema.parse(await response.json());
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const putAuthed = async <T extends z.ZodType>(url: string, token: string, bodyObj: unknown, responseSchema: T): Promise<z.infer<T> | null> => {
    const body = JSON.stringify(bodyObj);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const method = 'PUT';

    const response = await fetch(url, { body, headers, method });
    if (!response.ok) {
        console.error(`Failed to fetch: PUT ${url}, Status: ${response.status}, StatusText: ${response.statusText}`);
        return null;
    }

    try {
        const result = responseSchema.parse(await response.json());
        return result;
    } catch (error) {
        console.error(`Error during PUT request to ${url}:`, error);
        return null;
    }
}

export const deleteAuthed = async <T extends z.ZodType>(url: string, token: string, responseSchema?: T): Promise<(T extends z.ZodType ? z.infer<T> : null) | null> => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const method = 'DELETE';
    const response = await fetch(url, {headers, method});
    if (!response.ok) {
        console.error(`Failed to fetch: DELETE ${url}`);
        return null;
    } try {
        const result = responseSchema?.parse(await response.json()) ?? null;
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const getAuthed = async <T extends z.ZodType>(baseUrl: string, token: string, responseSchema: T, query?: Record<string, any>): Promise<z.infer<T> | null> => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const parsedQuery = query ? parseQuery(query) : '';
    const url = `${baseUrl}${parsedQuery}`;
    const method = 'GET';
    const response = await fetch(url, {headers, method});
    if (!response.ok) {
        console.error(`Failed to fetch: GET ${url}`);
        return null;
    }
    try {
        const result = responseSchema.parse(await response.json());
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}

const parseQuery = (query: Record<string, any>): string =>
    '?'.concat(
    Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
    );