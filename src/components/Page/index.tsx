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
      {/* <Footer /> */}
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
    <div className="flex flex-col space-y-3">
      <h1 className="text-4xl font-extrabold text-primary">{title}</h1>
      <p className="font-mono text-xl leading-snug text-tertiary">
        {subtitle}
        <span className="relative text-quaternary blink opacity-30 -top-0.5">
          █
        </span>
      </p>
    </div>
  )
}
