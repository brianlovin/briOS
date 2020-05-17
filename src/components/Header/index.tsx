import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Container,
  MobileContainer,
  InnerGrid,
  MenuButton,
  CloseButton,
  Label,
  Background,
} from './style'

interface Props {
  activeRoute: string
}

const NavLinks = ({ activeRoute }: Props) => {
  return (
    <React.Fragment>
      <Label isActive={activeRoute === 'Home'}>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Label>

      <Label isActive={activeRoute === 'About'}>
        <Link href="/about">
          <a>About</a>
        </Link>
      </Label>

      <Label isActive={activeRoute === 'Overthought'}>
        <Link href="/overthought">
          <a>Overthought</a>
        </Link>
      </Label>

      <Label isActive={activeRoute === 'App Dissection'}>
        <Link href="/design-details">
          <a>App Dissection</a>
        </Link>
      </Label>

      <Label isActive={activeRoute === 'Ask Me Anything'}>
        <Link href="/ama">
          <a>AMA</a>
        </Link>
      </Label>

      <Label isActive={activeRoute === 'Bookmarks'}>
        <Link href="/bookmarks">
          <a>Bookmarks</a>
        </Link>
      </Label>
    </React.Fragment>
  )
}

export default function Header() {
  const [isExpanded, setExpanded] = React.useState(false)
  const router = useRouter()

  let activeRoute = ''
  let activePath = ''
  if (router.pathname.startsWith('/about')) {
    activeRoute = 'About'
    activePath = '/about'
  }
  if (router.pathname.includes('/bookmarks')) {
    activeRoute = 'Bookmarks'
    activePath = '/bookmarks'
  }
  if (router.pathname.includes('/design-details')) {
    activeRoute = 'App Dissection'
    activePath = '/design-details'
  }
  if (router.pathname.includes('/overthought')) {
    activeRoute = 'Overthought'
    activePath = '/overthought'
  }
  if (router.pathname.includes('/ama')) {
    activeRoute = 'Ask Me Anything'
    activePath = '/ama'
  }
  if (router.pathname.includes('/hn')) {
    activeRoute = 'Hacker News'
    activePath = '/hn'
  }

  return (
    <React.Fragment>
      <MobileContainer expanded={isExpanded} data-cy="header">
        <Background />
        {isExpanded ? (
          <React.Fragment>
            <CloseButton
              onClick={() => setExpanded(false)}
              visible={isExpanded}
            >
              ×
            </CloseButton>
            <NavLinks activeRoute={activeRoute} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <MenuButton onClick={() => setExpanded(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                {' '}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1 2.75C1 2.55109 1.07902 2.36032 1.21967 2.21967C1.36032 2.07902 1.55109 2 1.75 2H14.25C14.4489 2 14.6397 2.07902 14.7803 2.21967C14.921 2.36032 15 2.55109 15 2.75C15 2.94891 14.921 3.13968 14.7803 3.28033C14.6397 3.42098 14.4489 3.5 14.25 3.5H1.75C1.55109 3.5 1.36032 3.42098 1.21967 3.28033C1.07902 3.13968 1 2.94891 1 2.75ZM1 7.75C1 7.55109 1.07902 7.36032 1.21967 7.21967C1.36032 7.07902 1.55109 7 1.75 7H14.25C14.4489 7 14.6397 7.07902 14.7803 7.21967C14.921 7.36032 15 7.55109 15 7.75C15 7.94891 14.921 8.13968 14.7803 8.28033C14.6397 8.42098 14.4489 8.5 14.25 8.5H1.75C1.55109 8.5 1.36032 8.42098 1.21967 8.28033C1.07902 8.13968 1 7.94891 1 7.75ZM1.75 12C1.55109 12 1.36032 12.079 1.21967 12.2197C1.07902 12.3603 1 12.5511 1 12.75C1 12.9489 1.07902 13.1397 1.21967 13.2803C1.36032 13.421 1.55109 13.5 1.75 13.5H14.25C14.4489 13.5 14.6397 13.421 14.7803 13.2803C14.921 13.1397 15 12.9489 15 12.75C15 12.5511 14.921 12.3603 14.7803 12.2197C14.6397 12.079 14.4489 12 14.25 12H1.75Z"
                ></path>
              </svg>
            </MenuButton>
            <Link href={activePath}>
              <a>{activeRoute}</a>
            </Link>
          </React.Fragment>
        )}
      </MobileContainer>

      <Container data-cy="header">
        <InnerGrid>
          <NavLinks activeRoute={activeRoute} />
        </InnerGrid>
        <Background />
      </Container>
    </React.Fragment>
  )
}
