// @flow
const next = require('next');
const path = require('path');
const express = require('express');

const prod = process.env.NODE_ENV === 'production';
const app = next({ dev: !prod });
const favicon = require('serve-favicon');
const routes = require('./config/routes');

const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  express()
    .use(handler)
    .use(favicon(path.join(__dirname, 'static', 'favicon.ico')))
    .use((req, res, next) => {
      if (/^\/static\//.test(req.url)) {
        res.setHeader('Cache-Control', 'public,s-maxage=360000');
      }
      next();
    })
    .listen(3000);
});
