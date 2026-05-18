import {defineField, defineType} from 'sanity'
import {TextColorPicker} from '../components/TextColorPicker'

const IMAGE_VARIANTS = ['image-bleed', 'image-bar', 'image-corner', 'video']

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Short description shown on the grid card.',
    }),
    defineField({
      name: 'lede',
      title: 'Lede',
      type: 'text',
      rows: 3,
      description: 'Editorial lede for the project page — serif, large.',
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'string',
      description: 'e.g. "Oil on linen, 36×48 in." — rendered in the project meta block.',
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      description: 'Display this project on the homepage grid',
      initialValue: false,
    }),
    defineField({
      name: 'pinToTopRow',
      title: 'Pin to Top Row',
      type: 'boolean',
      description: 'Pin this project to the top row (max 3 projects)',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Position in grid (1 = first/left, 2 = second/middle, 3 = third/right, etc.). Lower numbers appear first.',
      initialValue: 999,
      validation: (rule) => rule.required().min(1).integer(),
    }),
    defineField({
      name: 'tileVariant',
      title: 'Tile Variant',
      type: 'string',
      description: 'Layout for the homepage tile.',
      options: {
        list: [
          {title: 'Color field', value: 'color'},
          {title: 'Image — full bleed', value: 'image-bleed'},
          {title: 'Image — bar', value: 'image-bar'},
          {title: 'Image — corner', value: 'image-corner'},
          {title: 'Type only', value: 'type-only'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
      initialValue: 'color',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tileImage',
      title: 'Tile Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Required for image-bleed, image-bar, image-corner, and video variants.',
      hidden: ({parent}) => !IMAGE_VARIANTS.includes(parent?.tileVariant),
      validation: (rule) =>
        rule.custom((value, context) => {
          const variant = (context.parent as {tileVariant?: string} | undefined)?.tileVariant
          if (variant && IMAGE_VARIANTS.includes(variant) && !value) {
            return 'Tile image is required for this variant.'
          }
          return true
        }),
    }),
    defineField({
      name: 'videoDuration',
      title: 'Video Duration',
      type: 'string',
      description: 'Format: M:SS or H:MM:SS (e.g. "14:00" or "1:22:30").',
      hidden: ({parent}) => parent?.tileVariant !== 'video',
      validation: (rule) =>
        rule.custom((value, context) => {
          const variant = (context.parent as {tileVariant?: string} | undefined)?.tileVariant
          if (variant !== 'video') return true
          if (!value) return 'Video duration is required for video variant.'
          return /^\d{1,2}:\d{2}(:\d{2})?$/.test(value)
            ? true
            : 'Must be M:SS or H:MM:SS.'
        }),
    }),
    defineField({
      name: 'cardBackgroundColor',
      title: 'Card Background Color',
      type: 'color',
      description: 'Background color for the homepage tile and project page canvas.',
      options: {disableAlpha: true},
    }),
    defineField({
      name: 'cardTextColor',
      title: 'Card Text Color',
      type: 'string',
      description:
        'Text color for the tile and project page. Picker enables swatches that meet AA contrast against the background.',
      initialValue: '#111111',
      components: {input: TextColorPicker},
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Year the work was completed (e.g. 2024).',
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Composable content blocks below the structured project header.',
      of: [
        {type: 'imageBlock'},
        {type: 'textBlock'},
        {type: 'linkBlock'},
        {type: 'headingBlock'},
        {type: 'colorBlock'},
        {type: 'spacerBlock'},
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Custom title for search engines (leave empty to use project title)',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Meta description for search engines',
    }),
    defineField({
      name: 'seoImage',
      title: 'SEO Image',
      type: 'image',
      description: 'Image for social media sharing (Open Graph)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      pinned: 'pinToTopRow',
      homepage: 'showOnHomepage',
      order: 'order',
      variant: 'tileVariant',
    },
    prepare({title, pinned, homepage, order, variant}) {
      const labels: string[] = []
      if (pinned) labels.push('Pinned')
      if (homepage) labels.push('Homepage')
      const orderInfo = order !== undefined ? `Order: ${order}` : 'Order: Not set'
      const variantInfo = variant ? `· ${variant}` : ''
      const subtitle = labels.length
        ? `${labels.join(' & ')} • ${orderInfo} ${variantInfo}`
        : `${orderInfo} ${variantInfo}`
      return {
        title,
        subtitle,
      }
    },
  },
})
