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
    faviconUrl: String
    description: String
    comments: [Comment]!
    tags: [Tag]!
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

  type Question {
    id: String!
    createdAt: String!
    updatedAt: String
    author: User
    title: String!
    description: String
    commentCount: Int
    comments: [Comment]!
  }

  enum CommentType {
    BOOKMARK
    QUESTION
    STACK
    POST
  }

  type Tag {
    name: String!
  }

  type Stack {
    id: ID!
    createdAt: String!
    updatedAt: String
    name: String!
    description: String
    image: String
    url: String!
    comments: [Comment]!
    tags: [Tag]!
    usedBy: [User]!
    usedByViewer: Boolean
  }

  enum UserRole {
    BLOCKED
    USER
    ADMIN
  }

  enum EmailSubscriptionType {
    HACKER_NEWS
    NEWSLETTER
  }

  type EmailSubscription {
    type: EmailSubscriptionType
    subscribed: Boolean
  }

  type User {
    id: ID!
    createdAt: String
    role: UserRole
    username: String
    avatar: String
    name: String
    isViewer: Boolean
    email: String
    pendingEmail: String
    emailSubscriptions: [EmailSubscription]
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
    user(username: String!): User
    bookmark(id: ID!): Bookmark
    bookmarks(tag: String): [Bookmark]!
    stack(id: ID!): Stack
    stacks(skip: Int): [Stack]!
    comment(id: ID!): Comment
    comments(refId: String, type: CommentType): [Comment]!
    episodes: [Episode]!
    posts(first: Int, filter: String, order: String): [Post]!
    post(slug: String!): Post
    question(id: ID!): Question
    questions: [Question]!
    repos: [Repo]!
    signedUploadUrl(id: ID!): String
    signedPlaybackUrl(id: ID!): String
    transcription(transcriptionId: ID!): String
    tags: [Tag]!
  }

  input EditUserInput {
    username: String
    email: String
  }

  input EmailSubscriptionInput {
    type: EmailSubscriptionType!
    subscribed: Boolean!
    email: String
  }

  input AddStackInput {
    name: String!
    url: String!
    image: String!
    description: String!
    tag: String
  }

  input EditStackInput {
    name: String!
    url: String!
    image: String!
    description: String!
    tag: String
  }

  input AddBookmarkInput {
    url: String!
    tag: String!
  }

  input EditBookmarkInput {
    title: String!
    description: String!
    tag: String!
    faviconUrl: String!
  }

  input EditQuestionInput {
    title: String!
    description: String
  }

  input AddQuestionInput {
    title: String!
    description: String
  }

  type Mutation {
    addBookmark(data: AddBookmarkInput!): Bookmark
    editBookmark(id: ID!, data: EditBookmarkInput!): Bookmark
    deleteBookmark(id: ID!): Boolean
    addStack(data: AddStackInput!): Stack
    editStack(id: ID!, data: EditStackInput!): Stack
    deleteStack(id: ID!): Boolean
    toggleStackUser(id: ID!): Stack
    addQuestion(data: AddQuestionInput!): Question
    editQuestion(id: ID!, data: EditQuestionInput!): Question
    deleteQuestion(id: ID!): Boolean
    addComment(refId: String!, type: CommentType!, text: String!): Comment
    editComment(id: ID!, text: String): Comment
    deleteComment(id: ID!): Boolean
    editUser(data: EditUserInput): User
    deleteUser: Boolean
    editEmailSubscription(data: EmailSubscriptionInput): User
  }
`
