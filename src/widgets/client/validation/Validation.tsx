import { PUBLIC_USER_KEY } from "@/shared/constants/client";
import { ITeleuserInfo } from "@/shared/store/useAuthStore";
import { GetValue } from "@/shared/ui/get-value/GetValue";
import { useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import crypto from "crypto";
import { toBase64Url } from "@/shared/helpers/toBase64Url";
import { FetchResponse } from "@/app/types/types";

interface ValidationProps {}

export const Validation: FC<ValidationProps> = () => {
  const params = useSearchParams();
  const check = params?.get("check");
  const userEncoded = params?.get("usr");
  const [validatedServer, setValidatedServer] = useState<boolean | undefined>(
    undefined
  );
  const [validatedClient, setValidatedClient] = useState<boolean | undefined>(
    undefined
  );
  console.log("initial check and userEncoded", { userEncoded, check });

  const validateOnClientSide = () => {
    console.log("validateOnClientSide", { check, userEncoded });
    if (check && userEncoded) {
      let userData: ITeleuserInfo = JSON.parse(atob(userEncoded));

      const publicKeyBytes = Buffer.from(PUBLIC_USER_KEY, "hex");
      const userDataUtf8Bytes = Buffer.from(JSON.stringify(userData), "utf-8");

      const sha256Hash = crypto
        .createHash("sha256")
        .update(publicKeyBytes)
        .digest();
      const hmacHash = crypto
        .createHmac("sha256", sha256Hash)
        .update(userDataUtf8Bytes)
        .digest();
      const checkStrBase64 = toBase64Url(hmacHash);

      setValidatedClient(check === checkStrBase64);
    }
  };

  const validateOnServerSide = async () => {
    console.log("validateOnServerSide", { check, userEncoded });
    if (check && userEncoded) {
      const response = await fetch(
        `./api/validate_usr_info?usr=${userEncoded}&check=${check}`,
        {
          credentials: "include",
          method: "GET",
          headers: { "content-type": "application/json" },
        }
      );

      if (!response.ok) {
        console.log("error with sending tokens");
        return;
      }

      const data: FetchResponse<boolean> = await response.json();

      setValidatedServer(!!data);
    }
  };

  return (
    <>
      <GetValue
        getFn={validateOnClientSide}
        btnTitle="Validate in client side"
        title="Validation status"
        value={validatedClient === true ? "Valid" : ""}
        color="light"
        testId={"VALIDATE_CLIENT_SIDE"}
      />
      <GetValue
        getFn={validateOnServerSide}
        btnColor="black"
        btnTitle="Validate in server side"
        title="Validation status"
        value={validatedServer === true ? "Valid" : ""}
        color="light"
        btnTextColor="dark"
        testId={"VALIDATE_SERVER_SIDE"}
      />
    </>
  );
};
