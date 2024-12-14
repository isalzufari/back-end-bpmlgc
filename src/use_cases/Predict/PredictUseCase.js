const InputError = require("../../exceptions/InputError");

class PredictUseCase {
  constructor(tf, crypto, dataService) {
    this._tf = tf;
    this._crypto = crypto;
    this._dataService = dataService;
  }

  async execute({ model, image }) {
    try {
      const tensor = this._tf.node
        .decodeImage(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat();

      const prediction = model.predict(tensor);
      const score = await prediction.data();
      const resultScore = Math.max(...score) * 100;

      const result = resultScore > 50 ? 'Cancer' : 'Non-cancer';
      const suggestion =
        result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';

      const id = this._crypto.randomUUID();
      const createdAt = new Date().toISOString();

      const data = {
        id,
        result,
        suggestion,
        createdAt,
      };

      await this._dataService.storeData({ id, data });

      return data;
    } catch (error) {
      console.log(error);
      throw new InputError('Terjadi kesalahan dalam melakukan prediksi')
    }
  }
}

module.exports = PredictUseCase;
