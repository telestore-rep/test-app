import { Dispatch, FC, SetStateAction } from "react";
import styles from "./styles.module.scss";
import Button from "../button/Button";
import Text from "../text/Text";
import { InfoCard } from "../info-card/InfoCard";

interface AppDataProps {
  title: string;
  color: "light" | "dark";
  value: string;
  nameBtn: string;
  btnDisabled?: boolean;
  onSubmit: () => void;
  onChange: Dispatch<SetStateAction<string>>;
  height?: string | number;
  testIdCard?: string;
  testIdBtn?: string;
}

export const AppData: FC<AppDataProps> = ({
  color,
  title,
  value,
  nameBtn,
  btnDisabled = false,
  onChange,
  onSubmit,
  height,
  testIdCard,
  testIdBtn,
}) => {
  return (
    <div className={styles.AppDataWrap}>
      <InfoCard
        testId={testIdCard}
        title={title}
        color={color}
        value={value}
        onChange={onChange}
        height={height}
      />
      <div className={styles.Btns}>
        <Button
          testId={testIdBtn}
          onClick={onSubmit}
          disabled={btnDisabled}
          fullWidth
        >
          <Text size={12} weight="regular" color={color}>
            {nameBtn}
          </Text>
        </Button>
      </div>
    </div>
  );
};
