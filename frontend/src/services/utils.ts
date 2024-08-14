export const postAuthed = async <ResponseType extends object, RequestBody extends object = object>(url: string, token: string, bodyObj: RequestBody): Promise<ResponseType | null> => {
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
    const result = await response.json() as ResponseType;
    return result;
}

export const putAuthed = async <ResponseType extends object, RequestBody extends object = object>(url: string, token: string, bodyObj: RequestBody): Promise<ResponseType | null> => {
    const body = JSON.stringify(bodyObj);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const method = 'PUT';
    const response = await fetch(url, {body, headers, method});
    if (!response.ok) {
        console.error(`Failed to fetch: PUT ${url}`);
        return null;
    }
    const result = await response.json() as ResponseType;
    return result;
}

export const deleteAuthed = async <ResponseType extends object>(url: string, token: string): Promise<ResponseType | null> => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const method = 'DELETE';
    const response = await fetch(url, {headers, method});
    if (!response.ok) {
        console.error(`Failed to fetch: DELETE ${url}`);
        return null;
    }
    const result = await response.json();
    return result;
}

export const getAuthed = async <ResponseType extends object>(url: string, token: string): Promise<ResponseType | null> => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const method = 'GET';
    const response = await fetch(url, {headers, method});
    if (!response.ok) {
        console.error(`Failed to fetch: GET ${url}`);
        return null;
    }
    const result = await response.json();
    return result;
}