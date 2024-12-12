const PredictsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'predicts',
  version: '1.0.0',
  register: async (server, { predictUseCase }) => {
    const predictsHandler = new PredictsHandler(predictUseCase);
    server.route(routes(predictsHandler));
  }
}