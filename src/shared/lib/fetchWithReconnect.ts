import { teleStoreClient } from "./telestoreClient";

export async function fetchWithReconnect(url: string, init: RequestInit = {}): Promise<Response> {
    const getSessionId = () => teleStoreClient.Auth.GetSessionId();

    // Первая попытка
    let response = await fetch(url, {
        ...init,
        headers: {
            ...init.headers,
            "Content-Type": "application/json",
            Cookie: `sid=${getSessionId()}`,
        },
    });

    if (response.status === 401) {
        console.log("Got 401. Trying to reconnect...");

        // Попытка переподключения
        const reconnected = await teleStoreClient.Connect(true);

        if (!reconnected) {
            throw new Error("Unauthorized. Reconnection attempt failed.");
        }

        // Повторный запрос с новым sid
        response = await fetch(url, {
            ...init,
            headers: {
                ...init.headers,
                "Content-Type": "application/json",
                Cookie: `sid=${getSessionId()}`,
            },
        });
    }

    return response;
}
