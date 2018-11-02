// @flow
import * as React from "react";
import Head from 'next/head'
import Page, { SectionHeading, Heading, Subheading } from '../components/Page'
import type { GetInitialProps } from '../types'
import DesignDetailsGrid from '../components/DesignDetailsGrid'
import OpenSourceGrid from '../components/OpenSourceGrid'
import BooksGrid from '../components/BooksGrid'
import MusicGrid from '../components/MusicGrid'
import DesignDetailsPlayer from '../components/DesignDetailsPlayer'
import Home from './index'

class Books extends React.Component<{}> {
  static async getInitialProps({ res }: GetInitialProps) {
    if (res) {
      const cacheAge = 60 * 60 * 24 * 30
      res.setHeader('Cache-Control', `public,s-maxage=${cacheAge}`)
    }

    return {}
  }

  render() {
    return <Home />
  }
}

export default Books;
