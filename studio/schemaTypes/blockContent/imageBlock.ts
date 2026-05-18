import {defineField, defineType} from 'sanity'
import {layoutFields, layoutFieldset} from './layoutFields'
import {fontFamilyField, fontSizeField} from './fontFields'

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image Block',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    fontFamilyField('captionFontFamily', 'Caption Font Family', 'mono'),
    fontSizeField('captionFontSize', 'Caption Font Size', 't-12'),
    defineField({
      name: 'link',
      title: 'Link URL',
      type: 'url',
      description: 'Optional link when image is clicked',
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
      media: 'image',
      title: 'caption',
    },
    prepare({media, title}) {
      return {
        title: title || 'Image Block',
        media,
      }
    },
  },
})
