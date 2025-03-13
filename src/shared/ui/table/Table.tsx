import { FC } from "react";
import styles from "./styles.module.scss";
import Text, { TextColor } from "../text/Text";
import { ITransaction } from "@/app/types/types";

interface TableProps {
  title: string;
  color: TextColor;
  info?: { [key: string]: any }[];
  headers: string[];
}

type TransactionProps = {
  transaction: ITransaction;
  color: TextColor;
};

const TransactionItem: React.FC<TransactionProps> = ({
  transaction,
  color,
}) => {
  return (
    <div
      className={`${styles.TxItem} ${color === "dark" && styles.TxItemDark}`}
    >
      {Object.entries(transaction).map(([key, value]) => (
        <Text size={10} weight="regular" color={color} key={key}>
          <strong>{key}:</strong>{" "}
          {Array.isArray(value)
            ? value.map((item, index) => (
                <span key={index}>
                  {typeof item === "object"
                    ? JSON.stringify(item)
                    : String(item)}
                  {index < value.length - 1 ? ", " : ""}
                </span>
              ))
            : String(value)}
          {key !== "address_tx_data" && " /"}
        </Text>
      ))}
    </div>
  );
};

export const Table: FC<TableProps> = ({ title, color, headers, info }) => {
  console.log("info", info);

  return (
    <div
      className={`${styles.TableWrap} ${
        color === "dark" && styles.TableWrapDark
      }`}
    >
      <Text size={12} weight="medium" color={color}>
        {title}
      </Text>
      <div className={styles.Table}>
        <div className={styles.TableHeader}>
          {headers.map((item, ind) => (
            <Text key={ind} size={10} weight="medium" color={color}>
              {item}
            </Text>
          ))}
        </div>
        <div
          className={`${styles.TableBody} ${
            info?.length && styles.TableBodyActive
          }`}
        >
          {info &&
            info.map((tx) => (
              <TransactionItem
                key={tx.id_transaction}
                transaction={tx}
                color={color}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
