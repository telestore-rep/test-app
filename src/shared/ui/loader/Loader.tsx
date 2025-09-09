import { FC } from "react";
import cn from "classnames";
import Image from "next/image";

import styles from "./styles.module.scss";

interface ILoaderProps {
  full?: boolean;
  size?: number;
  className?: string;
}

const Loader: FC<ILoaderProps> = ({ size = 20, full, className }) => (
  <div className={cn(styles.Loader, className, { [styles.Full]: full })}>
    <Image src="/loader.svg" alt="Loader" width={15} height={15} />
  </div>
);

export default Loader;
