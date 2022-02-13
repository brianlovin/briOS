import { Authik } from '@authik/nextjs/server'

export const authik = new Authik(process.env.AUTHIK_SECRET_KEY)
