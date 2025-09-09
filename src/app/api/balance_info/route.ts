"use server";
import { fetchWithReconnect } from '@/shared/lib/fetchWithReconnect';
import { teleStoreClient } from '@/shared/lib/telestoreClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = "https://dev.tele.store:8081/trex/v1/wallet/get_balance?currency=TeleUSD";
    const response = await fetchWithReconnect(url, { method: "GET" });

    if (!response.ok) {
      console.error("API error:", response.statusText);
      return NextResponse.json({
        error: "Failed to fetch data",
        sid: teleStoreClient.Auth.GetSessionId()
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}