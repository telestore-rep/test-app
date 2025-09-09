import cn from "classnames";
import type { HTMLAttributes, ReactNode } from "react";

import styles from "./styles.module.css";

type Align =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "middle-left"
  | "middle-right"
  | "center";

type Padding = `${number} ${number} ${number} ${number}`;

export type Props = Omit<
  HTMLAttributes<HTMLDivElement>,
  "style" | "className"
> & {
  /**
   * Layout children
   */
  children: ReactNode;
  /**
   * Layout align
   */
  align: Align;
  /**
   * Layout data-test attribute
   */
  dataTest?: string;
  /**
   * Gap between children
   */
  gap?: string;
  /**
   * Should text have ellipsis
   */
  hasEllipsis?: boolean;
  /**
   * Should not shrink
   */
  hasNoShrink?: boolean;
  /**
   * Should have flex grow 1
   */
  hasGrow?: boolean;
  /**
   * Should wrap children
   */
  hasWrap?: boolean;
  /**
   * Add 100% height
   */
  hasFullHeight?: boolean;
  /**
   * Justify content space-between
   */
  justify?: "space-between";
  /**
   * Vertical layout
   */
  isColumn?: boolean;
  /**
   * Width 100%
   */
  isWide?: boolean;
  /**
   * Layout padding
   */
  padding?: Padding;
};

/**
 * Layout component. Used to create a components composition.
 */
export const Layout = ({
  children,
  align,
  dataTest,
  gap,
  hasEllipsis,
  hasNoShrink,
  hasGrow,
  hasWrap,
  hasFullHeight,
  justify,
  isColumn,
  isWide,
  padding,
  ...rest
}: Props) => {
  const normalizedPadding = padding
    ?.split(" ")
    .map((num) => num + "px")
    .join(" ");
  const normalizedGap = gap ? gap + "px" : undefined;

  const rootClasses = cn(styles.root, {
    [styles.hasEllipsis]: hasEllipsis,
    [styles.hasNoShrink]: hasNoShrink,
    [styles.hasGrow]: hasGrow,
    [styles.hasWrap]: hasWrap,
    [styles.hasFullHeight]: hasFullHeight,
    [styles.isColumn]: isColumn,
    [styles.isWide]: isWide,
    [styles.spaceBetween]: justify === "space-between",
    [styles.topLeft]: align === "top-left",
    [styles.middleLeft]: align === "middle-left",
    [styles.bottomLeft]: align === "bottom-left",
    [styles.topCenter]: align === "top-center",
    [styles.center]: align === "center",
    [styles.bottomCenter]: align === "bottom-center",
    [styles.topRight]: align === "top-right",
    [styles.middleRight]: align === "middle-right",
    [styles.bottomRight]: align === "bottom-right",
  });

  return (
    <div
      style={{ padding: normalizedPadding, gap: normalizedGap }}
      className={rootClasses}
      data-test={dataTest}
      {...rest}
    >
      {children}
    </div>
  );
};
