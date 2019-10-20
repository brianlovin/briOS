 
import * as React from 'react';
import App from 'next/app';
import { ATVImgStyles } from '../lib/atvimg/style';
import { ATVScript } from '../lib/atvimg/script';
import Providers from '../components/Providers';

class MyApp extends App {
  componentDidMount() {
    ATVScript();
  }

  componentDidUpdate() {
    ATVScript();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Providers>
        <ATVImgStyles />
        <Component {...pageProps} />
      </Providers>
    );
  }
}

export default MyApp;
