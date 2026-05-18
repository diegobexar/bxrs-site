import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {schemaTypes, SINGLETONS} from './schemaTypes'
import {structure, SINGLETON_BLOCKED_ACTIONS} from './structure'

const SINGLETON_TYPES = new Set(SINGLETONS.map((s) => s.type as string))

export default defineConfig({
  name: 'default',
  title: 'BXRS',

  projectId: 'izt9f0dq',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool(), colorInput()],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    actions: (input, {schemaType}) =>
      SINGLETON_TYPES.has(schemaType)
        ? input.filter(({action}) => !action || !SINGLETON_BLOCKED_ACTIONS.has(action))
        : input,
  },
})
