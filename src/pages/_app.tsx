 
import * as React from 'react';
import App from 'next/app';
import Fathom from 'fathom-client'
import { ATVImgStyles } from '../lib/atvimg/style';
import { ATVScript } from '../lib/atvimg/script';
import Providers from '../components/Providers';
import Router from 'next/router'

Router.events.on('routeChangeComplete', () => {
  Fathom.trackPageview()
  ATVScript();
})

function FathomWrapper(props) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      Fathom.load();
      Fathom.setSiteId('ONFMHEEY');
      Fathom.trackPageview();
    }
    ATVScript();
  }, [])
  return <div {...props} />
}

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <FathomWrapper>
        <Providers>
          <ATVImgStyles />
          <Component {...pageProps} />
        </Providers>
      </FathomWrapper>
    );
  }
}

export default MyApp;
