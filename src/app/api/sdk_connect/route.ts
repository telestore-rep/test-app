"use server";
import { NextResponse } from 'next/server';
import { teleStoreClient } from '@/shared/lib/telestoreClient';

export async function GET() {
  try {
    const isConnected = await teleStoreClient.Connect();

    if (!isConnected) {
      console.error("Can't connect to Telestore API");
      return NextResponse.json(
        { error: "Can't connect to Telestore API" },
        { status: 500 }
      );
    }

    return NextResponse.json({isConnected}, { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
