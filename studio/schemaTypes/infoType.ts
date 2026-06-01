import {defineArrayMember, defineField, defineType} from 'sanity'

export const infoType = defineType({
  name: 'info',
  title: 'Info / About',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Big H1 at the top of the page (e.g. "INFO.").',
      initialValue: 'INFO.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featureImage',
      title: 'Feature Image',
      type: 'image',
      description: 'Portrait sitting above the title in the left column.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      description: 'Serif body paragraphs in the left column.',
      of: [{type: 'block', styles: [{title: 'Paragraph', value: 'normal'}]}],
    }),
    defineField({
      name: 'contactLabel',
      title: 'Contact Button Label',
      type: 'string',
      description: 'e.g. "WRITE TO ME →". Leave blank to hide the button.',
      initialValue: 'WRITE TO ME →',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description:
        'Destination for the contact button. Falls back to Site Settings → Contact Email if blank.',
    }),
    defineField({
      name: 'stacks',
      title: 'Stacks',
      type: 'array',
      description:
        'Right-column sections (e.g. BASED IN, SELECTED PRESS, REPRESENTATION).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stack',
          title: 'Stack',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'e.g. "BASED IN". Rendered uppercase mono.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'rows',
              title: 'Rows',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'row',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'value',
                      title: 'Value',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: {title: 'label', subtitle: 'value'},
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'heading', rows: 'rows'},
            prepare({title, rows}) {
              const count = Array.isArray(rows) ? rows.length : 0
              return {
                title,
                subtitle: `${count} ${count === 1 ? 'row' : 'rows'}`,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Info / About'}
    },
  },
})
