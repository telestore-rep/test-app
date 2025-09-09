import { FC } from "react";
import styles from "./styles.module.scss";
import Text, { TextColor } from "../text/Text";
import Button from "../button/Button";

interface GetValueProps {
  color: TextColor;
  title: string;
  value: string;
  btnTitle: string;
  getFn: () => void;
  btnColor?: "black" | "white";
  btnTextColor?: "dark" | "light";
  testId?: string;
}

export const GetValue: FC<GetValueProps> = ({
  color,
  value,
  title,
  btnTitle,
  getFn,
  testId,
  btnColor = "white",
  btnTextColor = "light",
}) => {
  return (
    <div className={styles.GetValueWrap}>
      <Text color={color} size={10} weight="medium">
        {title}
      </Text>
      <div className={styles.Group}>
        <Text size={12} weight="regular" color={!value ? "grey" : color}>
          {value || "undefined"}
        </Text>
        <Button
          testId={testId}
          onClick={getFn}
          color={btnColor}
          className={styles.Btn}
        >
          <Text color={btnTextColor} size={10} weight="medium">
            {btnTitle}
          </Text>
        </Button>
      </div>
    </div>
  );
};
