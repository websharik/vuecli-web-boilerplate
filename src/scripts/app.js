import { createApp, createSSRApp } from 'vue'
import store from '@scripts/store'
import router from '@scripts/router'

import IP from '@components/IP.vue'
import Hello from '@components/Hello'

export default async ctx => {
  let app = typeof window !== 'undefined' ? createApp(IP) : createSSRApp(IP)

  if (ctx.INITIAL_STATE) await store.replaceState(ctx.INITIAL_STATE)
  else if (ctx.config) await store.dispatch(`loadConfig`, ctx.config)

  return {
    app,
    store,
    router
  }
}
