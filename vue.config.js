module.exports = process.env.SSR
  ? require('./conf/vue.server.config.js')
  : require('./conf/vue.browser.config.js')
