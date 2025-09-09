"use client";

import Text from "@/shared/ui/text/Text";
import { Header } from "@/shared/ui/header/Header";
import { Layout } from "@/shared/layouts/flex-layout/Layout";
import { AuthInfo } from "@/shared/ui/auth-info/AuthInfo";
import { InfoBlock } from "@/shared/ui/info-block/InfoBlock";
import styles from "./styles.module.css";

import Link from "next/link";
import { Table } from "@/shared/ui/table/Table";
import { InfoCard } from "@/shared/ui/info-card/InfoCard";
import { Title } from "@/shared/ui/title/Title";
import { useContext, useState } from "react";
import ErrorMessage from "@/shared/ui/errors";
import ServerButtons from "@/shared/ui/server-buttons/ServerButtons";
import { ServerContext } from "@/providers/ServerProvider";
import PaymentSection from "@/widgets/server/payment/PaymentSection";
import InvoiceSection from "@/widgets/server/invoice/InvoiceSection";
import { SseInfo } from "@/widgets/server/sse/SseInfo";

const ServerSide = () => {
  const [loading, setLoading] = useState(false);

  const {
    teleuser,
    balanceInfo,
    transactions,
    invoices,
    devApps,
    webhookEvents,
    errors,
    setError,
    connectTelestore,
  } = useContext(ServerContext);

  const navigateClientSide = () => {
    window.location.href = "/";
  };

  return (
    <>
      <Header title="Server side" color="dark" btnEvent={navigateClientSide} />
      <AuthInfo
        color="dark"
        link="https://dev.tele.store:8081/developer"
        sdkLink="https://github.com/telestore-rep/SDK"
        sourceLink="https://github.com/telestore-rep/test-app"
        password="Trx008@ii"
        loggedPhone="+7 933 333 33 33"
        login="Test Dev3"
      />
      <Title title="Telestore autentification" color="dark" />
      <ServerButtons
        onConnectTeleStore={connectTelestore}
        setLoading={setLoading}
        loading={loading}
      />
      <InfoBlock
        testId={"DEVELOPER_INFO"}
        color="dark"
        title="Developer info"
        items={[
          {
            title: "Developer  ID",
            value: teleuser?.timetick?.toString() || "undefined",
          },
          {
            title: "Developer name",
            value: teleuser?.firstname || "undefined",
          },
          {
            title: "Developer company",
            value: teleuser?.company_name || "undefined",
          },
        ]}
      />
      <Layout align="top-right" isWide>
        <Link
          data-testid="LINK_CHAT"
          href="https://dev.tele.store:8081/chat"
          className={styles.Link}
        >
          <Text
            size={12}
            weight="regular"
            color="dark"
            className={styles.LinkTitle}
          >
            Go to TeleStore chat
          </Text>
        </Link>
      </Layout>
      <SseInfo setLoading={setLoading} loading={loading} />
      <InfoCard
        testId={"WEBHOOKS"}
        value={webhookEvents.join("\n")}
        title="Webhooks"
        color="dark"
      />
      <Table
        testId={"DEV_APPS"}
        info={devApps}
        color="dark"
        title="Developers Apps"
        headers={["Name", "App ID", "App URL"]}
      />
      <Layout align="top-right" isWide>
        <Link
          data-testid="LINK_WALLET"
          href="https://dev.tele.store:8081/wallet"
          className={styles.Link}
        >
          <Text
            size={12}
            weight="regular"
            color="dark"
            className={styles.LinkTitle}
          >
            Go to TeleStore wallet
          </Text>
        </Link>
      </Layout>
      <InfoBlock
        testId={"WALLET_INFO"}
        color="dark"
        title="Developer TeleUSD wallet info"
        items={[
          {
            title: "Free balance",
            value: balanceInfo?.free_balance?.toString(),
          },
          {
            title: "Income balance",
            value: balanceInfo?.lock_in_balance?.toString(),
          },
          {
            title: "Out come balance ",
            value: balanceInfo?.lock_out_balance?.toString(),
          },
        ]}
      />
      <PaymentSection
        loading={loading}
        setError={setError}
        transactions={transactions}
        refresh={connectTelestore}
      />
      <Layout align="top-right" isWide>
        <Link
          data-testid="LINK_APP_URLS"
          href="https://dev.tele.store:8081/login/oauth-url"
          className={styles.Link}
        >
          <Text
            size={12}
            weight="regular"
            color="dark"
            className={styles.LinkTitle}
          >
            Go to Developer App URLs
          </Text>
        </Link>
      </Layout>
      <Title title="Invoice" color="dark" />
      <InvoiceSection
        invoices={invoices}
        loading={loading}
        setError={setError}
        refresh={connectTelestore}
      />
      <ErrorMessage errors={errors} />
    </>
  );
};

export default ServerSide;
