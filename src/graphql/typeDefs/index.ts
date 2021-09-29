import { gql } from 'apollo-server-micro'

export default gql`
  type Post {
    canonical_url: String
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
    createdAt: String!
    updatedAt: String!
    url: String!
    host: String!
    title: String
    image: String
    siteName: String
    description: String
    comments: [Comment]!
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
    createdAt: String!
    updatedAt: String
    author: User
    text: String
    comments: [Comment]!
  }

  enum CommentType {
    BOOKMARK
    QUESTION
    STACK
    POST
  }

  enum UserRole {
    BLOCKED
    USER
    ADMIN
  }

  type User {
    id: ID!
    createdAt: String
    role: UserRole
    username: String
    avatar: String
    name: String
  }

  type Comment {
    id: ID!
    createdAt: String!
    updatedAt: String
    text: String
    author: User!
    viewerCanEdit: Boolean
    viewerCanDelete: Boolean
  }

  type Query {
    viewer: User
    bookmark(id: ID!): Bookmark
    bookmarks(skip: Int): [Bookmark]!
    comment(id: ID!): Comment
    comments(refId: String, type: CommentType): [Comment]!
    episodes: [Episode]!
    posts(first: Int, filter: String, order: String): [Post]!
    post(slug: String!): Post
    amaQuestion(id: ID!): AMA
    amaQuestions(skip: Int, status: AMAStatus): [AMA]!
    repos: [Repo]!
    signedUploadUrl(id: ID!): String
    signedPlaybackUrl(id: ID!): String
    transcription(transcriptionId: ID!): String
  }

  type Mutation {
    addBookmark(url: String!): Bookmark
    editBookmark(id: ID!, title: String!): Bookmark
    deleteBookmark(id: ID!): Boolean
    addBookmarkReaction(id: ID!): Bookmark
    addAMAQuestion(text: String!): Boolean
    deleteAMAQuestion(id: ID!): Boolean
    editAMAQuestion(
      id: ID!
      answer: String
      question: String
      status: AMAStatus
      audioWaveform: [Float]
    ): AMA
    addAMAReaction(id: ID!): AMA
    addAMAAudioPlay(id: ID!): Boolean
    transcribeAudio(url: String!): String
    addComment(refId: String!, type: CommentType!, text: String!): Comment
    editComment(id: ID!, text: String): Comment
    deleteComment(id: ID!): Boolean
  }
`
