import {
  addBookmark,
  editBookmark,
  deleteBookmark,
  addBookmarkReaction,
} from '~/graphql/resolvers/mutations/bookmarks'
import { requiresAdmin } from '~/graphql/helpers/requiresAdmin'
import {
  addAMAQuestion,
  editAMAQuestion,
  deleteAMAQuestion,
  addAMAReaction,
  addAMAAudioPlay,
  transcribeAudio,
} from '~/graphql/resolvers/mutations/ama'

export default {
  addBookmark: requiresAdmin(addBookmark),
  editBookmark: requiresAdmin(editBookmark),
  deleteBookmark: requiresAdmin(deleteBookmark),
  addBookmarkReaction,
  addAMAQuestion,
  editAMAQuestion: requiresAdmin(editAMAQuestion),
  deleteAMAQuestion: requiresAdmin(deleteAMAQuestion),
  addAMAReaction,
  addAMAAudioPlay,
  transcribeAudio: requiresAdmin(transcribeAudio),
}
