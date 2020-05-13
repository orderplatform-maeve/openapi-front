
module.exports = (app) => {
  app.get('/api/stores', (request, response) => {
    response.json({
      stores: ['청담이상', '연안식당'],
    });
  });
};
