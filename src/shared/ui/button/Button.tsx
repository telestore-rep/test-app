import { CSSProperties, ReactNode } from "react";
import styles from "./styles.module.scss";
import Loader from "../loader/Loader";

interface IButtonProps {
  color?: string;
  className?: string;
  children: ReactNode;
  size?: "sm" | "md";
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
}

const Button = ({
  children,
  color,
  size,
  disabled,
  onClick,
  fullWidth,
  className,
  isLoading,
}: IButtonProps) => {
  const dynamicStyles: CSSProperties = {
    ...(fullWidth ? { width: "100%" } : {}),
  };

  return (
    <button
      className={`${styles.Button} ${className}`}
      data-bg={color}
      data-size={size}
      disabled={disabled}
      onClick={onClick}
      style={dynamicStyles}
    >
      {isLoading ? <Loader /> : children}
    </button>
  );
};

export default Button;
