import { getBookmark, getBookmarks } from './bookmarks'
import { getComment, getComments } from './comment'
import { getHackerNewsPost, getHackerNewsPosts } from './hackerNews'
import { getPost, getPosts } from './posts'
import { getQuestion, getQuestions } from './questions'
import { getStack, getStacks } from './stack'
import { getTags } from './tags'
import { getUser } from './user'
import { viewer } from './viewer'

export default {
  viewer: viewer,
  user: getUser,
  bookmark: getBookmark,
  bookmarks: getBookmarks,
  posts: getPosts,
  post: getPost,
  question: getQuestion,
  questions: getQuestions,
  comment: getComment,
  comments: getComments,
  stacks: getStacks,
  stack: getStack,
  tags: getTags,
  hackerNewsPosts: getHackerNewsPosts,
  hackerNewsPost: getHackerNewsPost,
}
