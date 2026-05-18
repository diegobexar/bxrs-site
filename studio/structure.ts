import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {SINGLETONS} from './schemaTypes'

const SINGLETON_TYPES = new Set(SINGLETONS.map((s) => s.type as string))

// Custom desk: each singleton appears as a single editable document; everything
// else falls through to the default list-by-type view.
export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      ...SINGLETONS.map((s) =>
        S.listItem()
          .title(s.title)
          .id(s.id)
          .child(S.document().schemaType(s.type).documentId(s.id)),
      ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? ''),
      ),
    ])

// Hide create / duplicate / delete actions on singleton docs so the artist
// can only edit the single instance.
export const SINGLETON_BLOCKED_ACTIONS = new Set([
  'duplicate',
  'unpublish',
  'delete',
])
