"use server";

export async function getWebhookMessages() {
  const res = await fetch("./api/webhook", { cache: "no-store" });
  return res.json();
}
