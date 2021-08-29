const sgf = require('@sabaki/sgf')
const path = require('path')
const { getFiles } = require('./utils')
const { publishManual } = require('./api')
const { SGFConvertorExercise } = require('./sgf_convertor_exercise')

function getTile (filepath) {
  const tmp = path.basename(filepath).replace('.sgf', '')
  let [_, name] = tmp.split('_')
  return name
}

async function main () {
  const rootPath = './data/围棋定式一月通/'
  const volumeId = 'e804372b-2d10-496e-8855-50258dee4a9b' // 围棋定式一月通

  const files = getFiles(rootPath).map(f => path.join(rootPath, f))

//   console.log(files.length)

  // files.length
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const nodes = sgf.parseFile(file)
    // console.log(nodes)
    const conv = new SGFConvertorExercise(nodes[0])
    const data = conv.output()
    const title = (data.meta.title = getTile(file))

    console.log(file, i, title)

    // console.log(data.meta.text)
    // console.log(title, volumeId, JSON.stringify(data.steps))

    // const ret = await publishManual(volumeId, title, data)
    // console.log(i, ret)
  }
}

main()
