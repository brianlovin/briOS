import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <span className="absolute flex p-2 space-x-1 transform -translate-y-full bg-white border-b border-gray-150 dark:border-gray-800 dark:bg-gray-900 text-tertiary focus-within:relative focus-within:translate-y-0">
            <a className="font-semibold text-primary" href="#main">
              Skip to content
            </a>
            <span>(if available)</span>
            <span>or</span>
            <a className="font-semibold text-primary" href="#list">
              jump to list
            </a>
            <span>(if available)</span>
          </span>

          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
