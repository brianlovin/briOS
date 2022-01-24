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
          <span className="text-tertiary absolute flex -translate-y-full transform space-x-1 border-b border-gray-150 bg-white p-2 focus-within:relative focus-within:translate-y-0 dark:border-gray-800 dark:bg-gray-900">
            <a className="text-primary font-semibold" href="#main">
              Skip to content
            </a>
            <span>(if available)</span>
            <span>or</span>
            <a className="text-primary font-semibold" href="#list">
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
