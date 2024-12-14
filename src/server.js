require('dotenv').config();

const tf = require('@tensorflow/tfjs-node');
const crypto = require('crypto');
const Hapi = require('@hapi/hapi');

const ClientError = require('./exceptions/ClientError');

const loadModel = require('./services/tf/loadModel');
const dataService = require('./services/fs/dataService');

const predicts = require('./api');
const PredictUseCase = require('./use_cases/Predict/PredictUseCase');

const init = async () => {
  const predictUseCase = new PredictUseCase(
    tf, crypto, dataService
  );
  const {
    HOST,
    PORT,
  } = process.env;

  const model = await loadModel();

  const server = Hapi.server({
    host: HOST || "0.0.0.0",
    port: PORT || 8086,
    routes: {
      cors: {
        origin: ['*'],
      },
      payload: {
        maxBytes: 1000000,
      },
    },
  });

  server.app.model = model;

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: async (request, h) => {
        return h.response({
          status: 'success',
          message: 'Server running!'
        })
      }
    },
  ]);

  await server.register([
    {
      plugin: predicts,
      options: {
        predictUseCase,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return response.continue || response;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
}

init();