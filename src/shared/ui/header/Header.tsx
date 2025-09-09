"use client";
import { FC } from "react";
import styles from "./styles.module.scss";
import Button from "../button/Button";
import Text, { TextColor } from "../text/Text";

interface IHeaderProps {
  title: string;
  btnEvent?: () => void;
  color?: TextColor;
}

export const Header: FC<IHeaderProps> = ({
  title,
  btnEvent,
  color = "dark",
}) => {
  return (
    <header
      className={`${styles.Header} ${color === "light" && styles.HeaderLight}`}
    >
      <Text size={20} color={color} weight="medium">
        {title}
      </Text>
      <Button
        testId={"GO_TO_SIDE"}
        onClick={btnEvent}
        color={color === "light" ? "black" : "light"}
      >
        <Text
          size={10}
          weight="medium"
          className={styles.BtnText}
          color={color === "light" ? "dark" : "light"}
        >
          Go to{" "}
        </Text>
        <Text
          size={12}
          weight="regular"
          className={styles.BtnText}
          color={color === "light" ? "dark" : "light"}
        >
          {color === "dark" ? "Client side" : "Server side"}
        </Text>
      </Button>
    </header>
  );
};
