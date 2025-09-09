import { ClientContext } from "@/providers/ClientProvider";
import { APP_URL_ID } from "@/shared/constants/client";
import Button from "@/shared/ui/button/Button";
import Text from "@/shared/ui/text/Text";
import { Title } from "@/shared/ui/title/Title";
import { FC, useContext } from "react";
import styles from "./styles.module.scss";
import { InfoBlock } from "@/shared/ui/info-block/InfoBlock";

interface ConnectProps {}

export const Connect: FC<ConnectProps> = () => {
  const { authorized, teleuserAuthorized, authorizeUser } =
    useContext(ClientContext);

  const connectViaRedirect = () => {
    window.open(
      `https://dev.tele.store:8081/appauth.html?auth_app=${APP_URL_ID}`,
      "_self"
    );
  };

  const connectViaPopup = () => {
    const width = 500;
    const height = 850;

    window.open(
      `https://dev.tele.store:8081/appauth.html?auth_app=${APP_URL_ID}&popup=true`,
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

  return (
    <>
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
              testId={"CONNECT_VIA_REDIRECT"}
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
              testId={"CONNECT_VIA_POPUP"}
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
        testId={"USER_INFO_CONNECT"}
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
    </>
  );
};
