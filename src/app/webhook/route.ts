"use server"
import { webhookStorage } from "@/shared/storage";
// import { webhookData } from "@/app/server/page";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    webhookStorage.Add(JSON.stringify(body));
    
    return NextResponse.json("", { status: 200 });
  } catch (error) {
    console.error("error webhook handling", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}