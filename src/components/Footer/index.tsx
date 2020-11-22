import React from 'react'
import Link from 'next/link'
import { Grid } from './style'

export function Footer() {
  return (
    <Grid>
      <Link href="/" as="/" passHref>
        <a className="black-link">Home</a>
      </Link>

      <Link href="/about" as="/about" passHref>
        <a className="black-link">About</a>
      </Link>

      <Link href="/overthought" as="/overthought" passHref>
        <a className="black-link">Overthought</a>
      </Link>

      <Link href="/design-details" as="/design-details" passHref>
        <a className="black-link">App Dissection</a>
      </Link>

      <Link href="/ama" as="/ama" passHref>
        <a className="black-link">AMA</a>
      </Link>

      <Link href="/bookmarks" as="/bookmarks" passHref>
        <a className="black-link">Bookmarks</a>
      </Link>

      <Link href="/hn" as="/hn" passHref>
        <a className="black-link">Hacker News</a>
      </Link>

      <a
        href="https://twitter.com/brian_lovin"
        target="_blank"
        rel="noopener noreferrer"
        className="black-link"
      >
        @brian_lovin
      </a>
    </Grid>
  )
}
