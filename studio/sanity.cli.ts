import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'izt9f0dq',
    dataset: 'production'
  },
  studioHost: 'bxrs',
  deployment: {
    appId: 'ogc3jkg1o05bce6zj7hv65m9',
    autoUpdates: true,
  },
  typegen: {
    path: '../src/**/*.{ts,tsx}',
    schema: './schema.json',
    generates: '../src/sanity/sanity.types.ts',
  },
})
