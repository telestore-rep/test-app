import { FC } from "react";
import styles from "./styles.module.scss";

interface IErrorMessage {
  errors: Record<string, string>;
  onRemove?: (key: string) => void;
}

const ErrorMessage: FC<IErrorMessage> = ({ errors, onRemove }) => (
  <>
    {Object.entries(errors).map(([key, value]) => (
      <span
        key={key}
        className={styles.error}
        onClick={() => onRemove?.(key)}
        style={{ cursor: "pointer" }}
      >
        {`${key}: ${value}`}
      </span>
    ))}
  </>
);

export default ErrorMessage;
