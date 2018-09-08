// @flow
import App, { Container } from 'next/app'
import * as React from 'react'
import Head from 'next/head'
import withNProgress from "next-nprogress";
import NProgressStyles from "next-nprogress/styles";
import { theme } from '../components/theme'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <NProgressStyles color={theme.brand.default} />
        <Head>
          <title>Brian Lovin · Nice Boy™</title>
          <meta content="@brian_lovin" name="twitter:site" key="twitter:site" />
          <meta content={"Brian Lovin · Nice Boy™"} name="og:title" key="og:title" />
          <meta content={"Nicest not the iciest"} name="og:description" key="og:description" />
          <meta content={"Brian Lovin · Nice Boy™"} name="twitter:title" key="twitter:title" />
          <meta name="og:type" content="website" key="og:type" />
          <meta name="og:image" content="https://brianlovin.com/static/og-image.jpg" key="og:image" />
          <meta name="og:site_name" content="Brian Lovin" key="og:site_name" />
          <meta name="theme-color" content="#212325" key="theme-color" />
          <meta name="description" content="Nicest not the iciest" />

          <link rel="apple-touch-icon" sizes="180x180" href="static/meta/apple-touch-icon.png" />
          <link rel="manifest" href="/static/meta/site.webmanifest" />
          <link rel="mask-icon" href="/static/meta/safari-pinned-tab.svg" color="#212325" />
          <meta name="msapplication-TileColor" content="#ffffff" />

          {this.props.styleTags}
        </Head>
        <Component {...pageProps} />
      </Container>
    )
  }
}

const msDelay = 500;
export default withNProgress(msDelay)(MyApp);