const { renderApp } = require('./dist/scripts/app_ssr')
;(async () => {
  console.log(
    await renderApp({
      name: 'App',
      identificator: 'app'
    })
  )
})()
