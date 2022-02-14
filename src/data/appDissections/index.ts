import carousel from './carousel'
import flickr from './flickr'
import foursquare from './foursquare'
import googleSearch from './googleSearch'
import hyperlapse from './hyperlapse'
import inbox from './inbox'
import instagram from './instagram'
import lollipop from './lollipop'
import neubible from './neubible'
import paper from './paper'
import path from './path'
import pinterest from './pinterest'
import quartz from './quartz'
import secret from './secret'
import shorts from './shorts'
import skype from './skype'
import soundcloud from './soundcloud'
import squareOrder from './squareOrder'
import stripeDashboard from './stripeDashboard'
import sunrise from './sunrise'
import tumblr from './tumblr'
import twitter from './twitter'

export interface DesignDetail {
  title: string
  description: string
  media: Array<string> | null
  orientation?: 'landscape'
}

export interface DesignDetailsPost {
  slug: string
  title: string
  description: string
  createdAt: string
  details: Array<DesignDetail>
  tint: string
}

export interface DesignDetailsPostSummary {
  slug: string
  title: string
  tint: string
  firstDetail: DesignDetail
  detailsCount: number
  createdAt: string
}

const allPosts: DesignDetailsPost[] = [
  twitter,
  paper,
  secret,
  googleSearch,
  sunrise,
  flickr,
  skype,
  path,
  soundcloud,
  foursquare,
  pinterest,
  hyperlapse,
  inbox,
  squareOrder,
  lollipop,
  instagram,
  tumblr,
  carousel,
  quartz,
  stripeDashboard,
  shorts,
  neubible,
].reverse()

function extractSummary({
  title,
  slug,
  tint,
  details,
  createdAt,
}: DesignDetailsPost): DesignDetailsPostSummary {
  return {
    title,
    slug,
    tint,
    firstDetail: details[1],
    detailsCount: details.length,
    createdAt,
  }
}

export const summaries: DesignDetailsPostSummary[] =
  allPosts.map(extractSummary)

export default allPosts
