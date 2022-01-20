const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const JavaScriptObfuscator = require('webpack-obfuscator')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const { JSDOM } = require('jsdom')

const settings = require('./conf/settings.js')
const {
  isProd,
  publicPath,
  PATHS,
  PAGES,
  PRERENDER,
  OBFUSCATOR,
  DEVSERVER,
  ALIASES,
  CONSTANTS,
  ENTRIES
} = settings

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: publicPath,
  outputDir: PATHS.dist,
  filenameHashing: false,
  devServer: {
    port: DEVSERVER.port,
    open: true,
    openPage: 'app.html' /*Object.values(PAGES)[0].filename .map(
      page => page.filename
    )*/,
    proxy: {
      '/': {
        secure: false,
        changeOrigin: true,
        autoRewrite: true,
        headers: {
          'X-ProxiedBy-Webpack': true
        },
        target: DEVSERVER.proxyTarget
      }
    }
  },
  pages: PAGES,
  productionSourceMap: false,
  configureWebpack: config => {
    //entries
    config.entry = ENTRIES

    //rename vendors
    config.optimization.splitChunks.cacheGroups.vendors.name = 'vendors'
    //remove common
    delete config.optimization.splitChunks.cacheGroups.common

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
    //move public to src/static
    config.plugin('copy').use(CopyWebpackPlugin, [
      [
        {
          from: path.resolve(`${PATHS.src}/static`),
          to: PATHS.dist
        }
      ]
    ])

    //define merge
    config.plugin('define').tap(args => {
      return [
        {
          ...args[0],
          ...CONSTANTS
        }
      ]
    })

    if (isProd) {
      //rename css to styles
      config.plugin('extract-css').tap(args => {
        args[0] = {
          filename: args[0].filename.replace('css/', 'styles/'),
          chunkFilename: args[0].chunkFilename.replace('css/', 'styles/')
        }
        return args
      })

      //obfuscator
      config
        .plugin('obfuscator')
        .use(JavaScriptObfuscator, [OBFUSCATOR.config, OBFUSCATOR.excludes])

      //prerender
      PRERENDER.items.map(item => {
        config.plugin('prerender').use(PrerenderSPAPlugin, [
          {
            staticDir: PATHS.dist,
            outputDir: path.join(PATHS.dist, `./prerender/${item.name}`),
            indexPath: path.join(PATHS.dist, item.template),
            routes: item.routes,
            postProcess(renderedRoute) {
              let DOM = new JSDOM(renderedRoute.html)
              if (item.selector)
                renderedRoute.html = DOM.window.document.querySelector(
                  item.selector
                ).outerHTML
              return renderedRoute
            },
            minify: PRERENDER.minify,
            renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
              ...PRERENDER.renderer,
              inject: item.inject
            })
          }
        ])
      })
    }
  }
}
