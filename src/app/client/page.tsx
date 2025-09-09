"use client";

import { AuthInfo } from "@/shared/ui/auth-info/AuthInfo";
import { Header } from "@/shared/ui/header/Header";
import { FC, useContext, useEffect } from "react";
import Button from "@/shared/ui/button/Button";
import { ClientUserInfo } from "@/widgets/client/user-info/UserInfo";
import { Validation } from "@/widgets/client/validation/Validation";
import { Connect } from "@/widgets/client/connect/Connect";
import { ClientContext } from "@/providers/ClientProvider";
import { FileUpload } from "@/widgets/client/file-upload/FileUpload";
import { ListApp } from "@/widgets/client/app-data/AppData";
import { Transfer } from "@/widgets/client/transfer/Transfer";

interface ClientProps {}

const Client: FC<ClientProps> = () => {
  const { authorized, getTeleuserDetails } = useContext(ClientContext);

  useEffect(() => {
    document.body.style.background = "#fff";
  }, []);

  useEffect(() => {
    if (authorized) {
      getTeleuserDetails();
    }
  }, [authorized]);

  const handleRefresh = async () => {
    getTeleuserDetails();
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
      <ClientUserInfo />
      <Validation />
      <Connect />
      <Button testId={"REFRESH"} onClick={handleRefresh}>
        Refresh
      </Button>
      <Transfer />
      <ListApp />
      <FileUpload />
    </>
  );
};

export default Client;
