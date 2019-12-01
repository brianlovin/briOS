import * as React from 'react'
import { ThemeProvider } from 'styled-components';
import Head from 'next/head';
// import useDarkMode from 'use-dark-mode'
import { DefaultSeo } from 'next-seo';
import GlobalStyles from '../GlobalStyles';
import SEO from '../SEO';
import { light, dark } from '../theme';
import SentryProvider from '../Sentry';
import Fathom from 'fathom-client'
import Router from 'next/router'

interface Props {
  children?: any;
}

Router.events.on('routeChangeComplete', () => {
  if (process.env.NODE_ENV === 'production') {
    Fathom.trackPageview()
  }
})

function FathomWrapper(props) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      Fathom.load();
      Fathom.setSiteId('ONFMHEEY');
      Fathom.trackPageview();
    }
  }, [])
  return <span {...props} />
}

export default ({ children }: Props) => {
  // const { value } = useDarkMode(false)
  const theme = light

  return (
    <FathomWrapper>
      <DefaultSeo {...SEO} />
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/static/meta/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/static/meta/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/static/meta/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/static/meta/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/static/meta/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/static/meta/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/static/meta/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/static/meta/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/static/meta/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/static/meta/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/meta/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/static/meta/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/meta/favicon-16x16.png"
        />
        <link rel="manifest" href="/static/meta/site.webmanifest" />
        <meta name="msapplication-TileColor" content={light.brand.default} />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content={light.brand.default} />
        <link
          rel="mask-icon"
          href="/static/meta/website_icon.svg"
          color={light.brand.default}
        ></link>
      </Head>
      <SentryProvider>
        <ThemeProvider theme={theme}>
          {children}
          <GlobalStyles />
        </ThemeProvider>
      </SentryProvider>
    </FathomWrapper>
  );
}
