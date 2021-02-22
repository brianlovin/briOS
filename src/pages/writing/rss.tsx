import React from 'react'
import Router from 'next/router'

export default class extends React.Component {
  static async getInitialProps({ res }) {
    if (res) {
      res.writeHead(302, {
        Location: 'https://overthought.ghost.io/rss/',
      })
      res.end()
    } else {
      Router.push('/writing/rss')
    }
    return {}
  }
}
