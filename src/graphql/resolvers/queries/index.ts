import {
  getBookmarks,
  getBookmark,
} from '~/graphql/resolvers/queries/bookmarks'
import { getPosts, getPost } from '~/graphql/resolvers/queries/writing'
import { getEpisodes } from '~/graphql/resolvers/queries/podcast'
import { getRepos } from '~/graphql/resolvers/queries/repos'
import { isMe } from '~/graphql/resolvers/queries/isMe'
import {
  getAMAQuestion,
  getAMAQuestions,
  getSignedUploadUrl,
  getSignedPlaybackUrl,
  getTranscription,
} from '~/graphql/resolvers/queries/ama'
import { getComment } from '~/graphql/resolvers/queries/comment'

export default {
  bookmark: getBookmark,
  bookmarks: getBookmarks,
  episodes: getEpisodes,
  posts: getPosts,
  post: getPost,
  repos: getRepos,
  isMe: isMe,
  amaQuestion: getAMAQuestion,
  amaQuestions: getAMAQuestions,
  signedUploadUrl: getSignedUploadUrl,
  signedPlaybackUrl: getSignedPlaybackUrl,
  transcription: getTranscription,
  comment: getComment,
}
