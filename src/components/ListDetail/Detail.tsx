import * as React from 'react'

function ContentContainer(props) {
  return (
    <div className="w-full max-w-3xl p-4 mx-auto md:p-8 2xl:p-12" {...props} />
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

export const Detail = {
  Container,
  ContentContainer,
  Header,
  Title,
}
