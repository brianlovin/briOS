import { gql } from 'apollo-server-micro'

export default gql`
  type Post {
    canonical_url: String
    codeinjection_foot: String
    codeinjection_head: String
    comment_id: String
    created_at: String
    custom_excerpt: String
    excerpt: String
    feature_image: String
    featured: Boolean
    html: String
    id: String
    meta_description: String
    meta_title: String
    og_description: String
    og_image: String
    og_title: String
    published_at: String
    reading_time: Int
    slug: String
    title: String
    twitter_description: String
    twitter_image: String
    twitter_title: String
    updated_at: String
    url: String
    uuid: String
    visibility: String
  }

  type Bookmark {
    url: String!
    author: String
    creator: String
    description: String
    image: String
    site_name: String
    title: String
    host: String
  }

  type Episode {
    id: Int
    number: Int
    podcast_id: Int
    guide: String
    title: String
    author: String
    duration: Int
    explicit: Boolean
    description: String
    long_description: String
    published: Boolean
    published_at: String
    audio_file_size: Int
    audio_url: String
    sharing_url: String
  }

  type Query {
    bookmarks: [Bookmark]!
    episodes: [Episode]!
    posts(first: Int): [Post]!
    post(slug: String!): Post
  }
`
