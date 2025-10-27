"use server";
import { NextRequest, NextResponse } from 'next/server';
import { teleStoreClient } from '@/shared/lib/telestoreClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await teleStoreClient.CreateInvoice(body);

    if (response.error) {
      console.error("Telestore API error:", response.error);
      return NextResponse.json(response.error, { status: 500 });
    }

    return NextResponse.json(response.result, { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
