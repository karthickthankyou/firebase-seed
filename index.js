const fs = require('fs')
const { v4: uuidV4 } = require('uuid')
const admin = require('firebase-admin')

const serviceAccount = require('./epicgames-clone-firebase-adminsdk-ewb94-c26d4ff979.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'epicgames-clone.appspot.com',
})

const db = admin.firestore()
const bucket = admin.storage().bucket()

module.exports.sampleupload = () => {
  ref.put(file).then((snapshot) => {
    console.log('Uploaded a blob or file!')
  })
}

module.exports.createDoc = () => {
  db.collection('sampleCollection')
    .doc('randomDocIdHere')
    .set({ msg: 'Hello World' })
    .then((res) => console.log(res))
    .catch((err) => {
      console.log(err)
    })
}

module.exports.createAllDocuments = () => {
  const allGames = JSON.parse(fs.readFileSync('./data/allGames.json', 'utf-8'))
  const allLightGames = JSON.parse(
    fs.readFileSync('./data/allLightGames.json', 'utf-8'),
  )
  const allPublishers = JSON.parse(
    fs.readFileSync('./data/allPublishers.json', 'utf-8'),
  )

  for (let i = 0; i < allGames.length; i++) {
    const game = allGames[i]
    if (!game || !game.id) {
      continue
    }

    db.collection('games')
      .doc(game.id)
      .set(game)
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err)
      })
  }
  for (let i = 0; i < allLightGames.length; i++) {
    const game = allLightGames[i]
    if (!game || !game.id) {
      continue
    }

    db.collection('gamesLight')
      .doc(game.id)
      .set(game)
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err)
      })
  }

  const publisherKeys = Object.keys(allPublishers)
  for (let i = 0; i < publisherKeys.length; i++) {
    const publisherKey = publisherKeys[i]
    const publisher = allPublishers[publisherKey]
    if (!publisher || !publisher.id) {
      continue
    }
    db.collection('publishers')
      .doc(publisherKey)
      .set(publisher)
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err)
      })
  }
}

module.exports.uploadImages = () => {
  const dirImages = './data/images/images-resized'
  const dirSubImages = './data/images/images-resized'

  uploadAll(dirImages, 'images')
  uploadAll(dirSubImages, 'subImages')
}

const uploadAll = (dir, dest) => {
  fs.readdir(dir, async (err, files) => {
    if (err) {
      console.log('Error ', err)
      return
    }

    for (let i = 0; i < 2; i++) {
      const file = files[i]
      const filePath = dir + '/' + file
      console.log(file, filePath)

      bucket
        .upload(filePath, {
          destination: dest + '/' + file,
          uploadType: 'media',
          gzip: true,
          metadata: {
            cacheControl: 'public, max-age=31536000',
            metadata: {
              firebaseStorageDownloadTokens: uuidV4(),
            },
          },
        })
        .then(() => console.log('upload Success'))
        .catch((err) => console.log('Error:: ', err))
    }
  })
}
