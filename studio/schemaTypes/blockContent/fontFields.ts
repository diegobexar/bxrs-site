import {defineField} from 'sanity'

// Shared design-system font controls. Reused across text/heading/link/image
// blocks so the artist gets the same picker everywhere.

export const FONT_FAMILY_OPTIONS = [
  {title: 'Sans — Archivo', value: 'sans'},
  {title: 'Serif — Newsreader (prose)', value: 'serif'},
  {title: 'Mono — JetBrains Mono', value: 'mono'},
  {title: 'Display — Raygun (pull quote only)', value: 'display'},
]

export const FONT_SIZE_OPTIONS = [
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
  {title: '120 — hero', value: 't-120'},
]

export function fontFamilyField(
  name = 'fontFamily',
  title = 'Font Family',
  initialValue: string | undefined = 'sans',
) {
  return defineField({
    name,
    title,
    type: 'string',
    options: {list: FONT_FAMILY_OPTIONS},
    initialValue,
  })
}

export function fontSizeField(
  name = 'fontSize',
  title = 'Font Size',
  initialValue?: string,
  description?: string,
) {
  return defineField({
    name,
    title,
    type: 'string',
    options: {list: FONT_SIZE_OPTIONS},
    initialValue,
    description,
  })
}
