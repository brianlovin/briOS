import {
  getBookmarks,
  getBookmark,
} from '~/graphql/resolvers/queries/bookmarks'
import { getPosts, getPost } from '~/graphql/resolvers/queries/writing'
import { getEpisodes } from '~/graphql/resolvers/queries/podcast'
import { getRepos } from '~/graphql/resolvers/queries/repos'
import { viewer } from '~/graphql/resolvers/queries/viewer'
import {
  getQuestion,
  getQuestions,
} from '~/graphql/resolvers/queries/questions'
import { getComment, getComments } from '~/graphql/resolvers/queries/comment'
import { getUser } from '~/graphql/resolvers/queries/user'
import { getStack, getStacks } from '~/graphql/resolvers/queries/stack'
import { getTags } from '~/graphql/resolvers/queries/tags'

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
