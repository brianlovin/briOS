import {
  getBookmarks,
  getBookmark,
} from '~/graphql/resolvers/queries/bookmarks'
import { getPosts, getPost } from '~/graphql/resolvers/queries/writing'
import { getEpisodes } from '~/graphql/resolvers/queries/podcast'
import { getRepos } from '~/graphql/resolvers/queries/repos'
import { viewer } from '~/graphql/resolvers/queries/viewer'
import {
  getAMAQuestion,
  getAMAQuestions,
  getSignedUploadUrl,
  getSignedPlaybackUrl,
  getTranscription,
} from '~/graphql/resolvers/queries/ama'
import { getComment, getComments } from '~/graphql/resolvers/queries/comment'
import { requiresAdmin } from '~/graphql/helpers/requiresAdmin'
import { getUser } from '~/graphql/resolvers/queries/user'
import { getStack, getStacks } from './stack'

export default {
  viewer: viewer,
  user: getUser,
  bookmark: getBookmark,
  bookmarks: getBookmarks,
  episodes: getEpisodes,
  posts: getPosts,
  post: getPost,
  repos: getRepos,
  amaQuestion: getAMAQuestion,
  amaQuestions: getAMAQuestions,
  signedUploadUrl: requiresAdmin(getSignedUploadUrl),
  signedPlaybackUrl: requiresAdmin(getSignedPlaybackUrl),
  transcription: requiresAdmin(getTranscription),
  comment: getComment,
  comments: getComments,
  stacks: getStacks,
  stack: getStack,
}
