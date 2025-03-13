import { useState } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import Notice from "@/shared/ui/notice/Notice";
import cn from "classnames";
import Text, { TextColor } from "@/shared/ui/text/Text";

interface IParams {
  label: string;
  value: string;
  color?: TextColor;
}

const CopyText = ({ label, value, color }: IParams) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div
      className={cn(styles.CopyText, styles[`CopyText-${color}`])}
      onClick={copyToClipboard}
      color={color}
    >
      <Text size={12} color={color} weight="regular">
        {label}
      </Text>
      <Text size={15} color={color} weight="medium">
        {value}
      </Text>
      <div className={cn(styles.CopyIcon, styles[`CopyIcon-${color}`])}>
        <Image
          src={color === "dark" ? "/copy-dark.svg" : "/copy-light.svg"}
          alt="Loader"
          width={10}
          height={10}
        />
      </div>
      <div className={styles.Copied}>
        {copied && <Notice title="Copied!" onClose={() => setCopied(false)} />}
      </div>
    </div>
  );
};

export default CopyText;
