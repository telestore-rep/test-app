"use server";
import { teleStoreClient } from '@/shared/lib/telestoreClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const responseSid = teleStoreClient.Auth.GetSessionId();

    const url = "https://dev.tele.store:8081/trex/v1/wallet/get_history_transactions?currencies=TeleUSD";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `sid=${responseSid}`,
      },
    });

    if (!response.ok) {
      console.error("API error:", response.statusText);
      return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status });
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