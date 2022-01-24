#!/usr/bin/env node
const path = require('path')

const { readdir } = require('fs').promises
const { Storage } = require('@google-cloud/storage')
const { version } = require('../package.json')

const staticDir = path.resolve(__dirname, '..', '.next', 'static')
const staticDest = `web/${version}/_next/static`
const storage = new Storage({
  projectId: process.env.GCP_PROJECT,
  credentials: JSON.parse(process.env.GS_CREDENTIALS),
})

async function* getDirectoryFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getDirectoryFiles(res)
    } else {
      yield res
    }
  }
}

async function uploadFiles({ bucket, dest, dir }) {
  const ops = []
  for await (const file of getDirectoryFiles(dir)) {
    const destination = `${dest}/${path.relative(dir, file)}`
    console.log(`Collected ${destination}`)
    ops.push([
      file,
      {
        destination,
        gzip: true,
      },
    ])
  }
  await Promise.all(ops.map(([file, options]) => bucket.upload(file, options)))
}

uploadFiles({
  bucket: storage.bucket(process.env.BUCKET_PUBLIC),
  dest: staticDest,
  dir: staticDir,
})
  .then(console.log)
  .catch(console.error)
