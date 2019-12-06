import * as React from 'react'
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
  return (
    <FathomWrapper>
      {children}
    </FathomWrapper>
  );
}
