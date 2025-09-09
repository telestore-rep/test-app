import { ClientContext } from "@/providers/ClientProvider";
import { APP_URL_ID } from "@/shared/constants/client";
import Button from "@/shared/ui/button/Button";
import { InfoBlock } from "@/shared/ui/info-block/InfoBlock";
import { Title } from "@/shared/ui/title/Title";
import { FC, useContext, useEffect } from "react";

interface ClientUserInfoProps {}

export const ClientUserInfo: FC<ClientUserInfoProps> = () => {
  const { teleuser } = useContext(ClientContext);

  const getData = () => {
    window.open(
      `https://dev.tele.store:8081/appauth.html?get_user_info=${APP_URL_ID}`,
      "_self"
    );
  };

  return (
    <>
      <Title
        title="Simple one time get user data without session"
        color="light"
      />
      <Button
        testId={"GET_USER_INFO"}
        color="light"
        onClick={getData}
        size="md"
      >
        Get user info
      </Button>

      <InfoBlock
        testId={"USER_INFO_VALIDATE"}
        title="User info"
        color="light"
        items={[
          { title: "User ID", value: teleuser?.id?.toString() || "undefined" },
          { title: "First name", value: teleuser?.first_n || "undefined" },
          { title: "Last name", value: teleuser?.second_n || "undefined" },
          { title: "UTC", value: teleuser?.utc?.toString() || "undefined" },
        ]}
      />
    </>
  );
};
