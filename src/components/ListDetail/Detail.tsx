import * as React from 'react'
import { Compass } from 'react-feather'

import { LoadingSpinner } from '~/components/LoadingSpinner'

import Button from '../Button'
import { TitleBar } from './TitleBar'

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
      className="font-sans text-2xl font-bold xl:text-3xl text-primary"
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

function Null() {
  return (
    <Container>
      <TitleBar title="Not found" />
      <div className="flex flex-col items-center justify-center flex-1 px-8 space-y-6 text-center lg:px-16">
        <Compass className="text-secondary" size={32} />
        <div className="flex flex-col space-y-1">
          <p className="font-semibold text-primary">
            What you seek does not exist.
          </p>
          <p className="text-tertiary">
            Maybe this link is broken. Maybe something was deleted, or moved. In
            any case, there’s nothing to see here...
          </p>
        </div>
        <Button href="/">Go home</Button>
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
  Null,
}
