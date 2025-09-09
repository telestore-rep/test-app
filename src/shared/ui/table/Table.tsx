import { FC } from "react";
import styles from "./styles.module.scss";
import Text, { TextColor } from "../text/Text";
import { ITransaction, TxCodesOut } from "@/app/types/types";
import Link from "next/link";

interface TableProps {
  title: string;
  color: TextColor;
  info?: { [key: string]: any }[] | null;
  headers: string[];
  testId?: string;
}

type TransactionProps = {
  transaction: ITransaction | TxCodesOut
  color: TextColor;
  id: number;
};

const TransactionItem: React.FC<TransactionProps> = ({
  transaction,
  color,
  id
}) => {

  const code = 'code' in transaction ? transaction.code : undefined;

  return (
    <div
      data-testid={`${code}-${id}`}
      className={`${styles.TxItem} ${color === "dark" && styles.TxItemDark}`}
    >
      {Object.entries(transaction).map(([key, value], index, arr) => {
        const isLast = index === arr.length - 1;
        const isAmount = key.toLowerCase() === "amount";
        const isLink = key.toLowerCase() === "link";

        return (
          <Text size={10} weight="regular" color={color} key={key}>
            {isLink ? (
              <Link href={String(value)} passHref legacyBehavior>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.Link}
                >
                  {String(value)}
                </a>
              </Link>
            ) : Array.isArray(value) ? (
              value.join(", ")
            ) : (
              String(value) + (isAmount ? " USDT" : "")
            )}
            {!isLast && " /"}
          </Text>
        );
      })}
    </div>
  );
};

export const Table: FC<TableProps> = ({
  title,
  color,
  headers,
  info,
  testId,
}) => {
  return (
    <div
      data-testid={testId}
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
            info.map((tx, ind) => (
              <TransactionItem
                id={ind}
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
