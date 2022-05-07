const { merge } = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const JavaScriptObfuscator = require('webpack-obfuscator')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const { JSDOM } = require('jsdom')
const path = require('path')

const {
  isProd,
  PATHS,
  PAGES,
  PRERENDER,
  OBFUSCATOR,
  DEVSERVER,
  ENTRIES
} = require('./settings.js')

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = merge(require('./vue.base.config.js'), {
  devServer: {
    host: DEVSERVER.host,
    port: DEVSERVER.port,
    open: Object.values(PAGES).map(page => page.filename)
    /*proxy: {
          '/': {
            secure: false,
            changeOrigin: true,
            autoRewrite: true,
            headers: {
              'X-ProxiedBy-Webpack': true
            },
            target: DEVSERVER.proxyTarget
          }
        }*/
  },
  pages: PAGES,
  configureWebpack: config => {
    //entries
    config.entry = ENTRIES
    //enable minimize
    config.optimization.minimize = true
    //rename vendors
    config.optimization.splitChunks.cacheGroups.defaultVendors.name = 'vendors'
    //remove common
    delete config.optimization.splitChunks.cacheGroups.common
  },
  chainWebpack: config => {
    //move public to src/static
    config.plugin('copy').use(CopyWebpackPlugin, [
      {
        patterns: [
          {
            from: path.resolve(`${PATHS.src}/static`),
            to: PATHS.dist
          }
        ]
      }
    ])

    if (isProd) {
      //obfuscator
      /*config
        .plugin('obfuscator')
        .use(JavaScriptObfuscator, [OBFUSCATOR.config, OBFUSCATOR.excludes])*/

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
})
