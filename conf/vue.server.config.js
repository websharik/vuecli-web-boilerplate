const nodeExternals = require('webpack-node-externals')
const { merge } = require('webpack-merge')

const { ENTRIES_SSR, isProd } = require('./settings.js')

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = merge(require('./vue.base.config.js'), {
  /*devServer: {
    overlay: {
      warnings: false,
      errors: false
    }
  },*/
  configureWebpack: config => {
    //entries
    config.entry = ENTRIES_SSR

    //enable minimize
    //config.optimization.minimize = true
    //rename vendors
    //config.optimization.splitChunks.cacheGroups.defaultVendors.name = 'vendors'
  },
  chainWebpack: config => {
    config.module.rule('vue').uses.delete('cache-loader')
    config.module.rule('js').uses.delete('cache-loader')
    config.module.rule('ts').uses.delete('cache-loader')
    config.module.rule('tsx').uses.delete('cache-loader')

    for (const entry of Object.keys(ENTRIES_SSR)) {
      config.entry(entry).clear().add(ENTRIES_SSR[entry])
    }

    config.target('node')
    config.output.libraryTarget('commonjs2')

    /*config
      .plugin('manifest')
      .use(new ManifestPlugin({ fileName: 'ssr-manifest.json' }))*/

    /*config.externals(
      nodeExternals({
        allowlist: /\.(vue)$/
      })
    )*/

    config.optimization.splitChunks(false).minimize(false)

    //remove extract css on ssr
    const isExtracting = config.plugins.has('extract-css')
    if (isExtracting) {
      // Remove extract
      const langs = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus']
      const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
      for (const lang of langs) {
        for (const type of types) {
          const rule = config.module.rule(lang).oneOf(type)
          rule.uses.delete('extract-css-loader')
          // Critical CSS
          rule.use('vue-style').loader('vue-style-loader').before('css-loader')
        }
      }
      config.plugins.delete('extract-css')
    }

    config.plugins.delete('html')
    config.plugins.delete('hmr')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugins.delete('progress')
    config.plugins.delete('friendly-errors')
  }
})
