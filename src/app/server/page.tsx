"use client";

import Text from "@/shared/ui/text/Text";
import TransferBlock from "@/shared/ui/transfer-block/TransferBlock";
import { Header } from "@/shared/ui/header/Header";
import { Layout } from "@/shared/layouts/flex-layout/Layout";
import { AuthInfo } from "@/shared/ui/auth-info/AuthInfo";
import { InfoBlock } from "@/shared/ui/info-block/InfoBlock";
import styles from "./styles.module.css";

import Link from "next/link";
import { Table } from "@/shared/ui/table/Table";
import { InfoCard } from "@/shared/ui/info-card/InfoCard";
import { Title } from "@/shared/ui/title/Title";
import { InvoiceParams } from "@telestore/integration-sdk";
import { APP_ID } from "@/shared/constants/client";
import { useEffect, useState } from "react";
import { ITeleuserAuthorizedInfo } from "@/shared/store/useAuthStore";
import Button from "@/shared/ui/button/Button";
import {
  AppsStoreOut,
  IBalanceInfo,
  ITransaction,
  TxCodesOut,
} from "../types/types";

function withRefresh(fn: () => Promise<any>, refreshFn: () => void) {
  return () =>
    fn().finally(() => {
      console.log("FINALLY");
      refreshFn();
    });
}

const ServerSide = () => {
  const [teleuser, setTeleuser] = useState<ITeleuserAuthorizedInfo>();
  const [balanceInfo, setBalanceInfo] = useState<IBalanceInfo | null>();
  const [sseEvents, setSseEvents] = useState<string[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [authorized, setAuthorized] = useState<boolean>(false);

  const [invoices, setInvoices] = useState<TxCodesOut[]>();
  const [devApps, setDevApps] = useState<AppsStoreOut[]>();

  const [invoiceState, setInvoiceState] = useState({
    amount: "",
    id: "",
    tag: "",
  });

  const [paymentState, setPaymentState] = useState({
    amount: "",
    id: "",
    tag: "",
  });

  const updateInvoiceState = (
    key: keyof typeof invoiceState,
    value: string
  ) => {
    setInvoiceState((prevState) => ({ ...prevState, [key]: value }));
  };

  const updatePaymentState = (
    key: keyof typeof paymentState,
    value: string
  ) => {
    setPaymentState((prevState) => ({ ...prevState, [key]: value }));
  };

  const navigateClientSide = () => {
    window.location.href = "/";
  };

  const fetchJson = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${url}`);
    return res.json();
  };

  const connectSse = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await fetch("./api/connect_sse", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("SSE Connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectTelestore = async () => {
    if (!authorized) {
      const result = await fetch("./api/sdk_connect");

      if (result.status !== 200) return;

      setAuthorized(true);
    }

    try {
      const [
        userData,
        balanceData,
        transactionsData,
        invoicesData,
        devAppsData,
      ] = await Promise.all([
        fetchJson("./api/teleuser_detailts"),
        fetchJson("./api/balance_info"),
        fetchJson("./api/get_transactions"),
        fetchJson("./api/get_invoices"),
        fetchJson("./api/dev_list_apps"),
      ]);

      setTeleuser(userData.result);
      setBalanceInfo(balanceData.result[0]);
      setTransactions(transactionsData.result);
      setInvoices(invoicesData.result);
      setDevApps(devAppsData.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (authorized) {
      const getEvents = async () => {
        try {
          const response = await Promise.all([
            fetch("./api/get_sse_events"),
            fetch("./api/get_webhook_events"),
          ]);

          const sseResult = await response[0].json();
          const webhookResult = await response[1].json();

          setSseEvents(sseResult);
          setWebhookEvents(webhookResult);
        } catch (error) {
          console.error("Error:", error);
        }
      };

      getEvents();

      const intervalId = setInterval(getEvents, 10000);

      return () => clearInterval(intervalId);
    }
  }, [authorized]);

  const handleGenerateInvoice = withRefresh(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const body: InvoiceParams = {
        amount: +invoiceState.amount,
        appId: APP_ID,
        currency: "TeleUSD",
        partnerInfo: invoiceState.id,
        tag: invoiceState.tag,
      };

      const data = await fetch("./api/create_invoice", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("data", data);
    } catch (error) {
      console.error("Invoice creating error:", error);
    } finally {
      setLoading(false);
    }
  }, connectTelestore);

  const makeTransfer = withRefresh(async () => {
    if (
      paymentState.id?.length &&
      paymentState.amount?.length &&
      paymentState.tag?.length
    ) {
      const body = {
        recipient: paymentState.id,
        currency: "TeleUSD",
        amount: parseFloat(paymentState.amount),
        tag: paymentState.tag,
      };

      const res = await fetch("./api/make_transfer", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data?.result?.confirmCode) {
        const res2 = await fetch(
          `./api/make_transfer?confirmationTimetick=${data?.result?.txId}&confirmationCode=${data?.result?.confirmCode}`,
          {
            method: "POST",
            body: JSON.stringify(body),
          }
        );
        const data2 = await res2.json();

        if (data2.result.confirmationStatusCode === 4) {
          setPaymentState({
            amount: "",
            id: "",
            tag: "",
          });
        }
      }
    }
  }, connectTelestore);

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
      <Button color="dark" onClick={connectTelestore}>
        Connect to TeleStore
      </Button>
      <InfoBlock
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
        <Link href="https://dev.tele.store:8081/chat" className={styles.Link}>
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
      <InfoCard
        value={sseEvents.join("\n")}
        title="SSE (Server side events)"
        color="dark"
      />
      <Button color="dark" onClick={connectSse}>
        Connect SSE
      </Button>
      <InfoCard
        value={webhookEvents.join("\n")}
        title="Webhooks"
        color="dark"
      />
      <Table
        info={devApps}
        color="dark"
        title="Developers Apps"
        headers={["Name", "App ID", "App URL"]}
      />
      <Layout align="top-right" isWide>
        <Link href="https://dev.tele.store:8081/wallet" className={styles.Link}>
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
      <Title title="Payment refund / transfers to user" color="dark" />
      <TransferBlock
        setState={updatePaymentState}
        state={paymentState}
        transferFn={makeTransfer}
        title="Create payment to user"
        fields={[
          {
            label: "Amount, TeleUsd",
            placeholder: "enter amount",
            id: "amount",
          },
          {
            label: "Client ID to send ",
            placeholder: "Test User 1 ID",
            id: "id",
          },
          { label: "Description", placeholder: "enter description", id: "tag" },
        ]}
        color="dark"
        titleBtn="Transfer"
      />
      <Table
        info={transactions}
        color="dark"
        title="Last transacton"
        headers={[
          "Amount/",
          "Fee/",
          "From/",
          "To/",
          "Type/",
          "APP ID/",
          " Partner info/",
          "Tag",
        ]}
      />
      <Layout align="top-right" isWide>
        <Link
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
      <TransferBlock
        setState={updateInvoiceState}
        state={invoiceState}
        transferFn={handleGenerateInvoice}
        loading={loading}
        title="Create invoice"
        titleBtn="Create invoice"
        fields={[
          {
            label: "Amount, TeleUsd",
            placeholder: "enter amount",
            id: "amount",
          },
          {
            label: "Partner Info ",
            placeholder: "enter partner info",
            id: "id",
          },
          { label: "Tag", placeholder: "enter tag", id: "tag" },
        ]}
        color="dark"
      />
      <Table
        info={invoices}
        color="dark"
        title="Invoice list"
        headers={["Payment Code", "Amount", "Payment link"]}
      />
    </>
  );
};

export default ServerSide;
