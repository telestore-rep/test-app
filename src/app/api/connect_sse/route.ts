"use server";
import { EventSource } from "eventsource"; 
import { NextResponse } from 'next/server';
import { sseStorage } from '@/shared/storage';
import { setEventSource } from '@/shared/lib/eventSource';
import { EVENT_SOURCE_URL } from '@/shared/constants/server';
import { teleStoreClient } from "@/shared/lib/telestoreClient";

export async function GET() {
  try {
    const sid = teleStoreClient.Auth.GetSessionId();

    if (!sid) {
      return NextResponse.json({}, { status: 401 });
    }

    let esLink = new EventSource(EVENT_SOURCE_URL, {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          headers: {
            ...init?.headers,
            Cookie: `sid=${sid}`
          }
        })
    });

    esLink.onmessage = async (event: MessageEvent) => {
      sseStorage.Add(event.data);
    }

    esLink.onerror = (error: unknown) => {
      console.error("EventSource error:", error);
    }

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
