import styles from './styles.module.scss'
import { FC, ReactNode } from 'react'

interface MainLayoutProps {
    children: ReactNode
}

export const MainLayout:FC<MainLayoutProps> = ({children}) => {

    return (
        <div className={styles.MainLayout} >
            {children}
        </div>
    )
}