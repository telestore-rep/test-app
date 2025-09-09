import { FC } from "react";

import styles from "./styles.module.css";
import Text from "../text/Text";

interface INotificationProps {
  title: string;
  iconCode?: string;
  time?: number;
}

interface INoticeProps extends Omit<INotificationProps, "time"> {
  onClose: () => void;
}

const Notice: FC<INoticeProps> = ({ title, onClose }) => {
  return (
    <div className={styles.Notice} onClick={onClose}>
      <Text size={9} weight="regular">
        {title}
      </Text>
    </div>
  );
};

export default Notice;
