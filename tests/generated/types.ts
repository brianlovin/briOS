import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type AddBookmarkInput = {
  tag: Scalars['String'];
  url: Scalars['String'];
};

export type AddPostInput = {
  excerpt?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  text: Scalars['String'];
  title: Scalars['String'];
};

export type AddQuestionInput = {
  description?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type AddStackInput = {
  description: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
  tag?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type Bookmark = {
  __typename?: 'Bookmark';
  createdAt: Scalars['Date'];
  description?: Maybe<Scalars['String']>;
  faviconUrl?: Maybe<Scalars['String']>;
  host: Scalars['String'];
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  reactionCount?: Maybe<Scalars['Int']>;
  tags: Array<Maybe<Tag>>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Date'];
  url: Scalars['String'];
  viewerHasReacted?: Maybe<Scalars['Boolean']>;
};

export type BookmarkEdge = {
  __typename?: 'BookmarkEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Bookmark>;
};

export type BookmarkFilter = {
  host?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
};

export type BookmarksConnection = {
  __typename?: 'BookmarksConnection';
  edges: Array<Maybe<BookmarkEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Date']>;
  viewerCanDelete?: Maybe<Scalars['Boolean']>;
  viewerCanEdit?: Maybe<Scalars['Boolean']>;
};

export type CommentType =
  | 'BOOKMARK'
  | 'POST'
  | 'QUESTION'
  | 'STACK';

export type EditBookmarkInput = {
  description?: Maybe<Scalars['String']>;
  faviconUrl?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type EditPostInput = {
  excerpt?: Maybe<Scalars['String']>;
  published?: Maybe<Scalars['Boolean']>;
  slug: Scalars['String'];
  text: Scalars['String'];
  title: Scalars['String'];
};

export type EditQuestionInput = {
  description?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type EditStackInput = {
  description: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
  tag?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type EditUserInput = {
  email?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type EmailSubscription = {
  __typename?: 'EmailSubscription';
  subscribed?: Maybe<Scalars['Boolean']>;
  type?: Maybe<EmailSubscriptionType>;
};

export type EmailSubscriptionInput = {
  email?: Maybe<Scalars['String']>;
  subscribed: Scalars['Boolean'];
  type: EmailSubscriptionType;
};

export type EmailSubscriptionType =
  | 'HACKER_NEWS'
  | 'NEWSLETTER';

export type HackerNewsComment = {
  __typename?: 'HackerNewsComment';
  comments?: Maybe<Array<Maybe<HackerNewsComment>>>;
  comments_count?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  level?: Maybe<Scalars['Int']>;
  time?: Maybe<Scalars['Int']>;
  time_ago?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
};

export type HackerNewsPost = {
  __typename?: 'HackerNewsPost';
  comments?: Maybe<Array<Maybe<HackerNewsComment>>>;
  comments_count?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  time?: Maybe<Scalars['Int']>;
  time_ago?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addBookmark?: Maybe<Bookmark>;
  addComment?: Maybe<Comment>;
  addPost?: Maybe<Post>;
  addQuestion?: Maybe<Question>;
  addStack?: Maybe<Stack>;
  deleteBookmark?: Maybe<Scalars['Boolean']>;
  deleteComment?: Maybe<Scalars['Boolean']>;
  deletePost?: Maybe<Scalars['Boolean']>;
  deleteQuestion?: Maybe<Scalars['Boolean']>;
  deleteStack?: Maybe<Scalars['Boolean']>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  editBookmark?: Maybe<Bookmark>;
  editComment?: Maybe<Comment>;
  editEmailSubscription?: Maybe<User>;
  editPost?: Maybe<Post>;
  editQuestion?: Maybe<Question>;
  editStack?: Maybe<Stack>;
  editUser?: Maybe<User>;
  toggleReaction?: Maybe<Reactable>;
  toggleStackUser?: Maybe<Stack>;
};


export type MutationAddBookmarkArgs = {
  data: AddBookmarkInput;
};


export type MutationAddCommentArgs = {
  refId: Scalars['ID'];
  text: Scalars['String'];
  type: CommentType;
};


export type MutationAddPostArgs = {
  data: AddPostInput;
};


export type MutationAddQuestionArgs = {
  data: AddQuestionInput;
};


export type MutationAddStackArgs = {
  data: AddStackInput;
};


export type MutationDeleteBookmarkArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePostArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteQuestionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteStackArgs = {
  id: Scalars['ID'];
};


export type MutationEditBookmarkArgs = {
  data: EditBookmarkInput;
  id: Scalars['ID'];
};


export type MutationEditCommentArgs = {
  id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
};


export type MutationEditEmailSubscriptionArgs = {
  data?: Maybe<EmailSubscriptionInput>;
};


export type MutationEditPostArgs = {
  data: EditPostInput;
  id: Scalars['ID'];
};


export type MutationEditQuestionArgs = {
  data: EditQuestionInput;
  id: Scalars['ID'];
};


export type MutationEditStackArgs = {
  data: EditStackInput;
  id: Scalars['ID'];
};


export type MutationEditUserArgs = {
  data?: Maybe<EditUserInput>;
};


export type MutationToggleReactionArgs = {
  refId: Scalars['ID'];
  type: ReactionType;
};


export type MutationToggleStackUserArgs = {
  id: Scalars['ID'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  createdAt?: Maybe<Scalars['Date']>;
  excerpt?: Maybe<Scalars['String']>;
  featureImage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  publishedAt?: Maybe<Scalars['Date']>;
  reactionCount?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Date']>;
  viewerHasReacted?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  bookmark?: Maybe<Bookmark>;
  bookmarks: BookmarksConnection;
  comment?: Maybe<Comment>;
  comments: Array<Maybe<Comment>>;
  hackerNewsPost?: Maybe<HackerNewsPost>;
  hackerNewsPosts: Array<Maybe<HackerNewsPost>>;
  post?: Maybe<Post>;
  posts: Array<Maybe<Post>>;
  question?: Maybe<Question>;
  questions: QuestionsConnection;
  stack?: Maybe<Stack>;
  stacks: StacksConnection;
  tags: Array<Maybe<Tag>>;
  user?: Maybe<User>;
  viewer?: Maybe<User>;
};


export type QueryBookmarkArgs = {
  id: Scalars['ID'];
};


export type QueryBookmarksArgs = {
  after?: Maybe<Scalars['String']>;
  filter?: Maybe<BookmarkFilter>;
  first?: Maybe<Scalars['Int']>;
};


export type QueryCommentArgs = {
  id: Scalars['ID'];
};


export type QueryCommentsArgs = {
  refId: Scalars['ID'];
  type: CommentType;
};


export type QueryHackerNewsPostArgs = {
  id: Scalars['ID'];
};


export type QueryPostArgs = {
  slug: Scalars['String'];
};


export type QueryPostsArgs = {
  filter?: Maybe<WritingFilter>;
};


export type QueryQuestionArgs = {
  id: Scalars['ID'];
};


export type QueryQuestionsArgs = {
  after?: Maybe<Scalars['String']>;
  filter?: Maybe<QuestionFilter>;
  first?: Maybe<Scalars['Int']>;
};


export type QueryStackArgs = {
  slug: Scalars['String'];
};


export type QueryStacksArgs = {
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  username: Scalars['String'];
};

export type Question = {
  __typename?: 'Question';
  author?: Maybe<User>;
  createdAt: Scalars['Date'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  reactionCount?: Maybe<Scalars['Int']>;
  status?: Maybe<QuestionStatus>;
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['Date']>;
  viewerCanComment?: Maybe<Scalars['Boolean']>;
  viewerCanEdit?: Maybe<Scalars['Boolean']>;
  viewerHasReacted?: Maybe<Scalars['Boolean']>;
};

export type QuestionEdge = {
  __typename?: 'QuestionEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Question>;
};

export type QuestionFilter = {
  status?: Maybe<QuestionStatus>;
};

export type QuestionStatus =
  | 'ANSWERED'
  | 'PENDING';

export type QuestionsConnection = {
  __typename?: 'QuestionsConnection';
  edges: Array<Maybe<QuestionEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type Reactable = Bookmark | Post | Question | Stack;

export type ReactionType =
  | 'BOOKMARK'
  | 'POST'
  | 'QUESTION'
  | 'STACK';

export type Stack = {
  __typename?: 'Stack';
  createdAt: Scalars['Date'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  reactionCount?: Maybe<Scalars['Int']>;
  slug: Scalars['String'];
  tags: Array<Maybe<Tag>>;
  updatedAt?: Maybe<Scalars['Date']>;
  url: Scalars['String'];
  usedBy: Array<Maybe<User>>;
  usedByViewer?: Maybe<Scalars['Boolean']>;
  viewerHasReacted?: Maybe<Scalars['Boolean']>;
};

export type StackEdge = {
  __typename?: 'StackEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Stack>;
};

export type StacksConnection = {
  __typename?: 'StacksConnection';
  edges: Array<Maybe<StackEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type Tag = {
  __typename?: 'Tag';
  name: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  email?: Maybe<Scalars['String']>;
  emailSubscriptions?: Maybe<Array<Maybe<EmailSubscription>>>;
  id: Scalars['ID'];
  isAdmin?: Maybe<Scalars['Boolean']>;
  isViewer?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  pendingEmail?: Maybe<Scalars['String']>;
  role?: Maybe<UserRole>;
  username?: Maybe<Scalars['String']>;
};

export type UserRole =
  | 'ADMIN'
  | 'BLOCKED'
  | 'USER';

export type WritingFilter = {
  published?: Maybe<Scalars['Boolean']>;
};

export type BookmarkCoreFragment = { __typename: 'Bookmark', id: string, url: string, host: string, title?: string | null | undefined, description?: string | null | undefined, faviconUrl?: string | null | undefined };

export type BookmarkListItemFragment = { __typename: 'Bookmark', id: string, url: string, host: string, title?: string | null | undefined, description?: string | null | undefined, faviconUrl?: string | null | undefined };

export type BookmarkDetailFragment = { __typename: 'Bookmark', reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, id: string, url: string, host: string, title?: string | null | undefined, description?: string | null | undefined, faviconUrl?: string | null | undefined, tags: Array<{ __typename?: 'Tag', name: string } | null | undefined> };

export type BookmarksConnectionFragment = { __typename?: 'BookmarksConnection', pageInfo?: { __typename?: 'PageInfo', hasNextPage?: boolean | null | undefined, totalCount?: number | null | undefined, endCursor?: string | null | undefined } | null | undefined, edges: Array<{ __typename?: 'BookmarkEdge', cursor?: string | null | undefined, node?: { __typename: 'Bookmark', id: string, url: string, host: string, title?: string | null | undefined, description?: string | null | undefined, faviconUrl?: string | null | undefined } | null | undefined } | null | undefined> };

export type CommentInfoFragment = { __typename: 'Comment', id: string, createdAt: any, updatedAt?: any | null | undefined, text?: string | null | undefined, viewerCanEdit?: boolean | null | undefined, viewerCanDelete?: boolean | null | undefined, author: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } };

export type HackerNewsListItemInfoFragment = { __typename?: 'HackerNewsPost', id?: string | null | undefined, title?: string | null | undefined, domain?: string | null | undefined, url?: string | null | undefined };

export type HackerNewsCommentInfoFragment = { __typename?: 'HackerNewsComment', id?: string | null | undefined, user?: string | null | undefined, comments_count?: string | null | undefined, time_ago?: string | null | undefined, level?: number | null | undefined, content?: string | null | undefined };

export type HackerNewsPostInfoFragment = { __typename?: 'HackerNewsPost', user?: string | null | undefined, time?: number | null | undefined, time_ago?: string | null | undefined, comments_count?: string | null | undefined, url?: string | null | undefined, domain?: string | null | undefined, content?: string | null | undefined, id?: string | null | undefined, title?: string | null | undefined, comments?: Array<{ __typename?: 'HackerNewsComment', id?: string | null | undefined, user?: string | null | undefined, comments_count?: string | null | undefined, time_ago?: string | null | undefined, level?: number | null | undefined, content?: string | null | undefined, comments?: Array<{ __typename?: 'HackerNewsComment', id?: string | null | undefined, user?: string | null | undefined, comments_count?: string | null | undefined, time_ago?: string | null | undefined, level?: number | null | undefined, content?: string | null | undefined, comments?: Array<{ __typename?: 'HackerNewsComment', id?: string | null | undefined, user?: string | null | undefined, comments_count?: string | null | undefined, time_ago?: string | null | undefined, level?: number | null | undefined, content?: string | null | undefined, comments?: Array<{ __typename?: 'HackerNewsComment', id?: string | null | undefined, user?: string | null | undefined, comments_count?: string | null | undefined, time_ago?: string | null | undefined, level?: number | null | undefined, content?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined };

export type PostCoreFragment = { __typename: 'Post', id: string, publishedAt?: any | null | undefined, title?: string | null | undefined, slug?: string | null | undefined, excerpt?: string | null | undefined };

export type PostListItemFragment = { __typename: 'Post', id: string, publishedAt?: any | null | undefined, title?: string | null | undefined, slug?: string | null | undefined, excerpt?: string | null | undefined };

export type PostDetailFragment = { __typename: 'Post', text?: string | null | undefined, featureImage?: string | null | undefined, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, id: string, publishedAt?: any | null | undefined, title?: string | null | undefined, slug?: string | null | undefined, excerpt?: string | null | undefined };

export type QuestionCoreFragment = { __typename: 'Question', id: string, title: string, createdAt: any, author?: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined };

export type QuestionListItemFragment = { __typename: 'Question', id: string, title: string, createdAt: any, author?: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined };

export type QuestionDetailFragment = { __typename: 'Question', description?: string | null | undefined, status?: QuestionStatus | null | undefined, viewerCanEdit?: boolean | null | undefined, viewerCanComment?: boolean | null | undefined, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, id: string, title: string, createdAt: any, author?: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined };

export type QuestionsConnectionFragment = { __typename?: 'QuestionsConnection', pageInfo?: { __typename?: 'PageInfo', hasNextPage?: boolean | null | undefined, totalCount?: number | null | undefined, endCursor?: string | null | undefined } | null | undefined, edges: Array<{ __typename?: 'QuestionEdge', cursor?: string | null | undefined, node?: { __typename: 'Question', id: string, title: string, createdAt: any, author?: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined } | null | undefined } | null | undefined> };

export type StackCoreFragment = { __typename: 'Stack', id: string, name: string, image?: string | null | undefined, url: string, slug: string };

export type StackListItemFragment = { __typename: 'Stack', id: string, name: string, image?: string | null | undefined, url: string, slug: string };

export type StackDetailFragment = { __typename: 'Stack', createdAt: any, description?: string | null | undefined, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, usedByViewer?: boolean | null | undefined, id: string, name: string, image?: string | null | undefined, url: string, slug: string, usedBy: Array<{ __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined>, tags: Array<{ __typename?: 'Tag', name: string } | null | undefined> };

export type StacksConnectionFragment = { __typename?: 'StacksConnection', pageInfo?: { __typename?: 'PageInfo', hasNextPage?: boolean | null | undefined, totalCount?: number | null | undefined, endCursor?: string | null | undefined } | null | undefined, edges: Array<{ __typename?: 'StackEdge', cursor?: string | null | undefined, node?: { __typename: 'Stack', id: string, name: string, image?: string | null | undefined, url: string, slug: string } | null | undefined } | null | undefined> };

export type UserInfoFragment = { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined };

export type UserSettingsFragment = { __typename?: 'User', email?: string | null | undefined, pendingEmail?: string | null | undefined, emailSubscriptions?: Array<{ __typename?: 'EmailSubscription', type?: EmailSubscriptionType | null | undefined, subscribed?: boolean | null | undefined } | null | undefined> | null | undefined };

export type EditBookmarkMutationVariables = Exact<{
  id: Scalars['ID'];
  data: EditBookmarkInput;
}>;


export type EditBookmarkMutation = { __typename?: 'Mutation', editBookmark?: { __typename: 'Bookmark', reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, id: string, url: string, host: string, title?: string | null | undefined, description?: string | null | undefined, faviconUrl?: string | null | undefined, tags: Array<{ __typename?: 'Tag', name: string } | null | undefined> } | null | undefined };

export type DeleteBookmarkMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteBookmarkMutation = { __typename?: 'Mutation', deleteBookmark?: boolean | null | undefined };

export type AddBookmarkMutationVariables = Exact<{
  data: AddBookmarkInput;
}>;


export type AddBookmarkMutation = { __typename?: 'Mutation', addBookmark?: { __typename: 'Bookmark', reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, id: string, url: string, host: string, title?: string | null | undefined, description?: string | null | undefined, faviconUrl?: string | null | undefined, tags: Array<{ __typename?: 'Tag', name: string } | null | undefined> } | null | undefined };

export type AddCommentMutationVariables = Exact<{
  refId: Scalars['ID'];
  type: CommentType;
  text: Scalars['String'];
}>;


export type AddCommentMutation = { __typename?: 'Mutation', addComment?: { __typename: 'Comment', id: string, createdAt: any, updatedAt?: any | null | undefined, text?: string | null | undefined, viewerCanEdit?: boolean | null | undefined, viewerCanDelete?: boolean | null | undefined, author: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } } | null | undefined };

export type EditCommentMutationVariables = Exact<{
  id: Scalars['ID'];
  text: Scalars['String'];
}>;


export type EditCommentMutation = { __typename?: 'Mutation', editComment?: { __typename: 'Comment', id: string, createdAt: any, updatedAt?: any | null | undefined, text?: string | null | undefined, viewerCanEdit?: boolean | null | undefined, viewerCanDelete?: boolean | null | undefined, author: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } } | null | undefined };

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment?: boolean | null | undefined };

export type EditEmailSubscriptionMutationVariables = Exact<{
  data?: Maybe<EmailSubscriptionInput>;
}>;


export type EditEmailSubscriptionMutation = { __typename?: 'Mutation', editEmailSubscription?: { __typename?: 'User', emailSubscriptions?: Array<{ __typename?: 'EmailSubscription', subscribed?: boolean | null | undefined, type?: EmailSubscriptionType | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type EditPostMutationVariables = Exact<{
  id: Scalars['ID'];
  data: EditPostInput;
}>;


export type EditPostMutation = { __typename?: 'Mutation', editPost?: { __typename: 'Post', text?: string | null | undefined, featureImage?: string | null | undefined, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, id: string, publishedAt?: any | null | undefined, title?: string | null | undefined, slug?: string | null | undefined, excerpt?: string | null | undefined } | null | undefined };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost?: boolean | null | undefined };

export type AddPostMutationVariables = Exact<{
  data: AddPostInput;
}>;


export type AddPostMutation = { __typename?: 'Mutation', addPost?: { __typename: 'Post', text?: string | null | undefined, featureImage?: string | null | undefined, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, id: string, publishedAt?: any | null | undefined, title?: string | null | undefined, slug?: string | null | undefined, excerpt?: string | null | undefined } | null | undefined };

export type EditQuestionMutationVariables = Exact<{
  id: Scalars['ID'];
  data: EditQuestionInput;
}>;


export type EditQuestionMutation = { __typename?: 'Mutation', editQuestion?: { __typename: 'Question', description?: string | null | undefined, status?: QuestionStatus | null | undefined, viewerCanEdit?: boolean | null | undefined, viewerCanComment?: boolean | null | undefined, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, id: string, title: string, createdAt: any, author?: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined } | null | undefined };

export type DeleteQuestionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteQuestionMutation = { __typename?: 'Mutation', deleteQuestion?: boolean | null | undefined };

export type AddQuestionMutationVariables = Exact<{
  data: AddQuestionInput;
}>;


export type AddQuestionMutation = { __typename?: 'Mutation', addQuestion?: { __typename: 'Question', description?: string | null | undefined, status?: QuestionStatus | null | undefined, viewerCanEdit?: boolean | null | undefined, viewerCanComment?: boolean | null | undefined, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, id: string, title: string, createdAt: any, author?: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined } | null | undefined };

export type ToggleReactionMutationVariables = Exact<{
  refId: Scalars['ID'];
  type: ReactionType;
}>;


export type ToggleReactionMutation = { __typename?: 'Mutation', toggleReaction?: { __typename?: 'Bookmark', id: string, url: string, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined } | { __typename?: 'Post', id: string, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined } | { __typename?: 'Question', id: string, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined } | { __typename?: 'Stack', id: string, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined } | null | undefined };

export type EditStackMutationVariables = Exact<{
  id: Scalars['ID'];
  data: EditStackInput;
}>;


export type EditStackMutation = { __typename?: 'Mutation', editStack?: { __typename: 'Stack', createdAt: any, description?: string | null | undefined, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, usedByViewer?: boolean | null | undefined, id: string, name: string, image?: string | null | undefined, url: string, slug: string, usedBy: Array<{ __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined>, tags: Array<{ __typename?: 'Tag', name: string } | null | undefined> } | null | undefined };

export type DeleteStackMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteStackMutation = { __typename?: 'Mutation', deleteStack?: boolean | null | undefined };

export type AddStackMutationVariables = Exact<{
  data: AddStackInput;
}>;


export type AddStackMutation = { __typename?: 'Mutation', addStack?: { __typename: 'Stack', createdAt: any, description?: string | null | undefined, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, usedByViewer?: boolean | null | undefined, id: string, name: string, image?: string | null | undefined, url: string, slug: string, usedBy: Array<{ __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined>, tags: Array<{ __typename?: 'Tag', name: string } | null | undefined> } | null | undefined };

export type ToggleStackUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ToggleStackUserMutation = { __typename?: 'Mutation', toggleStackUser?: { __typename: 'Stack', id: string, name: string, image?: string | null | undefined, url: string, slug: string, usedBy: Array<{ __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined> } | null | undefined };

export type DeleteUserMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: boolean | null | undefined };

export type EditUserMutationVariables = Exact<{
  data?: Maybe<EditUserInput>;
}>;


export type EditUserMutation = { __typename?: 'Mutation', editUser?: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined };

export type GetBookmarksQueryVariables = Exact<{
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  filter?: Maybe<BookmarkFilter>;
}>;


export type GetBookmarksQuery = { __typename?: 'Query', bookmarks: { __typename?: 'BookmarksConnection', pageInfo?: { __typename?: 'PageInfo', hasNextPage?: boolean | null | undefined, totalCount?: number | null | undefined, endCursor?: string | null | undefined } | null | undefined, edges: Array<{ __typename?: 'BookmarkEdge', cursor?: string | null | undefined, node?: { __typename: 'Bookmark', id: string, url: string, host: string, title?: string | null | undefined, description?: string | null | undefined, faviconUrl?: string | null | undefined } | null | undefined } | null | undefined> } };

export type GetBookmarkQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetBookmarkQuery = { __typename?: 'Query', bookmark?: { __typename: 'Bookmark', reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, id: string, url: string, host: string, title?: string | null | undefined, description?: string | null | undefined, faviconUrl?: string | null | undefined, tags: Array<{ __typename?: 'Tag', name: string } | null | undefined> } | null | undefined };

export type GetCommentsQueryVariables = Exact<{
  refId: Scalars['ID'];
  type: CommentType;
}>;


export type GetCommentsQuery = { __typename?: 'Query', comments: Array<{ __typename: 'Comment', id: string, createdAt: any, updatedAt?: any | null | undefined, text?: string | null | undefined, viewerCanEdit?: boolean | null | undefined, viewerCanDelete?: boolean | null | undefined, author: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } } | null | undefined> };

export type GetHackerNewsPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHackerNewsPostsQuery = { __typename?: 'Query', hackerNewsPosts: Array<{ __typename?: 'HackerNewsPost', id?: string | null | undefined, title?: string | null | undefined, domain?: string | null | undefined, url?: string | null | undefined } | null | undefined> };

export type GetHackerNewsPostQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetHackerNewsPostQuery = { __typename?: 'Query', hackerNewsPost?: { __typename?: 'HackerNewsPost', user?: string | null | undefined, time?: number | null | undefined, time_ago?: string | null | undefined, comments_count?: string | null | undefined, url?: string | null | undefined, domain?: string | null | undefined, content?: string | null | undefined, id?: string | null | undefined, title?: string | null | undefined, comments?: Array<{ __typename?: 'HackerNewsComment', id?: string | null | undefined, user?: string | null | undefined, comments_count?: string | null | undefined, time_ago?: string | null | undefined, level?: number | null | undefined, content?: string | null | undefined, comments?: Array<{ __typename?: 'HackerNewsComment', id?: string | null | undefined, user?: string | null | undefined, comments_count?: string | null | undefined, time_ago?: string | null | undefined, level?: number | null | undefined, content?: string | null | undefined, comments?: Array<{ __typename?: 'HackerNewsComment', id?: string | null | undefined, user?: string | null | undefined, comments_count?: string | null | undefined, time_ago?: string | null | undefined, level?: number | null | undefined, content?: string | null | undefined, comments?: Array<{ __typename?: 'HackerNewsComment', id?: string | null | undefined, user?: string | null | undefined, comments_count?: string | null | undefined, time_ago?: string | null | undefined, level?: number | null | undefined, content?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type GetPostsQueryVariables = Exact<{
  filter?: Maybe<WritingFilter>;
}>;


export type GetPostsQuery = { __typename?: 'Query', posts: Array<{ __typename: 'Post', id: string, publishedAt?: any | null | undefined, title?: string | null | undefined, slug?: string | null | undefined, excerpt?: string | null | undefined } | null | undefined> };

export type GetPostQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type GetPostQuery = { __typename?: 'Query', post?: { __typename: 'Post', text?: string | null | undefined, featureImage?: string | null | undefined, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, id: string, publishedAt?: any | null | undefined, title?: string | null | undefined, slug?: string | null | undefined, excerpt?: string | null | undefined } | null | undefined };

export type GetQuestionsQueryVariables = Exact<{
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  filter?: Maybe<QuestionFilter>;
}>;


export type GetQuestionsQuery = { __typename?: 'Query', questions: { __typename?: 'QuestionsConnection', pageInfo?: { __typename?: 'PageInfo', hasNextPage?: boolean | null | undefined, totalCount?: number | null | undefined, endCursor?: string | null | undefined } | null | undefined, edges: Array<{ __typename?: 'QuestionEdge', cursor?: string | null | undefined, node?: { __typename: 'Question', id: string, title: string, createdAt: any, author?: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined } | null | undefined } | null | undefined> } };

export type GetQuestionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetQuestionQuery = { __typename?: 'Query', question?: { __typename: 'Question', description?: string | null | undefined, status?: QuestionStatus | null | undefined, viewerCanEdit?: boolean | null | undefined, viewerCanComment?: boolean | null | undefined, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, id: string, title: string, createdAt: any, author?: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined } | null | undefined };

export type GetStacksQueryVariables = Exact<{
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
}>;


export type GetStacksQuery = { __typename?: 'Query', stacks: { __typename?: 'StacksConnection', pageInfo?: { __typename?: 'PageInfo', hasNextPage?: boolean | null | undefined, totalCount?: number | null | undefined, endCursor?: string | null | undefined } | null | undefined, edges: Array<{ __typename?: 'StackEdge', cursor?: string | null | undefined, node?: { __typename: 'Stack', id: string, name: string, image?: string | null | undefined, url: string, slug: string } | null | undefined } | null | undefined> } };

export type GetStackQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type GetStackQuery = { __typename?: 'Query', stack?: { __typename: 'Stack', createdAt: any, description?: string | null | undefined, reactionCount?: number | null | undefined, viewerHasReacted?: boolean | null | undefined, usedByViewer?: boolean | null | undefined, id: string, name: string, image?: string | null | undefined, url: string, slug: string, usedBy: Array<{ __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined>, tags: Array<{ __typename?: 'Tag', name: string } | null | undefined> } | null | undefined };

export type GetTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTagsQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', name: string } | null | undefined> };

export type GetUserQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined };

export type ViewerQueryVariables = Exact<{ [key: string]: never; }>;


export type ViewerQuery = { __typename?: 'Query', viewer?: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined } | null | undefined };

export type GetViewerWithSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetViewerWithSettingsQuery = { __typename?: 'Query', viewer?: { __typename: 'User', id: string, username?: string | null | undefined, avatar?: string | null | undefined, name?: string | null | undefined, role?: UserRole | null | undefined, isViewer?: boolean | null | undefined, isAdmin?: boolean | null | undefined, email?: string | null | undefined, pendingEmail?: string | null | undefined, emailSubscriptions?: Array<{ __typename?: 'EmailSubscription', type?: EmailSubscriptionType | null | undefined, subscribed?: boolean | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export const BookmarkCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookmarkCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bookmark"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"host"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"faviconUrl"}}]}}]} as unknown as DocumentNode<BookmarkCoreFragment, unknown>;
export const BookmarkDetailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookmarkDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bookmark"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookmarkCore"}},{"kind":"Field","name":{"kind":"Name","value":"reactionCount"}},{"kind":"Field","name":{"kind":"Name","value":"viewerHasReacted"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},...BookmarkCoreFragmentDoc.definitions]} as unknown as DocumentNode<BookmarkDetailFragment, unknown>;
export const BookmarkListItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookmarkListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bookmark"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookmarkCore"}}]}},...BookmarkCoreFragmentDoc.definitions]} as unknown as DocumentNode<BookmarkListItemFragment, unknown>;
export const BookmarksConnectionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookmarksConnection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookmarksConnection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookmarkListItem"}}]}}]}}]}},...BookmarkListItemFragmentDoc.definitions]} as unknown as DocumentNode<BookmarksConnectionFragment, unknown>;
export const UserInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isViewer"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<UserInfoFragment, unknown>;
export const CommentInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"viewerCanEdit"}},{"kind":"Field","name":{"kind":"Name","value":"viewerCanDelete"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}}]}},...UserInfoFragmentDoc.definitions]} as unknown as DocumentNode<CommentInfoFragment, unknown>;
export const HackerNewsListItemInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HackerNewsListItemInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HackerNewsPost"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<HackerNewsListItemInfoFragment, unknown>;
export const HackerNewsCommentInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HackerNewsCommentInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HackerNewsComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"comments_count"}},{"kind":"Field","name":{"kind":"Name","value":"time_ago"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]} as unknown as DocumentNode<HackerNewsCommentInfoFragment, unknown>;
export const HackerNewsPostInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HackerNewsPostInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HackerNewsPost"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HackerNewsListItemInfo"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"time_ago"}},{"kind":"Field","name":{"kind":"Name","value":"comments_count"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HackerNewsCommentInfo"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HackerNewsCommentInfo"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HackerNewsCommentInfo"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HackerNewsCommentInfo"}}]}}]}}]}}]}}]}},...HackerNewsListItemInfoFragmentDoc.definitions,...HackerNewsCommentInfoFragmentDoc.definitions]} as unknown as DocumentNode<HackerNewsPostInfoFragment, unknown>;
export const PostCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PostCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}}]}}]} as unknown as DocumentNode<PostCoreFragment, unknown>;
export const PostListItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PostListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostCore"}}]}},...PostCoreFragmentDoc.definitions]} as unknown as DocumentNode<PostListItemFragment, unknown>;
export const PostDetailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PostDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostCore"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"featureImage"}},{"kind":"Field","name":{"kind":"Name","value":"reactionCount"}},{"kind":"Field","name":{"kind":"Name","value":"viewerHasReacted"}}]}},...PostCoreFragmentDoc.definitions]} as unknown as DocumentNode<PostDetailFragment, unknown>;
export const QuestionCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}}]}},...UserInfoFragmentDoc.definitions]} as unknown as DocumentNode<QuestionCoreFragment, unknown>;
export const QuestionDetailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionCore"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"viewerCanEdit"}},{"kind":"Field","name":{"kind":"Name","value":"viewerCanComment"}},{"kind":"Field","name":{"kind":"Name","value":"reactionCount"}},{"kind":"Field","name":{"kind":"Name","value":"viewerHasReacted"}}]}},...QuestionCoreFragmentDoc.definitions]} as unknown as DocumentNode<QuestionDetailFragment, unknown>;
export const QuestionListItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionCore"}}]}},...QuestionCoreFragmentDoc.definitions]} as unknown as DocumentNode<QuestionListItemFragment, unknown>;
export const QuestionsConnectionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionsConnection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionsConnection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionListItem"}}]}}]}}]}},...QuestionListItemFragmentDoc.definitions]} as unknown as DocumentNode<QuestionsConnectionFragment, unknown>;
export const StackCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StackCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Stack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]} as unknown as DocumentNode<StackCoreFragment, unknown>;
export const StackDetailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StackDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Stack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StackCore"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"reactionCount"}},{"kind":"Field","name":{"kind":"Name","value":"viewerHasReacted"}},{"kind":"Field","name":{"kind":"Name","value":"usedByViewer"}},{"kind":"Field","name":{"kind":"Name","value":"usedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},...StackCoreFragmentDoc.definitions,...UserInfoFragmentDoc.definitions]} as unknown as DocumentNode<StackDetailFragment, unknown>;
export const StackListItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StackListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Stack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StackCore"}}]}},...StackCoreFragmentDoc.definitions]} as unknown as DocumentNode<StackListItemFragment, unknown>;
export const StacksConnectionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StacksConnection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StacksConnection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StackListItem"}}]}}]}}]}},...StackListItemFragmentDoc.definitions]} as unknown as DocumentNode<StacksConnectionFragment, unknown>;
export const UserSettingsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pendingEmail"}},{"kind":"Field","name":{"kind":"Name","value":"emailSubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}}]}}]}}]} as unknown as DocumentNode<UserSettingsFragment, unknown>;
export const EditBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditBookmarkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookmarkDetail"}}]}}]}},...BookmarkDetailFragmentDoc.definitions]} as unknown as DocumentNode<EditBookmarkMutation, EditBookmarkMutationVariables>;
export const DeleteBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteBookmarkMutation, DeleteBookmarkMutationVariables>;
export const AddBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddBookmarkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookmarkDetail"}}]}}]}},...BookmarkDetailFragmentDoc.definitions]} as unknown as DocumentNode<AddBookmarkMutation, AddBookmarkMutationVariables>;
export const AddCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentInfo"}}]}}]}},...CommentInfoFragmentDoc.definitions]} as unknown as DocumentNode<AddCommentMutation, AddCommentMutationVariables>;
export const EditCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentInfo"}}]}}]}},...CommentInfoFragmentDoc.definitions]} as unknown as DocumentNode<EditCommentMutation, EditCommentMutationVariables>;
export const DeleteCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const EditEmailSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editEmailSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailSubscriptionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editEmailSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailSubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<EditEmailSubscriptionMutation, EditEmailSubscriptionMutationVariables>;
export const EditPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditPostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostDetail"}}]}}]}},...PostDetailFragmentDoc.definitions]} as unknown as DocumentNode<EditPostMutation, EditPostMutationVariables>;
export const DeletePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deletePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeletePostMutation, DeletePostMutationVariables>;
export const AddPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddPostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostDetail"}}]}}]}},...PostDetailFragmentDoc.definitions]} as unknown as DocumentNode<AddPostMutation, AddPostMutationVariables>;
export const EditQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditQuestionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionDetail"}}]}}]}},...QuestionDetailFragmentDoc.definitions]} as unknown as DocumentNode<EditQuestionMutation, EditQuestionMutationVariables>;
export const DeleteQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteQuestionMutation, DeleteQuestionMutationVariables>;
export const AddQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddQuestionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionDetail"}}]}}]}},...QuestionDetailFragmentDoc.definitions]} as unknown as DocumentNode<AddQuestionMutation, AddQuestionMutationVariables>;
export const ToggleReactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"toggleReaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReactionType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleReaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Stack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reactionCount"}},{"kind":"Field","name":{"kind":"Name","value":"viewerHasReacted"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bookmark"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"reactionCount"}},{"kind":"Field","name":{"kind":"Name","value":"viewerHasReacted"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reactionCount"}},{"kind":"Field","name":{"kind":"Name","value":"viewerHasReacted"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reactionCount"}},{"kind":"Field","name":{"kind":"Name","value":"viewerHasReacted"}}]}}]}}]}}]} as unknown as DocumentNode<ToggleReactionMutation, ToggleReactionMutationVariables>;
export const EditStackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editStack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditStackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editStack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StackDetail"}}]}}]}},...StackDetailFragmentDoc.definitions]} as unknown as DocumentNode<EditStackMutation, EditStackMutationVariables>;
export const DeleteStackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteStack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteStackMutation, DeleteStackMutationVariables>;
export const AddStackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addStack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddStackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addStack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StackDetail"}}]}}]}},...StackDetailFragmentDoc.definitions]} as unknown as DocumentNode<AddStackMutation, AddStackMutationVariables>;
export const ToggleStackUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"toggleStackUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleStackUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StackCore"}},{"kind":"Field","name":{"kind":"Name","value":"usedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}}]}}]}},...StackCoreFragmentDoc.definitions,...UserInfoFragmentDoc.definitions]} as unknown as DocumentNode<ToggleStackUserMutation, ToggleStackUserMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"}}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const EditUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EditUserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}}]}},...UserInfoFragmentDoc.definitions]} as unknown as DocumentNode<EditUserMutation, EditUserMutationVariables>;
export const GetBookmarksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBookmarks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BookmarkFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookmarks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookmarksConnection"}}]}}]}},...BookmarksConnectionFragmentDoc.definitions]} as unknown as DocumentNode<GetBookmarksQuery, GetBookmarksQueryVariables>;
export const GetBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookmarkDetail"}}]}}]}},...BookmarkDetailFragmentDoc.definitions]} as unknown as DocumentNode<GetBookmarkQuery, GetBookmarkQueryVariables>;
export const GetCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentInfo"}}]}}]}},...CommentInfoFragmentDoc.definitions]} as unknown as DocumentNode<GetCommentsQuery, GetCommentsQueryVariables>;
export const GetHackerNewsPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getHackerNewsPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hackerNewsPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HackerNewsListItemInfo"}}]}}]}},...HackerNewsListItemInfoFragmentDoc.definitions]} as unknown as DocumentNode<GetHackerNewsPostsQuery, GetHackerNewsPostsQueryVariables>;
export const GetHackerNewsPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getHackerNewsPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hackerNewsPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HackerNewsPostInfo"}}]}}]}},...HackerNewsPostInfoFragmentDoc.definitions]} as unknown as DocumentNode<GetHackerNewsPostQuery, GetHackerNewsPostQueryVariables>;
export const GetPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"WritingFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostListItem"}}]}}]}},...PostListItemFragmentDoc.definitions]} as unknown as DocumentNode<GetPostsQuery, GetPostsQueryVariables>;
export const GetPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostDetail"}}]}}]}},...PostDetailFragmentDoc.definitions]} as unknown as DocumentNode<GetPostQuery, GetPostQueryVariables>;
export const GetQuestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getQuestions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionsConnection"}}]}}]}},...QuestionsConnectionFragmentDoc.definitions]} as unknown as DocumentNode<GetQuestionsQuery, GetQuestionsQueryVariables>;
export const GetQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionDetail"}}]}}]}},...QuestionDetailFragmentDoc.definitions]} as unknown as DocumentNode<GetQuestionQuery, GetQuestionQueryVariables>;
export const GetStacksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getStacks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stacks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StacksConnection"}}]}}]}},...StacksConnectionFragmentDoc.definitions]} as unknown as DocumentNode<GetStacksQuery, GetStacksQueryVariables>;
export const GetStackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getStack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StackDetail"}}]}}]}},...StackDetailFragmentDoc.definitions]} as unknown as DocumentNode<GetStackQuery, GetStackQueryVariables>;
export const GetTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetTagsQuery, GetTagsQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}}]}},...UserInfoFragmentDoc.definitions]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const ViewerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}}]}},...UserInfoFragmentDoc.definitions]} as unknown as DocumentNode<ViewerQuery, ViewerQueryVariables>;
export const GetViewerWithSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getViewerWithSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserSettings"}}]}}]}},...UserInfoFragmentDoc.definitions,...UserSettingsFragmentDoc.definitions]} as unknown as DocumentNode<GetViewerWithSettingsQuery, GetViewerWithSettingsQueryVariables>;