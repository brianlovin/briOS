import {
  addBookmark,
  editBookmark,
  deleteBookmark,
  addBookmarkReaction,
} from '~/graphql/resolvers/mutations/bookmarks'
import { requiresMe } from '~/graphql/helpers/requiresMe'
import {
  addAMAQuestion,
  editAMAQuestion,
  deleteAMAQuestion,
  addAMAReaction,
  addAMAAudioPlay,
  transcribeAudio,
} from '~/graphql/resolvers/mutations/ama'

export default {
  addBookmark: requiresMe(addBookmark),
  editBookmark: requiresMe(editBookmark),
  deleteBookmark: requiresMe(deleteBookmark),
  addBookmarkReaction,
  addAMAQuestion,
  editAMAQuestion: requiresMe(editAMAQuestion),
  deleteAMAQuestion: requiresMe(deleteAMAQuestion),
  addAMAReaction,
  addAMAAudioPlay,
  transcribeAudio: requiresMe(transcribeAudio),
}
