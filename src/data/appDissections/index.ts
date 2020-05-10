import twitter from './twitter'
import paper from './paper'
import secret from './secret'
import googleSearch from './googleSearch'
import sunrise from './sunrise'
import flickr from './flickr'
import skype from './skype'
import path from './path'
import soundcloud from './soundcloud'
import foursquare from './foursquare'
import pinterest from './pinterest'
import hyperlapse from './hyperlapse'
import inbox from './inbox'
import squareOrder from './squareOrder'
import lollipop from './lollipop'
import instagram from './instagram'
import tumblr from './tumblr'
import carousel from './carousel'
import quartz from './quartz'
import stripeDashboard from './stripeDashboard'
import shorts from './shorts'
import neubible from './neubible'

export interface DesignDetail {
  title: string
  description: string
  media: Array<string>
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
}: DesignDetailsPost): DesignDetailsPostSummary {
  return {
    title,
    slug,
    tint,
    firstDetail: details[1],
    detailsCount: details.length,
  }
}

export const summaries: DesignDetailsPostSummary[] = allPosts.map(
  extractSummary
)

export default allPosts
