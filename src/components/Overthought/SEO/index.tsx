import * as React from 'react';
import { NextSeo } from 'next-seo'
import Head from 'next/head'

export default function OverthoughtSEO() {
  return (
    <React.Fragment>
      <Head>
        <link 
          rel="alternate" 
          type="application/rss+xml" 
          title="RSS Feed for Overthought" 
          href="/overthought/rss" />
      </Head>
      <NextSeo
        title={"Overthought"}
        description={"Overthinking out loud about design, development, and building products."}
        openGraph={{
          url: "https://brianlovin.com/overthought",
          title: "Overthought",
          description: "Overthinking out loud about design, development, and building products.",
          site_name: "Overthought",
        }}
      />
    </React.Fragment>
  );
}