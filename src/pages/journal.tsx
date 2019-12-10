import React from 'react'
import Router from 'next/router'

export default class extends React.Component {
  static async getInitialProps({ res }) {
    if (res) {
      res.writeHead(301, {
        Location: 'https://brianlovin.com/overthought'
      })
      res.end()
    } else {
      Router.push('/overthought')
    }
    return {}
  }
}