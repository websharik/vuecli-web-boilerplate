import { renderToString } from 'vue/server-renderer'

const VUE_APPS = {
  App: require('@scripts/app').default
}

export async function renderApp(ctx) {
  let { app, store, router } = await VUE_APPS[ctx.name](ctx)
  app.use(store).use(router)

  return {
    INITIAL_STATE: store.state,
    HTML: await renderToString(app)
  }
}
