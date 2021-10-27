import { getBookmark, getBookmarks } from './bookmarks'
import { getComment, getComments } from './comment'
import { getHackerNewsPost, getHackerNewsPosts } from './hackerNews'
import { getEpisodes } from './podcast'
import { getQuestion, getQuestions } from './questions'
import { getRepos } from './repos'
import { getStack, getStacks } from './stack'
import { getTags } from './tags'
import { getUser } from './user'
import { viewer } from './viewer'
import { getPost, getPosts } from './writing'

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
  hackerNewsPosts: getHackerNewsPosts,
  hackerNewsPost: getHackerNewsPost,
}
