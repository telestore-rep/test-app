"use client";
import { FC } from "react";
import styles from "./styles.module.scss";
import Text, { TextColor } from "../text/Text";
import Link from "next/link";
import CopyText from "../copy-text/CopyText";

interface AuthInfoProps {
  color?: TextColor;
  password: string;
  login: string;
  loggedPhone: string;
  link: string;
  sdkLink: string;
  sourceLink: string;
}

export const AuthInfo: FC<AuthInfoProps> = ({
  color,
  password,
  loggedPhone,
  login,
  link = "/",
  sdkLink = "/",
  sourceLink = "/",
}) => {
  const docsTitle =
    color === "dark"
      ? "Server SDK source code and docs"
      : "Client SDK source code and docs";
  const goToTitle =
    color === "dark"
      ? "Go to TeleStore Developer panel"
      : "Go to TeleStore User profile";

  return (
    <div className={styles.InfoWrap}>
      <Link href={sdkLink} className={styles.Link}>
        <Text
          size={12}
          weight="medium"
          className={styles.LinkTitle}
          color={color}
        >
          {docsTitle}
        </Text>
      </Link>
      <Link href={sourceLink} className={styles.Link}>
        <Text
          size={12}
          weight="medium"
          className={styles.LinkTitle}
          color={color}
        >
          Test App Source code
        </Text>
      </Link>
      <div className={styles.LoggedInfo}>
        <Text size={15} weight="medium" color={color}>
          {login}
        </Text>
        <CopyText
          color={color}
          label={color === "dark" ? "log In Telestore:" : "log In:"}
          value={loggedPhone}
        />
        <CopyText color={color} label="Password:" value={password} />
      </div>
      <Link
        data-testid="LINK_TELE"
        href={link}
        target="_blank"
        className={`${styles.Link} ${styles.LinkPanel}`}
      >
        <Text
          size={12}
          weight="medium"
          className={styles.LinkTitle}
          color={color}
        >
          {goToTitle}
        </Text>
      </Link>
    </div>
  );
};
