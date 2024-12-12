const routes = (handler) => [
  {
    method: 'POST',
    path: '/predict',
    handler: handler.postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
      },
    },
  },
];

module.exports = routes;
