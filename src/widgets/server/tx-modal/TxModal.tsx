"use client";
import { useContext, useState, type FC } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import { ServerContext } from "@/providers/ServerProvider";
import Button from "@/shared/ui/button/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface TxModalProps { }

export const TxModal: FC<TxModalProps> = () => {
    const { codeInfo, telestoreTxCode } = useContext(ServerContext);
    const [visible, setVisible] = useState<boolean>(true);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleClose = () => {
        setVisible(false);
        try {
            const params = new URLSearchParams(searchParams?.toString());
            params.delete("telestore_code");
            const query = params.toString();
            const href = query ? `${pathname}?${query}` : `${pathname}`;
            router.replace(href, { scroll: false });
        } catch (_) { }
    };

    return (
        <div
            className={`${styles.Modal} ${visible && styles.ModalVisible}`}
            data-testid="PAYMENT_MODAL"
        >
            <div className={styles.ModalBody}>
                <div className={styles.ModalHeader}>
                    <span className={styles.ModalTitleMain}>Payment info</span>
                    <Image
                        src="/close.png"
                        alt="Loader"
                        className={styles.Close}
                        width={10}
                        height={10}
                        onClick={handleClose}
                    />
                </div>
                {telestoreTxCode === "failure" ? (
                    <div className={styles.ModalItem}>
                        <span className={styles.ModalTitle} data-testid="acq-status-title">
                            Acquiring status:
                        </span>
                        <span
                            className={styles.ModalSubtitle}
                            data-testid="acq-status-value"
                        >
                            {telestoreTxCode || "-"}
                        </span>
                    </div>
                ) : (
                    <>
                        <div className={styles.ModalItem}>
                            <span className={styles.ModalTitle} data-testid="invoice-title">
                                Your invoice:
                            </span>
                            <span
                                className={styles.ModalSubtitle}
                                data-testid="invoice-value"
                            >
                                {codeInfo?.code || "-"}
                            </span>
                        </div>
                        <div className={styles.ModalItem}>
                            <span
                                className={styles.ModalTitle}
                                data-testid="acq-status-title"
                            >
                                Acquiring status:
                            </span>
                            <span
                                className={styles.ModalSubtitle}
                                data-testid="acq-status-value"
                            >
                                Success
                            </span>
                        </div>
                        <div className={styles.ModalItem}>
                            <span className={styles.ModalTitle} data-testid="tx-status-title">
                                Transaction status:
                            </span>
                            <span
                                className={styles.ModalSubtitle}
                                data-testid="tx-status-value"
                            >
                                {codeInfo?.state || "-"}
                            </span>
                        </div>
                    </>
                )}
                <Button
                    className={styles.Btn}
                    color="black"
                    onClick={handleClose}
                    data-testid="PAYMENT_BUTTON"
                >
                    Ok
                </Button>
            </div>
        </div>
    );
};
