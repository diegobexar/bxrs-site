import {defineField, defineType} from 'sanity'
import {layoutFields, layoutFieldset} from './layoutFields'
import {fontFamilyField, fontSizeField} from './fontFields'

export const linkBlock = defineType({
  name: 'linkBlock',
  title: 'Link Block',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      initialValue: true,
    }),
    fontFamilyField('titleFontFamily', 'Title Font Family', 'sans'),
    fontSizeField('titleFontSize', 'Title Font Size', 't-24'),
    fontFamilyField('descriptionFontFamily', 'Description Font Family', 'mono'),
    fontSizeField('descriptionFontSize', 'Description Font Size', 't-12'),
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
      title: 'title',
      url: 'url',
    },
    prepare({title, url}) {
      return {
        title: title || 'Link',
        subtitle: url,
      }
    },
  },
})
