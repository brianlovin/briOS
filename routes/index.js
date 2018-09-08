// @flow
const routes = require('next-routes')

module.exports = routes()
  .add('about')
  .add('contact')
  .add('design-details', '/design-details')
  .add('design-detail', '/design-details/:slug')