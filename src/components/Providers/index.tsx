import { ThemeProvider } from 'styled-components';
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import GlobalStyles from '../GlobalStyles';
import SEO from '../SEO';
import { theme } from '../theme';
import SentryProvider from '../Sentry';

interface Props {
  children?: any;
}

export default ({ children }: Props) => (
  <>
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
      <link rel="manifest" href="/static/manifest.json" />
      <meta name="msapplication-TileColor" content={theme.brand.default} />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="theme-color" content={theme.brand.default} />
      <link
        rel="mask-icon"
        href="/static/meta/website_icon.svg"
        color={theme.brand.default}
      ></link>
    </Head>
    <GlobalStyles />
    <SentryProvider>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </SentryProvider>
  </>
);
