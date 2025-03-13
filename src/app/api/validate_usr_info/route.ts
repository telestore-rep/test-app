"use server";
import crypto from "crypto";
import { NextRequest, NextResponse } from 'next/server';
import { ITeleuserInfo } from '@/shared/store/useAuthStore';
import { PUBLIC_USER_KEY } from '@/shared/constants/server';
import { toBase64Url } from "@/shared/helpers/toBase64Url";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userEncoded = searchParams.get("usr");
    const check = searchParams.get("check");

    if (!userEncoded || !check) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    /** Get user info */
    let userData: ITeleuserInfo = JSON.parse(atob(userEncoded));

    /** Validate user info on server side */
    const publicKeyBytes = Buffer.from(PUBLIC_USER_KEY, "hex");
    const userDataUtf8Bytes = Buffer.from(JSON.stringify(userData), "utf-8");

    const sha256Hash = crypto.createHash("sha256").update(publicKeyBytes).digest();
    const hmacHash = crypto.createHmac("sha256", sha256Hash).update(userDataUtf8Bytes).digest();
    const checkStrBase64 = toBase64Url(hmacHash);

    return NextResponse.json(check === checkStrBase64, { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
