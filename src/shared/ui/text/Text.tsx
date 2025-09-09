"use client";

import { FC, ReactNode, CSSProperties } from "react";
import styles from "./styles.module.scss";
import cn from "classnames";

export type TextColor = "dark" | "light" | 'grey';

interface ITextProps {
  weight?: "regular" | "medium" | "semibold" | "bold" | "extrabold" | "black";
  color?: TextColor;
  size?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

const Text: FC<ITextProps> = ({
  weight,
  color,
  size,
  className,
  style,
  children,
}) => {
  return (
    <p
      data-weight={weight}
      className={cn(styles.Text, styles[`Text-${color}`], className)}
      style={{ ...style, fontSize: size ? `${size}px` : undefined }}
    >
      {children}
    </p>
  );
};

export default Text;
