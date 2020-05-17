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
    id: ID!
    url: String!
    author: String
    creator: String
    description: String
    image: String
    site_name: String
    title: String
    host: String
    reactions: Int
    notes: String
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

  type Repo {
    org: String
    name: String
    description: String
    stars: Int
  }

  enum AMAStatus {
    PENDING
    ANSWERED
  }

  type AMA {
    id: String!
    question: String!
    status: AMAStatus
    answer: String
    createdAt: String
    updatedAt: String
    reactions: Int
  }

  type HNPost {
    id: ID!
    title: String
    points: Int
    user: String
    time_ago: String
    comments: String
    comments_count: Int
    url: String
    domain: String
  }

  type Query {
    bookmarks(skip: Int): [Bookmark]!
    episodes: [Episode]!
    posts(first: Int): [Post]!
    post(slug: String!): Post
    amaQuestions(skip: Int, status: AMAStatus): [AMA]!
    hnPosts(first: Int, sort: String): [HNPost]
    hnPost(id: ID!): HNPost
    repos: [Repo]!
    isMe: Boolean
  }

  type Mutation {
    login(password: String!): Boolean
    logout: Boolean
    addBookmark(url: String!, notes: String): Bookmark
    editBookmark(id: ID!, title: String!, notes: String): Bookmark
    deleteBookmark(id: ID!): Boolean
    addBookmarkReaction(id: ID!): Bookmark
    addAMAQuestion(question: String!): Boolean
    deleteAMAQuestion(id: ID!): Boolean
    editAMAQuestion(
      id: ID!
      answer: String
      question: String
      status: AMAStatus
    ): AMA
    addAMAReaction(id: ID!): AMA
  }
`
