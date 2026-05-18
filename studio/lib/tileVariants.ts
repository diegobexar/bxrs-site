export const TILE_VARIANTS = [
  'color',
  'image-bleed',
  'image-bar',
  'image-corner',
  'type-only',
  'video',
] as const

export type TileVariant = (typeof TILE_VARIANTS)[number]

export const TILE_VARIANTS_REQUIRING_IMAGE: readonly TileVariant[] = [
  'image-bleed',
  'image-bar',
  'image-corner',
  'video',
] as const
