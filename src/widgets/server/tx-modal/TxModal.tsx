import {useContext, useState, type FC} from 'react'
import styles from './styles.module.css'
import Image from "next/image";
import { ServerContext } from '@/providers/ServerProvider';
import Button from '@/shared/ui/button/Button';

interface TxModalProps {}

export const TxModal:FC<TxModalProps> = () => {
    const {acqStatus, codeInfo} = useContext(ServerContext);
    const [visible, setVisible] = useState<boolean>(true)

    return (
        <div className={`${styles.Modal} ${visible && styles.ModalVisible}`} >
            <div className={styles.ModalBody} >
                <div className={styles.ModalHeader} >
                    <span className={styles.ModalTitleMain} >Payment info</span>
                    <Image
                        src='/close.png'
                        alt="Loader"
                        className={styles.Close}
                        width={10}
                        height={10}
                        onClick={() => {
                            setVisible(false)
                        }}
                    />
                </div>
                <div className={styles.ModalItem} >
                    <span className={styles.ModalTitle} >Your invoice:</span>
                    <span className={styles.ModalSubtitle} >{codeInfo?.code || '-'}</span>
                </div>
                <div className={styles.ModalItem} >
                    <span className={styles.ModalTitle} >Acquiring status:</span>
                    <span className={styles.ModalSubtitle} >{acqStatus || '-'}</span>
                </div>
                <div className={styles.ModalItem} >
                    <span className={styles.ModalTitle} >Transaction status:</span>
                    <span className={styles.ModalSubtitle} >{codeInfo?.state || '-'}</span>
                </div>
                <Button className={styles.Btn} color='black' onClick={() => {
                            setVisible(false)
                        }} >
                    Ok
                </Button>
            </div>
        </div>
    )
}