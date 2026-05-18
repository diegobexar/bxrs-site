import {defineField, defineType} from 'sanity'
import {layoutFields, layoutFieldset} from './layoutFields'
import {fontFamilyField, fontSizeField} from './fontFields'

export const headingBlock = defineType({
  name: 'headingBlock',
  title: 'Heading Block',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'level',
      title: 'Heading Level',
      type: 'string',
      options: {
        list: [
          {title: 'H1', value: 'h1'},
          {title: 'H2', value: 'h2'},
          {title: 'H3', value: 'h3'},
          {title: 'H4', value: 'h4'},
        ],
      },
      initialValue: 'h2',
    }),
    fontFamilyField('fontFamily', 'Font Family', 'sans'),
    fontSizeField(
      'fontSize',
      'Font Size Override',
      undefined,
      'Optional. Default sizing for the chosen Heading Level comes from the design system; this field overrides it.',
    ),
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
      text: 'text',
      level: 'level',
    },
    prepare({text, level}) {
      return {
        title: text,
        subtitle: level?.toUpperCase() || 'H2',
      }
    },
  },
})
