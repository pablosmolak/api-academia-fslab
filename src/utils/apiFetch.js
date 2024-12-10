import messages from "./mensagens.js";
import { APIError } from "./wrapException.js"

export const apiFetch = async (nomeApi, urlApi, token, method, route, body, contentType = "application/json") => {
    let url = urlApi + route;
    let bodyToSend = undefined;

    if (!body) {
        
    } else if (method === "GET") {
        url += "?" + new URLSearchParams(body);
    } else {
        if(contentType === "application/x-www-form-urlencoded") {
            bodyToSend = new URLSearchParams(body);
        } else if (contentType === "application/json") {
            bodyToSend = JSON.stringify(body);
        } else if (contentType === "text/plain") {
            bodyToSend = body;
        }
    }

    let apiResponse;
    try {
        apiResponse = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": contentType,
                ...( token && {"Authorization": `Bearer ${token}`})
            },
            body: bodyToSend
        }).then(fetchRes => {
            const responseContentType = fetchRes.headers.get("content-type");
            if(responseContentType && responseContentType.includes("application/json")) {
                return fetchRes.json().then(json => {
                    const code = json.code || 400;
                    const message = json.message || messages.httpCodes[code];
                
                    if (json.error !== false) {
                        if (Array.isArray(json.errors)) {
                            throw new APIError(json.errors, code);
                        } else {
                            throw new APIError("Erro desconhecido na API " + nomeApi + ": "+message, code);
                        }
                    } else {
                        return json;
                    }
                });
            } else {
                return fetchRes.text();
            }
        });
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        } else {
            throw new Error("Erro ao fazer requisição para a API " + nomeApi, { cause: error });
        }
    }

    return apiResponse;
};
