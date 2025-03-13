  "use server";
  import { NextRequest, NextResponse } from 'next/server';
  import { teleStoreClient } from '@/shared/lib/telestoreClient';

  export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const confirmationTimetick = searchParams.has("confirmationTimetick") ? `&confirmationTimetick=${searchParams.get("confirmationTimetick")}` : ""
        const confirmationCode = searchParams.has("confirmationCode") ? `?confirmationCode=${searchParams.get("confirmationCode")}` : ""
      
        const body = await request.json()
        const responseSid = teleStoreClient.Auth.GetSessionId();
        
        let url = "https://dev.tele.store:8081/trex/v1/wallet/internal_transfer";

        const response = await fetch(url+confirmationCode+confirmationTimetick, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cookie": `sid=${responseSid}`,
          },
          body: JSON.stringify(body)
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
