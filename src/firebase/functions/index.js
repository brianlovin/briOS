const functions = require('firebase-functions');
const cheerio = require('cheerio');
const fetch = require('isomorphic-unfetch');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const getMetadata = async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const getMetavalue = (name) => 
    $(`meta[name=${name}]`).attr('content') ||
    $(`meta[name="twitter:${name}"]`).attr('content') ||
    $(`meta[property=${name}]`).attr('content') ||
    $(`meta[property="twitter:${name}"]`).attr('content') ||
    null

  return {
    url,
    title: $('title').first().text(),
    description: getMetavalue('description'),
    image: getMetavalue('image'),
    author: getMetavalue('author'),
    creator: getMetavalue('creator'),
    site_name: getMetavalue('site_name'),
  };
};

exports.addMetadata = functions.firestore
  .document('bookmarks/{bookmarkId}')
  .onCreate(async (snap, context) => {
    const { bookmarkId } = context.params;
    const current = snap.data()
    const { url } = current
    const metadata = await getMetadata(url)
    const next = Object.assign(current, metadata) 

    return db.doc(`bookmarks/${bookmarkId}`).set(next);
})