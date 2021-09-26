import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0'
import { afterCallback } from '~/lib/auth0/afterCallback'

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        returnTo: req.headers.referer,
      })
    } catch (error) {}
  },
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback })
    } catch (error) {}
  },
})
