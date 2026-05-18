import {useCallback} from 'react'
import {set, unset, type StringInputProps, useFormValue} from 'sanity'
import {BXRS_TEXT_COLORS, contrast} from '../lib/contrast'

const MIN_AA = 4.5
const DEFAULT_BG = '#F4EFE3'

// cardBackgroundColor is a `color` document field (from @sanity/color-input),
// shaped as `{_type: 'color', hex, alpha, hsl, hsv, rgb}`. Fall back to the
// design system's paper canvas while the artist hasn't picked one yet.
function readBgHex(value: unknown): string {
  if (!value) return DEFAULT_BG
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'hex' in value) {
    const hex = (value as {hex?: unknown}).hex
    if (typeof hex === 'string') return hex
  }
  return DEFAULT_BG
}

export function TextColorPicker(props: StringInputProps) {
  const {value, onChange} = props
  // The sibling cardBackgroundColor field. Read via the form so the picker
  // re-evaluates whenever the background changes.
  const bg = readBgHex(useFormValue(['cardBackgroundColor']))

  const handleSelect = useCallback(
    (hex: string) => {
      onChange(hex ? set(hex) : unset())
    },
    [onChange],
  )

  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
      {BXRS_TEXT_COLORS.map((swatch) => {
        const ratio = contrast(bg, swatch.hex)
        const passes = ratio >= MIN_AA
        const selected = (value || '').toLowerCase() === swatch.hex.toLowerCase()
        return (
          <button
            key={swatch.hex}
            type="button"
            onClick={() => passes && handleSelect(swatch.hex)}
            disabled={!passes}
            title={`${swatch.name} · ${ratio.toFixed(2)}:1${passes ? '' : ' (fails AA)'}`}
            aria-label={`${swatch.name}, contrast ${ratio.toFixed(2)} to 1`}
            aria-pressed={selected}
            style={{
              width: 56,
              height: 56,
              background: swatch.hex,
              border: selected ? '3px solid #111' : '1px solid #00000022',
              boxShadow: selected ? '0 0 0 3px #FFD60A' : 'none',
              opacity: passes ? 1 : 0.25,
              cursor: passes ? 'pointer' : 'not-allowed',
              padding: 0,
              borderRadius: 0,
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                bottom: 2,
                left: 4,
                fontFamily: 'ui-monospace, Menlo, monospace',
                fontSize: 9,
                color: contrast(swatch.hex, '#111111') >= 3 ? '#111' : '#fff',
              }}
            >
              {ratio.toFixed(1)}
            </span>
          </button>
        )
      })}
      <div
        style={{
          width: '100%',
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: 11,
          color: '#666',
          marginTop: 4,
        }}
      >
        Text color must reach AA contrast ({MIN_AA}:1) against{' '}
        <code>{bg}</code>. Disabled swatches fail.
      </div>
    </div>
  )
}
