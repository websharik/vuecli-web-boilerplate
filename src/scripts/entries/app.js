const VUE_APPS = {
  App: require('@scripts/app').default
}

document.addEventListener('DOMContentLoaded', async () => {
  Object.values(window['VUE_APPS'] ?? []).map(async ctx => {
    let { app, store, router } = await VUE_APPS[ctx.name](ctx)

    app
      .use(store)
      .use(router)
      .mount(document.querySelector(`[vue-app="${ctx.identificator}"]`))
  })
})
