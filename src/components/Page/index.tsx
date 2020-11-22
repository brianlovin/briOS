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
      <div className="lg:px-0 px-4 py-32">{children}</div>
      <Footer />
    </>
  )
}
