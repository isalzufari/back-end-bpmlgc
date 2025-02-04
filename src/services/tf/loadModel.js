const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
  const modelUrl = process.env.MODEL_URL;
  return tf.loadGraphModel(modelUrl, {
    onProgress: (fraction) => {
      console.log(`Loading: ${fraction}`);
    }
  });
}

module.exports = loadModel;
