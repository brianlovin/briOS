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
      })
    } catch (error) {}
  },
  async logout(req, res) {
    try {
      await handleLogout(req, res, {
        returnTo: CLIENT_URL,
      })
    } catch (error) {}
  },
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback })
    } catch (error) {}
  },
})
