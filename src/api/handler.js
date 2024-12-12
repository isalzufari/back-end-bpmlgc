class PredictsHandler {
  constructor(predictUseCase) {
    this._predictUseCase = predictUseCase;

    this.postPredictHandler = this.postPredictHandler.bind(this);
  }

  async postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    const data = await this._predictUseCase.execute({ model, image })

    return ({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    });
  }
}

module.exports = PredictsHandler;