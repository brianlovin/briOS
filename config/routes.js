// @flow
const routes = require('next-routes')

module.exports = routes()
  .add('about')
  .add('contact')
  .add('details', '/design-details')
  .add('detail', '/design-details/:slug')
  .add('books')
  .add('music')
  .add('oss')