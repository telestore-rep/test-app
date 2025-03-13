"use server";
import { teleStoreClient } from '@/shared/lib/telestoreClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const responseSid = teleStoreClient.Auth.GetSessionId();
    
    if (!responseSid) {
      return NextResponse.json({ error: "Missing sid cookie" }, { status: 400 });
    }

    return NextResponse.json(responseSid, { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}