export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Upload: any
}

export type Bookmark = {
  __typename?: 'Bookmark'
  url: Scalars['String']
  author?: Maybe<Scalars['String']>
  creator?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
  site_name?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  host?: Maybe<Scalars['String']>
}

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export type Episode = {
  __typename?: 'Episode'
  id?: Maybe<Scalars['Int']>
  number?: Maybe<Scalars['Int']>
  podcast_id?: Maybe<Scalars['Int']>
  guide?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  author?: Maybe<Scalars['String']>
  duration?: Maybe<Scalars['Int']>
  explicit?: Maybe<Scalars['Boolean']>
  description?: Maybe<Scalars['String']>
  long_description?: Maybe<Scalars['String']>
  published?: Maybe<Scalars['Boolean']>
  published_at?: Maybe<Scalars['String']>
  audio_file_size?: Maybe<Scalars['Int']>
  audio_url?: Maybe<Scalars['String']>
  sharing_url?: Maybe<Scalars['String']>
}

export type Post = {
  __typename?: 'Post'
  canonical_url?: Maybe<Scalars['String']>
  codeinjection_foot?: Maybe<Scalars['String']>
  codeinjection_head?: Maybe<Scalars['String']>
  comment_id?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['String']>
  custom_excerpt?: Maybe<Scalars['String']>
  excerpt?: Maybe<Scalars['String']>
  feature_image?: Maybe<Scalars['String']>
  featured?: Maybe<Scalars['Boolean']>
  html?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['String']>
  meta_description?: Maybe<Scalars['String']>
  meta_title?: Maybe<Scalars['String']>
  og_description?: Maybe<Scalars['String']>
  og_image?: Maybe<Scalars['String']>
  og_title?: Maybe<Scalars['String']>
  published_at?: Maybe<Scalars['String']>
  reading_time?: Maybe<Scalars['Int']>
  slug?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  twitter_description?: Maybe<Scalars['String']>
  twitter_image?: Maybe<Scalars['String']>
  twitter_title?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
  uuid?: Maybe<Scalars['String']>
  visibility?: Maybe<Scalars['String']>
}

export type Query = {
  __typename?: 'Query'
  bookmarks: Array<Maybe<Bookmark>>
  episodes: Array<Maybe<Episode>>
  posts: Array<Maybe<Post>>
  post?: Maybe<Post>
}

export type QueryPostsArgs = {
  first?: Maybe<Scalars['Int']>
}

export type QueryPostArgs = {
  slug: Scalars['String']
}
