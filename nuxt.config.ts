// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-05-17',
  future: {
    compatibilityVersion: 4
  },
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@nuxt/eslint', 'shadcn-nuxt'],
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['node']
      }
    }
  }
})