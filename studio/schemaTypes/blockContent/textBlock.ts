import {defineField, defineType} from 'sanity'
import {layoutFields, layoutFieldset} from './layoutFields'
import {fontFamilyField, fontSizeField} from './fontFields'

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
    fontFamilyField(
      'fontFamily',
      'Font Family',
      'sans',
      'Sans (Archivo) for UI text · Serif (Newsreader) for prose / long-form · Mono (JetBrains Mono) for metadata · Display (Raygun) for pull quotes only.',
    ),
    fontSizeField(
      'fontSize',
      'Font Size',
      't-16',
      'BXRS type scale. Ignored when Font Family is "Serif" (prose uses its own scale).',
    ),
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
