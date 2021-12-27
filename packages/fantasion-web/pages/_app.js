import Head from 'next/head'

import { Component } from 'react'
import { appWithTranslation } from 'next-i18next'

import '../styles/globals.css'

class ErrorBoundary extends Component {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    }
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary fallback={<h1>oops</h1>}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}

export default appWithTranslation(MyApp)
