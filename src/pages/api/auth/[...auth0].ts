import {
  handleAuth,
  handleCallback,
  handleLogin,
  handleLogout,
} from '@auth0/nextjs-auth0'

import { CLIENT_URL } from '~/graphql/constants'
import { afterCallback } from '~/lib/auth0/afterCallback'

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        returnTo: req.headers.referer,
        authorizationParams: {
          connection: 'twitter',
        },
      })
    } catch (error) {
      res.status(error.status || 500).end(error.message)
    }
  },
  async logout(req, res) {
    try {
      await handleLogout(req, res, {
        returnTo: CLIENT_URL,
      })
    } catch (error) {
      res.status(error.status || 500).end(error.message)
    }
  },
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback })
    } catch (error) {
      res.status(error.status || 500).end(error.message)
    }
  },
})
