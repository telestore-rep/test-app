"use server"
import { webhookStorage } from "@/shared/storage";
// import { webhookData } from "@/app/server/page";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    webhookStorage.Add(await request.text());
    
    return NextResponse.json("", { status: 200 });
  } catch (error) {
    console.error("error webhook handling", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}