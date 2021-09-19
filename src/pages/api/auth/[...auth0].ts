import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0'
import { CLIENT_URL } from '~/graphql/constants'

export default handleAuth({
  async logout(req, res) {
    try {
      await handleLogout(req, res, {
        returnTo: req.headers.referer,
      })
    } catch (error) {}
  },
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        returnTo: req.headers.referer,
      })
    } catch (error) {}
  },
})
