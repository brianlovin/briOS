import {
  getBookmark,
  getBookmarks,
} from '~/graphql/resolvers/queries/bookmarks'
import { getComment, getComments } from '~/graphql/resolvers/queries/comment'
import { getEpisodes } from '~/graphql/resolvers/queries/podcast'
import {
  getQuestion,
  getQuestions,
} from '~/graphql/resolvers/queries/questions'
import { getRepos } from '~/graphql/resolvers/queries/repos'
import { getStack, getStacks } from '~/graphql/resolvers/queries/stack'
import { getTags } from '~/graphql/resolvers/queries/tags'
import { getUser } from '~/graphql/resolvers/queries/user'
import { viewer } from '~/graphql/resolvers/queries/viewer'
import { getPost, getPosts } from '~/graphql/resolvers/queries/writing'

export default {
  viewer: viewer,
  user: getUser,
  bookmark: getBookmark,
  bookmarks: getBookmarks,
  episodes: getEpisodes,
  posts: getPosts,
  post: getPost,
  repos: getRepos,
  question: getQuestion,
  questions: getQuestions,
  comment: getComment,
  comments: getComments,
  stacks: getStacks,
  stack: getStack,
  tags: getTags,
}
