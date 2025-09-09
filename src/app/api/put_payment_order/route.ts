"use server";
import { fetchWithReconnect } from '@/shared/lib/fetchWithReconnect';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const url = "https://dev.tele.store:8081/acquiring/v1/put_payment_order";
    const body = await request.json();
    const response = await fetchWithReconnect(url, { method: "POST", body: JSON.stringify(body) });

    if (response.status !== 200) {
      console.error("Telestore API error:", response.status);
      return NextResponse.json(await response.json(), { status: 500 });
    }

    return NextResponse.json((await response.json()).result, { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
