const { env: { UPLOAD_TYPE, UPLOAD_VERSION } } = process;

/** @type import('@vue/cli-service').ProjectOptions */
module.exports = {
  filenameHashing: false,
  publicPath: process.env && !!process.env.UPLOAD_TYPE ? `/v/${UPLOAD_TYPE}/${UPLOAD_VERSION}` : '/',
  // publicPath: '/v/1/0/8',
  // https://github.com/neutrinojs/webpack-chain/tree/v4#getting-started
  chainWebpack(config) {
    // Set up all the aliases we use in our app.
    config.resolve.alias.clear().merge(require('./aliases.config').webpack);
    config.plugin('define').tap((args) => {
      args[0] = {
        ...args[0],
        'process.env.STOP_REDIRECT': process.env.STOP_REDIRECT,
        'process.env.UPLOAD_TYPE': JSON.stringify(process.env.UPLOAD_TYPE),
        'process.env.SERVER_TYPE': JSON.stringify(process.env.SERVER_TYPE),
      };
      return args;
    });
  },
  // Configure Webpack's dev server.
  // https://cli.vuejs.org/guide/cli-service.html
  devServer: {
    ...(process.env.API_BASE_URL
      ? // Proxy API endpoints to the production base URL.
      { proxy: { '/api': { target: process.env.API_BASE_URL } } }
      : // Proxy API endpoints a local mock API.
      { before: require('./tests/mock-api') }),
  },
};
