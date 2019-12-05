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
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // prevents ssr flash for mismatched dark mode
  if (!mounted) return null

  return (
    <FathomWrapper>
      {children}
    </FathomWrapper>
  );
}
