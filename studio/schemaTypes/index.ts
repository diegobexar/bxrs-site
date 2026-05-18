import {infoType} from './infoType'
import {postType} from './postType'
import {projectType} from './projectType'
import {siteSettingsType} from './siteSettingsType'
import {
  imageBlock,
  textBlock,
  linkBlock,
  headingBlock,
  colorBlock,
  spacerBlock,
} from './blockContent'

export const schemaTypes = [
  // Documents
  postType,
  projectType,
  siteSettingsType,
  infoType,
  // Block content types
  imageBlock,
  textBlock,
  linkBlock,
  headingBlock,
  colorBlock,
  spacerBlock,
]

// Singleton document types — exactly one document each, fixed ID.
export const SINGLETONS = [
  {type: 'siteSettings', id: 'siteSettings', title: 'Site Settings'},
  {type: 'info', id: 'info', title: 'Info / About'},
] as const
