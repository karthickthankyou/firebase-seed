const fs = require('fs')
const { saveJsonToFile } = require('savejsontofile')

module.exports.changeGameSimilarArr = () => {
  const allGames = JSON.parse(fs.readFileSync('./data/allGames.json', 'utf-8'))
  const newAllGames = allGames.map((game) => {
    const { similar } = game
    const newSimilar = similar.map((item) => {
      return { id: item[0], s: item[1] }
    })
    return { ...game, similar: newSimilar }
  })

  saveJsonToFile(newAllGames, 'newAllGames.json')
}
module.exports.createLightGames = () => {
  const allGames = JSON.parse(fs.readFileSync('./data/allGames.json', 'utf-8'))
  const AllLightGames = allGames.map(
    ({ id, title, publisherId, price, discount }) => ({
      id,
      title,
      publisherId,
      price,
      discount,
    }),
  )

  saveJsonToFile(AllLightGames, 'AllLightGames.json')
}
