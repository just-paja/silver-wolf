const admin = require('firebase-admin')
const functions = require('firebase-functions')
const next = require('next')

admin.initializeApp()

const dev = process.env.NODE_ENV !== 'production'
const app = next({
  dev,
})
const handle = app.getRequestHandler()
const handleRequest = functions.https.onRequest((req, res) => {
  app.prepare().then(() => handle(req, res))
})

module.exports = {
  handleRequest,
}
