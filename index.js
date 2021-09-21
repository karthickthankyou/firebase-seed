const fs = require('fs')
const admin = require('firebase-admin')

const serviceAccount = require('./epicgames-clone-firebase-adminsdk-ewb94-c26d4ff979.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

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
