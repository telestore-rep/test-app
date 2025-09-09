import { Dispatch, FC, SetStateAction } from "react";
import styles from "./styles.module.scss";
import Text, { TextColor } from "../text/Text";
interface InfoCardProps {
  title: string;
  color: TextColor;
  value: string;
  onChange?: Dispatch<SetStateAction<string>>;
  height?: string | number;
  testId?: string;
}

export const InfoCard: FC<InfoCardProps> = ({
  title,
  color,
  value,
  onChange = () => {},
  height,
  testId,
}) => {
  return (
    <div
      data-testid={testId}
      className={`${styles.InfoCard} ${
        color === "dark" && styles.InfoCardDark
      }`}
    >
      <Text size={12} weight="medium" color={color}>
        {title}
      </Text>
      <div className={styles.InfoCardBody}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${styles.Textarea} ${
            color === "dark" && styles.TextareaDark
          }`}
          style={{ height }}
        ></textarea>
      </div>
    </div>
  );
};
