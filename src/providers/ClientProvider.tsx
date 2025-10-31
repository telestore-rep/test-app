"use client";
import { useSearchParams } from "next/navigation";
import {
  createContext,
  FC,
  memo,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import {
  ITeleuserAuthorizedInfo,
  ITeleuserInfo,
} from "@/shared/store/useAuthStore";
import { setDeviceGuidCookie } from "@/shared/helpers/setDeviceGuidCookie";
import { FetchResponse } from "@/app/types/types";
import { getBaseUrl } from "@/shared/constants/client";

export interface ClientContextT {
  teleuser: ITeleuserInfo | null;
  authorized: boolean;
  authorizeUser: (code: string) => Promise<void> | any;
  getTeleuserDetails: () => Promise<void> | any;
  teleuserAuthorized: ITeleuserAuthorizedInfo | null | undefined;
}

export const ClientContext = createContext<ClientContextT>({
  teleuser: null,
  authorizeUser: async () => { },
  authorized: false,
  getTeleuserDetails: async () => { },
  teleuserAuthorized: null,
});

export const ClientProvider: FC<PropsWithChildren<unknown>> = memo(
  ({ children }) => {
    const params = useSearchParams();
    const userEncoded = params?.get("usr");
    const authCode = params?.get("auth_code");
    const proxyId = params?.get("proxy_id");
    const telestoreTxCode = params?.get("telestore_code");
    const [authorized, setAuthorized] = useState(false);
    const [teleuser, setTeleuser] = useState<ITeleuserInfo | null>(null);
    const [teleuserAuthorized, setTeleuserAuthorized] =
      useState<ITeleuserAuthorizedInfo | null>();

    const getTeleuserDetails = async () => {
      const response = await fetch(
        `${getBaseUrl()}/appauth/v1/get_teleuser_details`,
        {
          credentials: "include",
          method: "GET",
          headers: { "content-type": "application/json" },
        }
      );

      if (!response.ok) {
        console.log("error with getting teleuser details");
      }

      const res: FetchResponse<ITeleuserAuthorizedInfo | null> =
        await response.json();
      setTeleuserAuthorized(res.result);
      if (res?.result) setAuthorized(true);
      console.log("response from authorized teleuser info", res);
    };

    const authorizeUser = async (code: string) => {
      const body = { session_code: code };

      const response = await fetch(
        `${getBaseUrl()}/auth/v1/app_login`,
        {
          method: "POST",
          body: JSON.stringify(body),
          credentials: "include",
          headers: {
            lang: navigator.language,
            device_guid: setDeviceGuidCookie(),
            "content-type": "application/json",
            resolution: `${screen.width}x${screen.height}`,
            tzone: new Date().getTimezoneOffset()?.toString(),
          },
        }
      );

      if (response.status === 403) {
        setAuthorized(true);
        return;
      }

      const responseData: FetchResponse<boolean> = await response.json();
      if (responseData.result) {
        setAuthorized(true);
      }
    };

    useEffect(() => {
      if (proxyId) {
        localStorage.setItem("proxy_id", proxyId);
      }

      if (userEncoded) {
        let userData: ITeleuserInfo = JSON.parse(atob(userEncoded));
        userData = { ...userData, validated: false };
        setTeleuser(userData);
      }

      if (authCode) {
        (async () => {
          await authorizeUser(authCode);

          // Удаляем только auth_code, оставляя usr и check
          const url = new URL(window.location.toString());
          url.searchParams.delete("auth_code");
          window.history.replaceState({}, "", url);
        })();
      }

      if (telestoreTxCode && window.location.pathname !== '/server') {
        const currentUrl = new URL(window.location.toString());
        const serverUrl = new URL('/server', window.location.origin);

        currentUrl.searchParams.forEach((value, key) => {
          serverUrl.searchParams.set(key, value);
        });

        window.location.href = serverUrl.toString();
      }
    }, []);

    return (
      <ClientContext.Provider
        value={{
          teleuser,
          authorized,
          teleuserAuthorized,
          authorizeUser,
          getTeleuserDetails,
        }}
      >
        {children}
      </ClientContext.Provider>
    );
  }
);
