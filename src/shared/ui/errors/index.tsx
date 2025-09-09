import { FC } from "react";
import styles from "./styles.module.scss";

interface IErrorMessage {
  errors: Record<string, string>;
}

const ErrorMessage: FC<IErrorMessage> = ({ errors }) => (
  <>
    {Object.entries(errors).map((error) => {
      const [key, value] = error;
      return <span className={styles.error}>{`${key}: ${value}`}</span>;
    })}
  </>
);

export default ErrorMessage;
