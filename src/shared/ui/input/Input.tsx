"use client";

import { CSSProperties, Dispatch, SetStateAction } from "react";
import styles from "./styles.module.scss";
import cn from "classnames";
import { TextColor } from "../text/Text";

interface IInputProps {
  label?: string;
  testid?: string;
  placeholder?: string;
  style?: CSSProperties;
  color?: TextColor;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  validate?: (value: string) => boolean;
  error?: string;
}

const Input = ({
  label,
  placeholder,
  testid,
  style,
  color,
  value,
  setValue,
  validate,
  error,
}: IInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue === "") {
      setValue("");
      return;
    }

    if (!validate || validate(newValue)) {
      setValue(newValue);
    }
  };

  return (
    <div className={styles.Container}>
      {label && (
        <label className={styles.Label} htmlFor={label}>
          {label}
        </label>
      )}
      <input
        data-testid={testid}
        className={cn(styles.Input, styles[`Input-${color}`])}
        id={label || "input"}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        style={style}
      />
      {error && <span className={styles.ErrorText}>{error}</span>}
    </div>
  );
};

export default Input;
