import React from 'react'
import Link from 'next/link'
import { A } from '~/components/Typography'
import { Grid } from './style'

export function Footer() {
  return (
    <Grid>
      <Link href="/" as="/">
        <A>Home</A>
      </Link>

      <Link href="/about" as="/about">
        <A>About</A>
      </Link>

      <Link href="/overthought" as="/overthought">
        <A>Overthought</A>
      </Link>

      <Link href="/design-details" as="/design-details">
        <A>App Dissection</A>
      </Link>

      <Link href="/bookmarks" as="/bookmarks">
        <A>Bookmarks</A>
      </Link>

      <A href="https://twitter.com/brian_lovin" target="_blank" rel="noopener noreferrer">@brian_lovin</A>
    </Grid>
  )
}