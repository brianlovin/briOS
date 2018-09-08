// @flow
export type Post = {
  id: string,
  title: string,
  slug: string,
  createdAt: string,
}

export type Detail = {
  id: string,
  postId: string,
  title: string,
  description: string,
  media: Array<string>,
}