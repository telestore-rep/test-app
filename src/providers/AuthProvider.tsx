"use client";
import crypto from "crypto";
import { PUBLIC_USER_KEY } from "@/shared/constants/client";
import { useSearchParams } from "next/navigation";
import { createContext, FC, JSX, memo, PropsWithChildren, useContext, useEffect } from "react";
import { toBase64Url } from "@/shared/helpers/toBase64Url";
import { ITeleuserInfo, useAuthStore } from "@/shared/store/useAuthStore";

export interface AuthContextInfo {
  teleuser: ITeleuserInfo | null;
}

export const AuthContext = createContext<AuthContextInfo>({
  teleuser: null
});

const AuthProvider: FC<PropsWithChildren<unknown>> = memo(({ children }): JSX.Element | null => {
  const params = useSearchParams();
  const userEncoded = params?.get("usr");
  const check = params?.get("check");

  const { teleuser, setTeleuser } = useAuthStore();

  /** Effect for processing the usr and check parameters in the URL. */
  useEffect(() => {
    if (userEncoded) {
      /** Get user info */
      let userData: ITeleuserInfo = JSON.parse(atob(userEncoded));

      /** Validate user info on client side */
      if (check) {
        const publicKeyBytes = Buffer.from(PUBLIC_USER_KEY, "hex");
        const userDataUtf8Bytes = Buffer.from(JSON.stringify(userData), "utf-8");

        const sha256Hash = crypto.createHash("sha256").update(publicKeyBytes).digest();
        const hmacHash = crypto.createHmac("sha256", sha256Hash).update(userDataUtf8Bytes).digest();
        const checkStrBase64 = toBase64Url(hmacHash);

        userData = {
          ...userData,
          validated: check === checkStrBase64
        };
      }

      setTeleuser(userData);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ teleuser }}>
      {children}
    </AuthContext.Provider>
  );
});

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
