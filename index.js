const { model } = require('@tensorflow/tfjs-node')
const tf = require('@tensorflow/tfjs-node')



run()
// run2()
// run3()

// loadModel()

/**
 * 使用 2阶张量
 */
async function run() {
  const model = tf.sequential()
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }))
  const optimizer = tf.train.adam(0.1)
  model.compile({ loss: 'meanSquaredError', optimizer})

  const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1])
  const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1])
  await model.fit(xs, ys, {
    epochs: 500
  })

  model.summary()

  await saveModel(model, './models1')

  const value = model.predict(tf.tensor2d([20], [1, 1])).dataSync()
  console.log(value)
}


/**
 * 使用 1阶张量
 */
async function run2() {
  const model = tf.sequential()
  model.add(tf.layers.dense({ units: 1, inputShape: [1]}))
  model.add(tf.layers.dense({ units: 1 }))
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })

  const xs = tf.tensor1d([-1, 0, 1, 2, 3, 4])
  const ys = tf.tensor1d([-3, -1, 1, 3, 5, 7])

  await model.fit(xs, ys, {
    epochs: 1000
  })

  await saveModel(model, './models2')

  const value = await model.predict(tf.tensor1d([20])).dataSync()
  console.log({value})
}

/**
 * 使用 1阶张量，增加中间层
 * 
 * 总结：网络参数远大于实际问题复杂度， 学习速度很快时，拟合的误差很大。 网络参数与问题复杂度匹配时，学习速度快，拟合误差小。
 */
 async function run3() {
  const model = tf.sequential()
  model.add(tf.layers.dense({ units: 1, inputShape: [1]}))
  model.add(tf.layers.dense({ units: 10 }))
  model.add(tf.layers.dense({ units: 10 }))
  model.add(tf.layers.dense({ units: 1 }))
   
  const optimizer = tf.train.adam(0.1)
  model.compile({ loss: 'meanSquaredError', optimizer, metrics: ['accuracy'] })

  const xs = tf.tensor1d([-1, 0, 1, 2, 3, 4, 20])
  const ys = tf.tensor1d([-3, -1, 1, 3, 5, 7, 39])

  await model.fit(xs, ys, {
    epochs: 1000
  })

  model.summary()
  await saveModel(model, './models3')

  const value = await model.predict(tf.tensor1d([20])).dataSync()
  console.log({value})
}

async function saveModel(model, saved_path) {
  await model.save(tf.io.fileSystem(saved_path))
}

async function loadModel() {
  const model = await tf.loadLayersModel(tf.io.fileSystem('./models1/model.json'))
  const r = model.predict(tf.tensor1d([20])).dataSync()
  const r2 = model.predict(tf.tensor1d([40])).dataSync()
  console.log(r, r2)
}
