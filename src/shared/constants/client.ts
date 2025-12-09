"use client";

export const API_URL: string = "https://dev.tele.store:8081";
export const APP_URL_ID: string = "1758874298367440011";
export const APP_ID: string = "1739197350166203";
export const PUBLIC_USER_KEY: string = "x_FtUrhBftWeZmAKhj4RFssYm2qL2fGySbD_JpgF-_c";

export function getBaseUrl(): string {
    const proxyId = localStorage.getItem("proxy_id");

    if (!proxyId) return API_URL;

    // Разбиваем URL на части
    const url = new URL(API_URL);
    const hostParts = url.hostname.split(".");

    // Добавляем proxyId как префикс
    hostParts.unshift(proxyId);

    // Формируем новый хост и возвращаем полный URL
    const newHost = hostParts.join(".");
    return `${url.protocol}//${newHost}${url.port ? ":" + url.port : ""}`;
}
