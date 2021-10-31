import * as React from 'react'

import { LoadingSpinner } from '~/components/LoadingSpinner'

function ContentContainer(props) {
  return (
    <div
      className="w-full max-w-3xl px-4 py-8 pb-10 mx-auto md:px-8"
      {...props}
    />
  )
}

interface DetailContainerProps {
  children: React.ReactNode
}

const Container = React.forwardRef<HTMLDivElement, DetailContainerProps>(
  (props, ref) => {
    return (
      <div
        ref={ref}
        className="relative flex flex-col w-full max-h-screen overflow-y-auto bg-white dark:bg-black"
        {...props}
      />
    )
  }
)

function Header(props) {
  return <div className="space-y-3" {...props} />
}

interface TitleProps {
  children: React.ReactNode
}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>((props, ref) => {
  return (
    <h1
      ref={ref}
      className="font-sans text-2xl font-bold md:text-3xl text-primary"
      {...props}
    />
  )
})

function Loading() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center flex-1">
        <LoadingSpinner />
      </div>
    </Container>
  )
}

export const Detail = {
  Container,
  ContentContainer,
  Header,
  Title,
  Loading,
}
