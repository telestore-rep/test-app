import { FC } from "react";
import styles from "./styles.module.scss";
import Text, { TextColor } from "../text/Text";

export type InfoItem = {
  title: string;
  value?: string;
};

interface InfoBlockProps {
  title: string;
  color: TextColor;
  items: InfoItem[];
  testId?: string;
}

export const InfoBlock: FC<InfoBlockProps> = ({
  title,
  color,
  items,
  testId,
}) => {
  return (
    <div
      data-testid={testId}
      className={`${styles.InfoBlock} ${
        color === "dark" && styles.InfoBlockDark
      }`}
    >
      <Text color={color} weight="medium" size={12}>
        {title}
      </Text>
      <div className={styles.InfoList}>
        {items.map((item, ind) => (
          <div key={ind} className={styles.InfoListItem}>
            <Text size={12} weight="regular" color={color}>
              {item.title}
            </Text>
            <Text size={10} weight="medium" color={color}>
              {item.value}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};
