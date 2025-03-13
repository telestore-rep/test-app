"use client";

import {
  ITeleuserAuthorizedInfo,
  ITeleuserInfo,
} from "@/shared/store/useAuthStore";
import { AuthInfo } from "@/shared/ui/auth-info/AuthInfo";
import { Header } from "@/shared/ui/header/Header";
import { InfoBlock } from "@/shared/ui/info-block/InfoBlock";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { APP_URL_ID, PUBLIC_USER_KEY } from "@/shared/constants/client";
import { GetValue } from "@/shared/ui/get-value/GetValue";
import { Title } from "@/shared/ui/title/Title";
import { AppData } from "@/shared/ui/app-data/AppData";
import { toBase64Url } from "@/shared/helpers/toBase64Url";
import crypto from "crypto";
import Button from "@/shared/ui/button/Button";
import Text from "@/shared/ui/text/Text";
import Link from "next/link";
import TransferBlock from "@/shared/ui/transfer-block/TransferBlock";

import styles from "./styles.module.scss";
import { setDeviceGuidCookie } from "@/shared/helpers/setDeviceGuidCookie";
import { FetchResponse, IAppData } from "../types/types";

interface IBalance {
  amount: number;
  currency: string;
}

interface ClientProps {}

const Client: FC<ClientProps> = () => {
  const params = useSearchParams();
  const check = params?.get("check");
  const userEncoded = params?.get("usr");
  const authCode = params?.get("auth_code");
  const [teleuser, setTeleuser] = useState<ITeleuserInfo | null>();
  const [teleuserAuthorized, setTeleuserAuthorized] =
    useState<ITeleuserAuthorizedInfo | null>();
  const [balance, setBalance] = useState<IBalance | null>();
  const [appData, setAppData] = useState<string>("");
  const [listAppProgress, setListAppProgress] = useState<IAppData[]>([]);
  const [validatedServer, setValidatedServer] = useState<boolean | undefined>(
    undefined
  );
  const [validatedClient, setValidatedClient] = useState<boolean | undefined>(
    undefined
  );
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [checkTransaction, setCheckTransaction] = useState<boolean>(false);

  const [paymentState, setPaymentState] = useState({
    amount: "",
    tag: "",
    id: null,
  });

  const updatePaymentState = (
    key: keyof typeof paymentState,
    value: string
  ) => {
    setPaymentState((prevState) => ({ ...prevState, [key]: value }));
  };

  const authorizeUser = async (code: string) => {
    const body = {
      session_code: code,
    };

    const response = await fetch(
      "https://dev.tele.store:8081/auth/v1/app_login",
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

    // Session already exists
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
    document.body.style.background = "#fff";

    if (userEncoded) {
      let userData: ITeleuserInfo = JSON.parse(atob(userEncoded));

      userData = {
        ...userData,
        validated: false,
      };

      setTeleuser(userData);
    }

    if (authCode) {
      (async () => {
        await authorizeUser(authCode);
        const url = new URL(window.location.toString());
        url.search = "";
        window.history.replaceState({}, "", url);
      })();
    }
  }, []);

  const getTeleuserDetails = async () => {
    const response = await fetch(
      `https://dev.tele.store:8081/appauth/v1/get_teleuser_details`,
      {
        credentials: "include",
        method: "GET",
        headers: { "content-type": "application/json" },
      }
    );

    if (!response.ok) {
      console.log("error with getting balance");
    }

    const res: FetchResponse<ITeleuserAuthorizedInfo | null> =
      await response.json();

    setTeleuserAuthorized(res.result);
    console.log("response from authorized teleuser info", res);
  };

  useEffect(() => {
    if (authorized) {
      getTeleuserDetails();
    }
  }, [authorized]);

  const getData = () => {
    window.open(
      `https://dev.tele.store:8081/redirect_ext_auth.html?get_user_info=${APP_URL_ID}`,
      "_self"
    );
  };

  const validateOnClientSide = () => {
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

  const getBalance = async () => {
    const response = await fetch(
      `https://dev.tele.store:8081/appauth/v1/get_balance`,
      {
        credentials: "include",
        method: "GET",
        headers: { "content-type": "application/json" },
      }
    );

    if (!response.ok) {
      console.log("error with getting balance");
    }

    const res: FetchResponse<IBalance | null> = await response.json();

    setBalance(res.result ? res.result[0] : null);
    console.log("response from balance", res);
  };

  const connectViaRedirect = () => {
    window.open(
      `https://dev.tele.store:8081/redirect_ext_auth.html?auth_app=${APP_URL_ID}`,
      "_self"
    );
  };

  const connectViaPopup = () => {
    const width = 500;
    const height = 850;

    window.open(
      `https://dev.tele.store:8081/redirect_ext_auth.html?auth_app=${APP_URL_ID}&popup=true`,
      "authPopup",
      `width=${width},height=${height}`
    );

    window.addEventListener(
      "message",
      async (event) => {
        if (event.origin !== "https://dev.tele.store:8081") return;

        const { authCode } = event.data;

        if (authCode) {
          await authorizeUser(authCode);
        }
      },
      { once: true }
    );
  };

  const transferFn = async () => {
    if (paymentState.amount.length && paymentState.tag.length) {
      const response = await fetch(
        `https://dev.tele.store:8081/appauth/v1/make_payment`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            amount: paymentState.amount,
            currency: "TeleUSD",
            tag: paymentState.tag,
          }),
          headers: { "content-type": "application/json" },
        }
      );

      if (!response.ok) {
        console.log("error with sending tokens");
        return;
      }

      const data: FetchResponse<boolean> = await response.json();

      if (!data.error) {
        setCheckTransaction(true);
      }
    }
  };

  const onSaveData = async () => {
    if (appData?.length) {
      const response = await fetch(
        `https://dev.tele.store:8081/appauth/v1/save_app_user_data`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            appData: appData,
          }),
          headers: { "content-type": "application/json" },
        }
      );

      if (!response.ok) {
        console.log("error with sending tokens");
        return;
      }
    }
  };
  const onLoadData = async () => {
    const response = await fetch(
      `https://dev.tele.store:8081/appauth/v1/list_app_user_data`,
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

    const responseData: FetchResponse<IAppData[]> = await response.json();
    if (responseData.result) setListAppProgress(responseData.result);

    if (!responseData?.result?.[0]?.url) return;
    const file = await fetch(responseData.result[0].url, {
      credentials: "include",
      method: "GET",
    });

    const fileData = await file.json();

    console.log("fileData", fileData);

    setAppData(fileData.appData);
  };

  const getListAppProgress = () => {
    if (!listAppProgress.length) return "";
    return listAppProgress
      .map((item, index) => {
        return (
          `Game ${index + 1}:\n` +
          Object.entries(item)
            .map(([key, value]) => `  ${key}: ${value}`)
            .join("\n")
        );
      })
      .join("\n\n");
  };

  const validateOnServerSide = async () => {
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
      <Header
        title="Client side"
        btnEvent={() => {
          window.location.href = "/server";
        }}
        color="light"
      />
      <AuthInfo
        color="light"
        link="https://dev.tele.store:8081/profile"
        sdkLink="https://github.com/telestore-rep/SDK"
        sourceLink="https://github.com/telestore-rep/test-app"
        password="Trx008@ii"
        loggedPhone="+7 922 222 22 22"
        login="Ralph"
      />
      <Title
        title="Simple one time get user data without session"
        color="light"
      />
      <Button color="light" onClick={getData} size="md">
        Get user info
      </Button>

      <InfoBlock
        title="User info"
        color="light"
        items={[
          { title: "User ID", value: teleuser?.id?.toString() || "undefined" },
          { title: "First name", value: teleuser?.first_n || "undefined" },
          { title: "Last name", value: teleuser?.second_n || "undefined" },
          { title: "UTC", value: teleuser?.utc?.toString() || "undefined" },
        ]}
      />

      <GetValue
        getFn={validateOnClientSide}
        btnTitle="Validate in client side"
        title="Validation status"
        value={validatedClient === true ? "Valid" : ""}
        color="light"
      />
      <GetValue
        getFn={validateOnServerSide}
        btnColor="black"
        btnTitle="Validate in server side"
        title="Validation status"
        value={validatedServer === true ? "Valid" : ""}
        color="light"
        btnTextColor="dark"
      />

      <Title
        color="light"
        title="Application - Tele store. Client site session"
      />

      <div className={styles.GetValueWrap}>
        <Text color="light" size={10} weight="medium">
          Authorization status
        </Text>

        <div className={styles.Group}>
          <Text
            size={12}
            weight="regular"
            color={!authorized ? "grey" : "light"}
          >
            {authorized ? "Authorized" : "undefined"}
          </Text>

          <div className={styles.ButtonGroup}>
            <Button
              onClick={connectViaRedirect}
              color="white"
              className={styles.Btn}
            >
              <Text color={"light"} size={10} weight="medium">
                Connect via redirect
              </Text>
            </Button>

            <Text size={12} weight="regular" color="grey">
              or
            </Text>

            <Button
              onClick={connectViaPopup}
              color="white"
              className={styles.Btn}
            >
              <Text color="light" size={10} weight="medium">
                Connect via Popup
              </Text>
            </Button>
          </div>
        </div>
      </div>

      <InfoBlock
        title="User info"
        color="light"
        items={[
          {
            title: "User ID",
            value: teleuserAuthorized?.timetick?.toString() || "undefined",
          },
          {
            title: "First name",
            value: teleuserAuthorized?.firstname || "undefined",
          },
          {
            title: "Last name",
            value: teleuserAuthorized?.lastname || "undefined",
          },
        ]}
      />

      <GetValue
        getFn={getBalance}
        btnTitle="Get user Tele USD free balance"
        title="Balance"
        value={
          balance ? `${balance?.amount?.toString()} ${balance?.currency}` : ""
        }
        color="light"
      />

      <Title color="light" title="Transfer Tele USD to Developer app Wallet" />
      <TransferBlock
        setState={updatePaymentState}
        state={paymentState}
        transferFn={transferFn}
        titleBtn="Transfer"
        title="Create payment to Developer"
        color="light"
        fields={[
          {
            label: "Amount, TeleUsd",
            placeholder: "enter  amount",
            id: "amount",
          },
          {
            label: "Description",
            placeholder: "enter  description",
            id: "tag",
          },
        ]}
      />
      {checkTransaction && (
        <Text size={12} className={styles.CheckText} weight="medium">
          *Chek transaction on <a href="/server">server side</a> or in{" "}
          <Link
            href={
              "https://dev.tele.store:8081/wallet?currency=TeleUSD&tab=withdraw"
            }
          >
            wallet
          </Link>
        </Text>
      )}
      <AppData
        value={getListAppProgress()}
        nameBtn="Load progress"
        onChange={setAppData}
        title="Load App data"
        color="light"
        onSubmit={onLoadData}
        height="210px"
      />
      <AppData
        value=""
        nameBtn="Save progress"
        onChange={() => {}}
        title="Save App data"
        color="light"
        onSubmit={onSaveData}
      />
    </>
  );
};

export default Client;
