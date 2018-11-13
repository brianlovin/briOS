// @flow
const routes = require('next-routes');

module.exports = routes()
  .add('about')
  .add('contact')
  .add('design-details', '/design-details', 'design-details')
  .add('design-detail', '/design-details/:slug', 'design-detail')
  .add('books')
  .add('music')
  .add('oss');
