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
    category: String
    twitterHandle: String
  }

  type Episode {
    id: String
    description: String
    legacy_id: String
    long_description: String
    published_at: String
    status: String
    title: String
    token: String
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

  type Query {
    bookmarks(skip: Int, category: String): [Bookmark]!
    episodes: [Episode]!
    posts(first: Int): [Post]!
    post(slug: String!): Post
    amaQuestions(skip: Int, status: AMAStatus): [AMA]!
    repos: [Repo]!
    isMe: Boolean
  }

  type Mutation {
    login(password: String!): Boolean
    logout: Boolean
    addBookmark(
      url: String!
      notes: String
      category: String
      twitterHandle: String
    ): Bookmark
    editBookmark(
      id: ID!
      title: String!
      notes: String
      category: String
      twitterHandle: String
    ): Bookmark
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
