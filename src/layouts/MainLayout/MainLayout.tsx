import React from 'react'
import { Footer } from 'src/components/Footer/Footer'
import { Header } from 'src/components/Header/Header'

interface Props {
    children?: React.ReactNode
}

export const MainLayout = ({ children }: Props) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}
