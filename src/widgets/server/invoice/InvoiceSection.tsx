import { useContext, useState } from "react";
import { Table } from "@/shared/ui/table/Table";
import TransferBlock, { ITransferBlockField } from "@/shared/ui/transfer-block/TransferBlock";
import { OrderParams } from "@telestore/integration-sdk";
import { API_URL, APP_URL_ID } from "@/shared/constants/client";
import { TxCodesOut } from "@/app/types/types";
import { ServerContext } from "@/providers/ServerProvider";

type Props = {
  invoices?: TxCodesOut[] | null;
  loading: boolean;
  setError: (key: string, value: string) => void;
  refresh: () => void;
};

const InvoiceSection: React.FC<Props> = ({
  invoices,
  loading,
  setError,
  refresh,
}) => {
  const [paymentOrder, setPaymentOrder] = useState({
    amount: "",
    tag: "",
    partner_info: "",
    currency: "",
  });
  const [isPaymentOrder, setInvoiceType] = useState(false);

  const { setInvoices } = useContext(ServerContext);

  const updateInvoiceState = (
    key: keyof typeof paymentOrder,
    value: string
  ) => {
    setPaymentOrder((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleGenerateInvoice = async () => {
    if (loading) return;
    try {
      const body: OrderParams = {
        amount: +paymentOrder.amount,
        app_id: APP_URL_ID,
        currency: !isPaymentOrder ? "TeleUSD" : paymentOrder.currency,
        partner_info: paymentOrder.partner_info || undefined,
        tag: paymentOrder.tag || undefined,
      };

      const endpoint = isPaymentOrder
        ? "./api/put_payment_order"
        : "./api/create_invoice";

      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Request failed with status ${res.status}`);
      }

      const invoicesRes = await fetch("./api/get_invoices");

      if (res.ok) {
        const invoicesData = await invoicesRes.json();
        setInvoices?.(invoicesData.result);
      }
    } catch (error: any) {
      setError("Invoice creating error", error.message);
      console.error("Invoice creating error:", error);
    }
  };

  return (
    <>
      <TransferBlock
        testId={"CREATE_INVOICE"}
        id={"INVOICE_BLOCK"}
        setState={updateInvoiceState}
        state={paymentOrder}
        transferFn={handleGenerateInvoice}
        invoiceType={isPaymentOrder}
        setInvoiceType={setInvoiceType}
        loading={loading}
        title="Create invoice"
        titleBtn="Create invoice"
        fields={[
          {
            label: "Amount",
            placeholder: "enter amount",
            id: "amount",
          },
          ...(!isPaymentOrder ? [] : [{
            label: "Currency",
            id: "currency",
            type: "select",
            items: [
              { label: "TeleUSD (TeleDollar)", value: "TeleUSD" },
              { label: "Rub (Russian Ruble)", value: "RUB" },
            ],
          } as ITransferBlockField]),
          {
            label: "Client info",
            placeholder: "Enter email",
            id: "partner_info",
          },
          { label: "Payment info", placeholder: "Enter Payment info", id: "tag" },
        ]}
        color="dark"
      />
      <Table
        testId={"INVOICE_LIST"}
        info={
          invoices
            ? invoices?.map((i) => ({
              Code: i.code,
              Amount: `${i.amount} ${i.currency}`,
              Link: i.typeTx === 24 ? `${API_URL}/pay?code=${i.code}` : `${API_URL}/redirect.html?invoice=${i.code}`,
            }))
            : undefined
        }
        color="dark"
        title="Invoice list"
        headers={["Payment Code/", "Amount/", "Payment link"]}
      />
    </>
  );
};

export default InvoiceSection;
