// const functions = require('firebase-functions')
// const cheerio = require('cheerio')
// const algoliasearch = require('algoliasearch')
// const URL = require('url')
// const fetch = require('isomorphic-unfetch')
// const admin = require('firebase-admin')

import functions from 'firebase-functions'
import cheerio from 'cheerio'
import algoliasearch from 'algoliasearch'
import URL from 'url'
import fetch from 'isomorphic-unfetch'
import admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()
const client = algoliasearch(
  functions.config().algolia.id,
  functions.config().algolia.key
)
const index = client.initIndex('bookmarks')

const getMetadata = async (url) => {
  const res = await fetch(url)
  const html = await res.text()
  const $ = cheerio.load(html)

  const { host } = URL.parse(url)

  const getMetavalue = (name) =>
    $(`meta[name=${name}]`).attr('content') ||
    $(`meta[name="twitter:${name}"]`).attr('content') ||
    $(`meta[property=${name}]`).attr('content') ||
    $(`meta[property="twitter:${name}"]`).attr('content') ||
    null

  return {
    url,
    host,
    title: $('title').first().text(),
    description: getMetavalue('description'),
    image: getMetavalue('image'),
    author: getMetavalue('author'),
    creator: getMetavalue('creator'),
    site_name: getMetavalue('site_name'),
  }
}

const indexInSearch = async (metadata, objectID) => {
  return await index.addObject({
    ...metadata,
    objectID,
  })
}

const removeFromSearch = async (objectID) => {
  return await index.deleteObject(objectID)
}

exports.addMetadata = functions.firestore
  .document('bookmarks/{bookmarkId}')
  .onCreate(async (snap, context) => {
    const { bookmarkId } = context.params
    const current = snap.data()
    const { url } = current
    const metadata = await getMetadata(url)
    const next = Object.assign(current, metadata)

    return Promise.all([indexInSearch(next, bookmarkId)])
  })

exports.updateSearchData = functions.firestore
  .document('bookmarks/{bookmarkId}')
  .onUpdate(async (change, context) => {
    const { bookmarkId } = context.params
    const current = change.after.data()
    return await indexInSearch(current, bookmarkId)
  })

exports.removeSearchData = functions.firestore
  .document('bookmarks/{bookmarkId}')
  .onDelete(async (_, context) => {
    const { bookmarkId } = context.params
    return await removeFromSearch(bookmarkId)
  })
