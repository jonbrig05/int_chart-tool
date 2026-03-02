import { useState, useRef, useEffect } from 'react'

const BRAND_COLORS = [
  '#005CB9', '#091F40', '#DB0032', '#0054A4',
  '#EE3124', '#9BE1FB', '#C5EFFD', '#6D6E71',
]

const HEX_RE = /^#[0-9a-fA-F]{6}$/

export default function DataTable({ rows, errors, updateRow, removeRow, chartType }) {
  const listRef = useRef(null)
  const prevLengthRef = useRef(rows.length)

  useEffect(() => {
    if (rows.length > prevLengthRef.current && listRef.current) {
      const lastInput = listRef.current.querySelector('div:last-child input[type="text"]')
      if (lastInput) lastInput.focus()
    }
    prevLengthRef.current = rows.length
  }, [rows.length])

  const isScatter = chartType === 'scatter'

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Column headers */}
      <div className="flex items-center gap-2 px-1 mb-1.5">
        <span className="w-5 shrink-0" />
        <span className="flex-1 text-xs text-slate-500 font-medium">
          {isScatter ? 'X Value' : 'Label'}
        </span>
        <span className="w-24 text-xs text-slate-500 font-medium">
          {isScatter ? 'Y Value' : 'Value'}
        </span>
        <span className="w-7" />
      </div>

      {/* Scrollable rows */}
      <div ref={listRef} className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {rows.map((row) => (
          <DataRow
            key={row.id}
            row={row}
            error={errors[row.id]}
            updateRow={updateRow}
            removeRow={removeRow}
            canRemove={rows.length > 1}
            isScatter={isScatter}
          />
        ))}
      </div>
    </div>
  )
}

function DataRow({ row, error, updateRow, removeRow, canRemove, isScatter }) {
  const colorInputRef = useRef(null)
  const [hexDraft, setHexDraft] = useState(row.color)

  useEffect(() => {
    setHexDraft(row.color)
  }, [row.color])

  const handleHexChange = (e) => {
    let val = e.target.value
    if (val && !val.startsWith('#')) val = '#' + val
    setHexDraft(val)
    if (HEX_RE.test(val)) updateRow(row.id, 'color', val)
  }

  const handleHexBlur = () => {
    if (!HEX_RE.test(hexDraft)) setHexDraft(row.color)
  }

  return (
    <div className="group">
      {/* Main row */}
      <div className="flex items-center gap-2">
        {/* Color swatch — clicking opens native OS color picker */}
        <div className="relative shrink-0 w-5 h-5">
          <button
            type="button"
            onClick={() => colorInputRef.current?.click()}
            title="Pick color"
            className="w-5 h-5 rounded-full border-2 border-slate-600 hover:border-slate-300 transition-colors cursor-pointer shadow-sm"
            style={{ backgroundColor: row.color }}
          />
          <input
            ref={colorInputRef}
            type="color"
            value={row.color}
            onChange={(e) => updateRow(row.id, 'color', e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            tabIndex={-1}
          />
        </div>

        {/* Label input */}
        <div className="flex-1">
          <input
            type="text"
            value={row.label}
            onChange={(e) => updateRow(row.id, 'label', e.target.value)}
            placeholder={isScatter ? '0' : 'Label'}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5
              text-sm text-slate-200 placeholder-slate-600
              focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
              transition-colors duration-150"
          />
        </div>

        {/* Value input */}
        <input
          type="number"
          value={row.value}
          onChange={(e) => updateRow(row.id, 'value', e.target.value)}
          placeholder="0"
          className={`w-24 bg-slate-800 border rounded-md px-2.5 py-1.5
            text-sm text-slate-200 placeholder-slate-600
            focus:outline-none focus:ring-1 transition-colors duration-150
            ${
              error
                ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30'
                : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/30'
            }`}
        />

        {/* Remove button */}
        <button
          onClick={() => removeRow(row.id)}
          disabled={!canRemove}
          title="Remove row"
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600
            hover:text-red-400 hover:bg-red-900/30 disabled:opacity-20 disabled:cursor-not-allowed
            transition-all duration-150 shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Brand preset swatches */}
      <div className="flex items-center gap-1.5 mt-1.5 ml-7">
        {BRAND_COLORS.map((hex) => (
          <button
            key={hex}
            type="button"
            onClick={() => updateRow(row.id, 'color', hex)}
            title={hex}
            className={`w-5 h-5 rounded-full border-2 shrink-0 transition-all duration-100 ${
              row.color.toLowerCase() === hex.toLowerCase()
                ? 'border-white scale-110'
                : 'border-slate-600 hover:border-slate-300 hover:scale-110'
            }`}
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>

      {/* Hex code input */}
      <div className="mt-1 ml-7">
        <input
          type="text"
          value={hexDraft}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          maxLength={7}
          spellCheck={false}
          placeholder="#000000"
          className={`w-[5.5rem] bg-slate-800/60 border rounded-md px-2 py-0.5
            text-xs font-mono transition-colors duration-150
            focus:outline-none focus:ring-1
            ${
              HEX_RE.test(hexDraft)
                ? 'text-slate-400 border-slate-700 focus:border-blue-500 focus:ring-blue-500/30'
                : 'text-red-400 border-red-500/70 focus:border-red-500 focus:ring-red-500/30'
            }`}
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-1 ml-7 pl-1.5">{error}</p>
      )}
    </div>
  )
}
