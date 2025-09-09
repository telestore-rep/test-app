import { FC } from "react";
import styles from "./styles.module.scss";
import Text, { TextColor } from "../text/Text";

interface TitleProps {
  title: string;
  color: TextColor;
}

export const Title: FC<TitleProps> = ({ title, color }) => {
  return (
    <div
      className={`${styles.TitleBlock} ${
        color === "dark" && styles.TitleBlockDark
      }`}
    >
      <Text size={12} weight="medium" color={color}>
        {title}
      </Text>
    </div>
  );
};
