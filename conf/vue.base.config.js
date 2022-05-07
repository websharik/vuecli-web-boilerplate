const {
  publicPath,
  PATHS,
  ALIASES,
  CONSTANTS,
  isProd
} = require('./settings.js')

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: publicPath,
  outputDir: PATHS.dist,
  filenameHashing: false,
  productionSourceMap: false,
  configureWebpack: config => {
    //rename js to scripts
    config.output.filename = config.output.filename.replace('js/', 'scripts/')
    config.output.chunkFilename = config.output.chunkFilename.replace(
      'js/',
      'scripts/'
    )

    //apply aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      ...ALIASES
    }
  },
  chainWebpack: config => {
    if (isProd) {
      //rename css to styles
      config.plugin('extract-css').tap(args => {
        args[0] = {
          filename: args[0].filename.replace('css/', 'styles/'),
          chunkFilename: args[0].chunkFilename.replace('css/', 'styles/')
        }
        return args
      })
    }

    //define merge
    config.plugin('define').tap(args => {
      return [
        {
          ...args[0],
          ...CONSTANTS
        }
      ]
    })
  }
}
