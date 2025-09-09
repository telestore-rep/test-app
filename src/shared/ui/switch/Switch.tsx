import { FC } from "react";
import styles from "./styles.module.css";

interface ISwitchProps {
  testId: string;
  on: boolean;
  onSwitch: () => void;
}

const Switch: FC<ISwitchProps> = ({ testId, on, onSwitch }) => (
  <div
    data-testid={testId}
    data-active={on}
    className={styles.Switch}
    onClick={onSwitch}
  />
);

export default Switch;
