"use server";
import { EventSource } from "eventsource";
import { NextResponse } from "next/server";
import { sseStorage } from "@/shared/storage";
import { setEventSource } from "@/shared/lib/eventSource";
import { EVENT_SOURCE_URL } from "@/shared/constants/server";
import { teleStoreClient } from "@/shared/lib/telestoreClient";

function getEsLink(sid: string) {
  return new EventSource(EVENT_SOURCE_URL, {
    fetch: (input, init) =>
      fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Cookie: `sid=${sid}`,
        },
      }),
  });
}

function setupEventSourceHandlers(es: EventSource) {
  es.onmessage = async (event: MessageEvent) => {
    sseStorage.Add(event.data);
  };
  es.onerror = async (error: ErrorEvent) => {
    if (error.error?.code === 401) {
      const reconnected = await teleStoreClient.Connect(true);

      if (!reconnected) {
        throw new Error("Unauthorized. Reconnection attempt failed.");
      }

      es.close();

      const newEs = getEsLink(teleStoreClient.Auth.GetSessionId() ?? "");
      setupEventSourceHandlers(newEs);
      setEventSource(newEs);
    }
  };
}

export async function GET() {
  try {
    const sid = teleStoreClient.Auth.GetSessionId();

    if (!sid) {
      return NextResponse.json({}, { status: 401 });
    }

    const esLink = getEsLink(sid);
    setupEventSourceHandlers(esLink);
    setEventSource(esLink);

    return NextResponse.json("Success", { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
