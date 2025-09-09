import { FetchResponse } from "@/app/types/types";
import { GetValue } from "@/shared/ui/get-value/GetValue";
import Text from "@/shared/ui/text/Text";
import { Title } from "@/shared/ui/title/Title";
import TransferBlock from "@/shared/ui/transfer-block/TransferBlock";
import Link from "next/link";
import { FC, useState } from "react";
import styles from "./styles.module.scss";

interface IBalance {
  amount: number;
  currency: string;
}

interface TransferProps {}

export const Transfer: FC<TransferProps> = () => {
  const [balance, setBalance] = useState<IBalance | null>();
  const [checkTransaction, setCheckTransaction] = useState<boolean>(false);
  const [paymentState, setPaymentState] = useState({
    amount: "",
    tag: "",
    partner_info: "",
  });

  const updatePaymentState = (
    key: keyof typeof paymentState,
    value: string
  ) => {
    setPaymentState((prevState) => ({ ...prevState, [key]: value }));
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

  const transferFn = async () => {
    if (
      paymentState.amount.length &&
      paymentState.tag.length &&
      paymentState.partner_info.length
    ) {
      const response = await fetch(
        `https://dev.tele.store:8081/appauth/v1/make_payment`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            amount: paymentState.amount,
            partner_info: paymentState.partner_info,
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

  return (
    <>
      <GetValue
        getFn={getBalance}
        btnTitle="Get user Tele USD free balance"
        title="Balance"
        value={
          balance ? `${balance?.amount?.toString()} ${balance?.currency}` : ""
        }
        color="light"
        testId={"BALANCE"}
      />

      <Title color="light" title="Transfer Tele USD to Developer app Wallet" />
      <TransferBlock
        id={"Create payment"}
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
          {
            label: "Partner info",
            placeholder: "enter  partner info",
            id: "partner_info",
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
    </>
  );
};
