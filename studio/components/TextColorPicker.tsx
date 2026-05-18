import {useCallback, useMemo} from 'react'
import {set, unset, type StringInputProps, useFormValue} from 'sanity'
import {BXRS_TEXT_COLORS, contrast} from '../lib/contrast'

const MIN_AA = 4.5
const DEFAULT_BG = '#F4EFE3'

// Label legibility is determined per-swatch against ink; precompute once so
// it doesn't recompute on every render of every button.
const LABEL_COLORS: Record<string, string> = Object.fromEntries(
  BXRS_TEXT_COLORS.map((s) => [s.hex, contrast(s.hex, '#111111') >= 3 ? '#111' : '#fff']),
)

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
  const bg = readBgHex(useFormValue(['cardBackgroundColor']))

  const swatches = useMemo(
    () =>
      BXRS_TEXT_COLORS.map((s) => {
        const ratio = contrast(bg, s.hex)
        return {...s, ratio, passes: ratio >= MIN_AA}
      }),
    [bg],
  )

  const handleSelect = useCallback(
    (hex: string) => {
      onChange(hex ? set(hex) : unset())
    },
    [onChange],
  )

  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
      {swatches.map((swatch) => {
        const selected = (value || '').toLowerCase() === swatch.hex.toLowerCase()
        return (
          <button
            key={swatch.hex}
            type="button"
            onClick={() => swatch.passes && handleSelect(swatch.hex)}
            disabled={!swatch.passes}
            title={`${swatch.name} · ${swatch.ratio.toFixed(2)}:1${swatch.passes ? '' : ' (fails AA)'}`}
            aria-label={`${swatch.name}, contrast ${swatch.ratio.toFixed(2)} to 1`}
            aria-pressed={selected}
            style={{
              width: 56,
              height: 56,
              background: swatch.hex,
              border: selected ? '3px solid #111' : '1px solid #00000022',
              boxShadow: selected ? '0 0 0 3px #FFD60A' : 'none',
              opacity: swatch.passes ? 1 : 0.25,
              cursor: swatch.passes ? 'pointer' : 'not-allowed',
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
                color: LABEL_COLORS[swatch.hex],
              }}
            >
              {swatch.ratio.toFixed(1)}
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
