import Providers from '.'

export function withProviders(fn) {
  return function withPage(page) {
    return <Providers pageProps={page.props}>{fn(page)}</Providers>
  }
}
