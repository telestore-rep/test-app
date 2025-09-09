import { useContext, useState } from "react";
import { Table } from "@/shared/ui/table/Table";
import TransferBlock from "@/shared/ui/transfer-block/TransferBlock";
import { InvoiceParams } from "@telestore/integration-sdk";
import { API_URL, APP_ID } from "@/shared/constants/client";
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
  const [isAcquiringInvoice, setIsAcquiringInvoice] = useState({
    amount: "",
    tag: "",
    partner_info: "",
  });
  const [invoiceType, setInvoiceType] = useState(false);

  const { setInvoices } = useContext(ServerContext);

  const updateInvoiceState = (
    key: keyof typeof isAcquiringInvoice,
    value: string
  ) => {
    setIsAcquiringInvoice((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleGenerateInvoice = async () => {
    if (loading) return;
    try {
      const body: InvoiceParams = {
        amount: +isAcquiringInvoice.amount,
        app_id: APP_ID.toString(),
        currency: "TeleUSD",
        partner_info: isAcquiringInvoice.partner_info || undefined,
        tag: isAcquiringInvoice.tag || undefined,
      };

      const endpoint = invoiceType
        ? "./api/put_payment_order"
        : "./api/create_invoice";

      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      const newInvoice = await res.json();

      setInvoices?.((prev) => (prev ? [newInvoice, ...prev] : [newInvoice]));
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
        state={isAcquiringInvoice}
        transferFn={handleGenerateInvoice}
        invoiceType={invoiceType}
        setInvoiceType={setInvoiceType}
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
            label: "Partner Info",
            placeholder: "enter partner info",
            id: "partner_info",
          },
          { label: "Tag", placeholder: "enter tag", id: "tag" },
        ]}
        color="dark"
      />
      <Table
        testId={"INVOICE_LIST"}
        info={
          invoices
            ? invoices?.map((i) => ({
              Code: i.code,
              Amount: i.amount,
              Link: `${API_URL}/redirect.html?${i.typeTx === 24 ? "pay_code" : "invoice" }=${i.code}`,
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
