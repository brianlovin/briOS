import React from 'react'
import Header from '~/components/Header'
import { Footer } from '../Footer'

interface Props {
  children: React.ReactNode
}

export default function Page(props: Props) {
  const { children } = props
  return (
    <>
      <Header />
      <div className="px-4 py-32 lg:px-0">{children}</div>
      <Footer />
    </>
  )
}

interface HeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader(props: HeaderProps) {
  const { title, subtitle } = props
  return (
    <div className="flex flex-col space-y-2 md:items-center md:text-center">
      <h1>{title}</h1>
      {subtitle && <p className="text-2xl">{subtitle}</p>}
    </div>
  )
}
