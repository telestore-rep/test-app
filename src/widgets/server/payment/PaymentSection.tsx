import { useState } from "react";
import TransferBlock from "@/shared/ui/transfer-block/TransferBlock";
import { Title } from "@/shared/ui/title/Title";
import { Table } from "@/shared/ui/table/Table";
import { ITransaction } from "@/app/types/types";

type Props = {
  loading: boolean;
  setError: (key: string, value: string) => void;
  refresh: () => void;
  transactions: ITransaction[] | null;
};

function withRefresh(fn: () => Promise<any>, refreshFn: () => void) {
  return () => fn().finally(refreshFn);
}

const PaymentSection: React.FC<Props> = ({ loading, transactions, refresh }) => {
  const [paymentState, setPaymentState] = useState({
    amount: "",
    id: "",
    tag: "",
  });

  const updatePaymentState = (
    key: keyof typeof paymentState,
    value: string
  ) => {
    setPaymentState((prevState) => ({ ...prevState, [key]: value }));
  };

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
  }, refresh);

  return (
    <>
        <Title title="Payment refund / transfers to user" color="dark" />
        <TransferBlock
            id={"PAYMENT_BLOCK"}
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
            loading={loading}
        />
        <Table
            testId={"LAST_TRANSACTION"}
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
    </> 
  );
};

export default PaymentSection; 