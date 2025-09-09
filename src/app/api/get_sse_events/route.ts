"use server";
import { sseStorage } from '@/shared/storage';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = sseStorage.ToArray();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
