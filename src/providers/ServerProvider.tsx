"use client";
import { createContext, Dispatch, FC, JSX, memo, PropsWithChildren, SetStateAction, useEffect, useState } from "react";
import { ITeleuserAuthorizedInfo } from "@/shared/store/useAuthStore";
import { AppsStoreOut, IBalanceInfo, ITransaction, TxCodesOut } from "@/app/types/types";

export interface ServerContextT {
  teleuser: ITeleuserAuthorizedInfo | null;
  invoices?: TxCodesOut[] | null;
  devApps?: AppsStoreOut[] | null;
  transactions: ITransaction[] | null;
  balanceInfo: IBalanceInfo | null;
  webhookEvents: string[];
  sseEvents: string[];
  errors: Record<string, string>;
  setTeleuser: Dispatch<SetStateAction<ITeleuserAuthorizedInfo | null>>;
  setBalanceInfo: Dispatch<SetStateAction<IBalanceInfo | null>>;
  setTransactions: Dispatch<SetStateAction<ITransaction[]>>;
  setInvoices: Dispatch<SetStateAction<TxCodesOut[] | null>>;
  setDevApps: Dispatch<SetStateAction<AppsStoreOut[] | null>>;
  connectTelestore: () => Promise<void>;
  setError: (key: string, value: string) => void
}

export const ServerContext = createContext<ServerContextT>({
  teleuser: null,
  invoices: null,
  devApps: null,
  transactions: null,
  balanceInfo: null,
  webhookEvents: [],
  sseEvents: [],
  errors: {},
  setTeleuser: () => {},
  setBalanceInfo: () => {},
  setTransactions: () => {},
  setInvoices: () => {},
  setDevApps: () => {},
  connectTelestore: async () => {},
  setError: () => {}
});

export const ServerProvider: FC<PropsWithChildren<unknown>> = memo(({ children }): JSX.Element | null => {
    const [teleuser, setTeleuser] = useState<ITeleuserAuthorizedInfo | null>(null);
    const [balanceInfo, setBalanceInfo] = useState<IBalanceInfo | null>(null);
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [invoices, setInvoices] = useState<TxCodesOut[] | null>(null);
    const [devApps, setDevApps] = useState<AppsStoreOut[] | null>(null);
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [errors, setErrorsState] = useState<Record<string, string>>({});
    const [sseEvents, setSseEvents] = useState<string[]>([]);
    const [webhookEvents, setWebhookEvents] = useState<string[]>([]);

    const setError = (key: string, value: string) => {
        setErrorsState((prev) => ({ ...prev, [key]: value }));
    };

    const fetchJson = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${url}`);
        return res.json();
    };

    const connectTelestore = async () => {
      if (!authorized) {
          const result = await fetch("./api/sdk_connect");
          if (result.status !== 200) return;
          setAuthorized(true);
      }
    
      try {
          const userData = await fetchJson("./api/teleuser_detailts");
          const balanceData = await fetchJson("./api/balance_info");
          const transactionsData = await fetchJson("./api/get_transactions");
          const invoicesData = await fetchJson("./api/get_invoices");
          const devAppsData = await fetchJson("./api/dev_list_apps");
    
          setTeleuser(userData.result);
          setBalanceInfo(balanceData.result[0]);
          setTransactions(transactionsData.result);
          setInvoices(invoicesData.result);
          setDevApps(devAppsData.result);
      } catch (error) {
          setError("Telestore connection error", error.message);
          console.error("Error:", error);
      }
    };

    useEffect(() => {
      if (authorized) {
        const getEvents = async () => {
          try {
            const sseRes = await fetch("./api/get_sse_events");
            if (!sseRes.ok) throw new Error("SSE fetch error");
            const sseResult = await sseRes.json();
  
            const webhookRes = await fetch("./api/get_webhook_events");
            if (!webhookRes.ok) throw new Error("Webhook fetch error");
            const webhookResult = await webhookRes.json();
  
            setSseEvents(sseResult);
            setWebhookEvents(webhookResult);
          } catch (error) {
            setError("Getting events error", error.message);
            console.error("Error:", error);
          }
        };
  
        getEvents();
  
        const intervalId = setInterval(getEvents, 10000);
  
        return () => clearInterval(intervalId);
      }
  }, [authorized]);

    return (
        <ServerContext.Provider 
            value={{
                teleuser,
                invoices,
                sseEvents,
                webhookEvents,
                devApps,
                errors,
                transactions,
                balanceInfo,
                setBalanceInfo,
                setTransactions,
                setError,
                setInvoices,
                setDevApps,
                setTeleuser,
                connectTelestore,
            }}
        >
            {children}
        </ServerContext.Provider>
    );
});