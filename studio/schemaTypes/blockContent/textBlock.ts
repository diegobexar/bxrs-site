import {defineField, defineType} from 'sanity'
import {layoutFields, layoutFieldset} from './layoutFields'

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fontFamily',
      title: 'Font Family',
      type: 'string',
      description:
        'Sans (Archivo) for UI text · Serif (Newsreader) for prose / long-form · Mono (JetBrains Mono) for metadata · Display (Raygun) for pull quotes only.',
      options: {
        list: [
          {title: 'Sans — Archivo', value: 'sans'},
          {title: 'Serif — Newsreader (prose)', value: 'serif'},
          {title: 'Mono — JetBrains Mono', value: 'mono'},
          {title: 'Display — Raygun (pull quote only)', value: 'display'},
        ],
      },
      initialValue: 'sans',
    }),
    defineField({
      name: 'fontSize',
      title: 'Font Size',
      type: 'string',
      description: 'BXRS type scale. Ignored when Font Family is "Serif" (prose uses its own scale).',
      options: {
        list: [
          {title: '12 — caption', value: 't-12'},
          {title: '14 — small', value: 't-14'},
          {title: '16 — body', value: 't-16'},
          {title: '18 — body large', value: 't-18'},
          {title: '20 — lede', value: 't-20'},
          {title: '24 — h3', value: 't-24'},
          {title: '32 — h2', value: 't-32'},
          {title: '44 — h1', value: 't-44'},
          {title: '60 — display', value: 't-60'},
          {title: '84 — display large', value: 't-84'},
        ],
      },
      initialValue: 't-16',
    }),
    defineField({
      name: 'fontWeight',
      title: 'Font Weight',
      type: 'string',
      options: {
        list: [
          {title: 'Normal', value: 'normal'},
          {title: 'Medium', value: 'medium'},
          {title: 'Semibold', value: 'semibold'},
          {title: 'Bold', value: 'bold'},
        ],
      },
      initialValue: 'normal',
    }),
    defineField({
      name: 'textTransform',
      title: 'Text Transform',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Uppercase', value: 'uppercase'},
          {title: 'Lowercase', value: 'lowercase'},
          {title: 'Capitalize', value: 'capitalize'},
        ],
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color code (e.g., #F5F5DC)',
    }),
    ...layoutFields,
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({content}) {
      const block = content?.find((c: any) => c._type === 'block')
      const text = block?.children?.[0]?.text || 'Text Block'
      return {
        title: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      }
    },
  },
})
