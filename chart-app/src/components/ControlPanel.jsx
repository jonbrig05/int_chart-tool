import { useState, useRef, useEffect } from 'react'
import DataTable from './DataTable'

const BG_PRESETS = [
  { hex: '#0A1628', label: 'Deep Navy' },
  { hex: '#FFFFFF', label: 'White' },
  { hex: '#F4F6F9', label: 'Light Gray' },
  { hex: '#091F40', label: 'Brand Dark Navy' },
  { hex: '#E8F4FD', label: 'Ice Blue' },
  { hex: '#1A1A2E', label: 'Deep Dark' },
  { hex: '#D6E4F0', label: 'Slate Blue' },
  { hex: '#F0F0F0', label: 'Off White' },
]

const CHART_TYPES = [
  { value: 'bar',      label: 'Bar',      icon: '▊' },
  { value: 'line',     label: 'Line',     icon: '〜' },
  { value: 'pie',      label: 'Pie',      icon: '◔' },
  { value: 'doughnut', label: 'Doughnut', icon: '◎' },
  { value: 'radar',    label: 'Radar',    icon: '⬡' },
  { value: 'scatter',  label: 'Scatter',  icon: '⁘' },
]

const FONT_OPTIONS = ['Inter', 'Georgia', 'Arial', 'Courier New', 'Impact']
const SIZE_OPTIONS = [24, 32, 40, 48, 56, 64, 72]

const HEX_RE = /^#[0-9a-fA-F]{6}$/

export default function ControlPanel({
  chartType, setChartType,
  rows, errors, updateRow, addRow, removeRow,
  importRows,
  exportPng, downloadCsv, validCount,
  canvasBg, setCanvasBg,
  chartTitle, setChartTitle,
  chartDesc, setChartDesc,
  titleFont, setTitleFont,
  titleSize, setTitleSize,
}) {
  return (
    <aside className="w-80 xl:w-96 bg-slate-900 border-r border-slate-700/60 flex flex-col overflow-hidden shrink-0">

      {/* Chart type selector */}
      <section className="px-5 py-4 border-b border-slate-700/60">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Chart Type
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {CHART_TYPES.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setChartType(value)}
              className={`
                flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg text-xs font-medium
                transition-all duration-150 border
                ${
                  chartType === value
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600 hover:text-white'
                }
              `}
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Chart Title */}
      <section className="px-5 py-4 border-b border-slate-700/60 space-y-3">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Chart Title
        </label>
        <input
          type="text"
          value={chartTitle}
          onChange={(e) => setChartTitle(e.target.value)}
          placeholder="Enter chart title…"
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5
            text-sm text-slate-200 placeholder-slate-600
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
            transition-colors duration-150"
        />
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 mb-1">Font</p>
            <select
              value={titleFont}
              onChange={(e) => setTitleFont(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5
                text-xs text-slate-200
                focus:outline-none focus:border-blue-500 transition-colors duration-150"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="w-[72px] shrink-0">
            <p className="text-xs text-slate-500 mb-1">Size</p>
            <select
              value={titleSize}
              onChange={(e) => setTitleSize(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5
                text-xs text-slate-200
                focus:outline-none focus:border-blue-500 transition-colors duration-150"
            >
              {SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}px</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">
            Description
            {chartDesc.trim() && (
              <span className="ml-1.5 text-slate-600">· legend hidden</span>
            )}
          </p>
          <textarea
            value={chartDesc}
            onChange={(e) => setChartDesc(e.target.value)}
            placeholder="Optional description shown on the chart…"
            rows={4}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5
              text-sm text-slate-200 placeholder-slate-600 resize-none
              focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
              transition-colors duration-150"
          />
        </div>
      </section>

      {/* Canvas background */}
      <section className="px-5 py-4 border-b border-slate-700/60">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Canvas Background
        </label>
        <BgColorPicker canvasBg={canvasBg} setCanvasBg={setCanvasBg} />
      </section>

      {/* Import Data */}
      <ImportData importRows={importRows} />

      {/* Data table */}
      <section className="flex-1 flex flex-col min-h-0 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Data Points
          </label>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
            {validCount} valid
          </span>
        </div>

        <DataTable
          rows={rows}
          errors={errors}
          updateRow={updateRow}
          removeRow={removeRow}
          chartType={chartType}
        />

        <button
          onClick={addRow}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg
            bg-slate-800 border border-slate-700 border-dashed text-slate-400
            hover:bg-slate-700 hover:border-slate-500 hover:text-slate-200
            transition-all duration-150 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add data point
        </button>
      </section>

      {/* Export actions */}
      <section className="px-5 py-4 border-t border-slate-700/60 space-y-2">
        <button
          onClick={exportPng}
          disabled={validCount === 0}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg
            bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500
            text-white text-sm font-semibold transition-all duration-150
            shadow-lg shadow-blue-900/30 disabled:shadow-none"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          Export as PNG
        </button>
        <button
          onClick={downloadCsv}
          disabled={validCount === 0}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg
            bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600
            text-slate-200 text-sm font-semibold transition-all duration-150 border border-slate-600
            disabled:border-slate-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download CSV
        </button>
      </section>
    </aside>
  )
}

function BgColorPicker({ canvasBg, setCanvasBg }) {
  const colorInputRef = useRef(null)
  const [hexDraft, setHexDraft] = useState(canvasBg)

  useEffect(() => {
    setHexDraft(canvasBg)
  }, [canvasBg])

  const handleHexChange = (e) => {
    let val = e.target.value
    if (val && !val.startsWith('#')) val = '#' + val
    setHexDraft(val)
    if (HEX_RE.test(val)) setCanvasBg(val)
  }

  const handleHexBlur = () => {
    if (!HEX_RE.test(hexDraft)) setHexDraft(canvasBg)
  }

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-1.5">
        {BG_PRESETS.map(({ hex, label }) => (
          <button
            key={hex}
            type="button"
            onClick={() => setCanvasBg(hex)}
            title={`${label} ${hex}`}
            className={`w-7 h-7 rounded-md border-2 transition-all duration-200 hover:scale-110 hover:shadow-md ${
              canvasBg.toLowerCase() === hex.toLowerCase()
                ? 'border-blue-400 ring-1 ring-blue-400/40 scale-110 shadow-md'
                : 'border-slate-600 hover:border-slate-400'
            }`}
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative shrink-0 w-5 h-5">
          <button
            type="button"
            onClick={() => colorInputRef.current?.click()}
            title="Pick background color"
            className="w-5 h-5 rounded-full border-2 border-slate-600 hover:border-slate-300 transition-colors cursor-pointer shadow-sm"
            style={{ backgroundColor: canvasBg }}
          />
          <input
            ref={colorInputRef}
            type="color"
            value={canvasBg}
            onChange={(e) => setCanvasBg(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            tabIndex={-1}
          />
        </div>
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
    </div>
  )
}

// ─── CSV / TSV parsing ────────────────────────────────────────────────────────

function parseCSVLine(line) {
  const cols = []
  let cur = ''
  let inQuotes = false
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      cols.push(cur.trim())
      cur = ''
    } else {
      cur += ch
    }
  }
  cols.push(cur.trim())
  return cols
}

// Always treats the first row as a header row.
// Returns { headers: string[], rows: string[][] }
function parseRaw(text, delimiter) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '')
  if (lines.length < 2) throw new Error('Need at least a header row and one data row.')
  const splitLine = delimiter === ','
    ? (l) => parseCSVLine(l)
    : (l) => l.split(delimiter).map((c) => c.trim())
  const [headerLine, ...dataLines] = lines
  const headers = splitLine(headerLine)
  if (headers.length < 1) throw new Error('No columns detected.')
  const rows = dataLines.map(splitLine).filter((r) => r.some((c) => c !== ''))
  if (rows.length === 0) throw new Error('No data rows found.')
  return { headers, rows }
}

// Returns the index of the first column (after col 0) whose values look numeric.
function guessValueCol(headers, rows) {
  for (let i = 1; i < headers.length; i++) {
    const sample = rows.slice(0, 10).map((r) => r[i] ?? '')
    if (sample.length > 0 && sample.every((v) => v === '' || !isNaN(Number(v)))) return i
  }
  return Math.min(1, headers.length - 1)
}

// ─── ImportData component ─────────────────────────────────────────────────────

function ImportData({ importRows }) {
  const [open, setOpen] = useState(false)
  // 'idle' → show inputs | 'mapped' → show column mapper
  const [stage, setStage] = useState('idle')
  const [pasteText, setPasteText] = useState('')
  const [headers, setHeaders] = useState([])
  const [rawRows, setRawRows] = useState([])
  const [labelCol, setLabelCol] = useState(0)
  const [valueCol, setValueCol] = useState(1)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const reset = () => {
    setStage('idle')
    setPasteText('')
    setHeaders([])
    setRawRows([])
    setLabelCol(0)
    setValueCol(1)
    setError('')
  }

  const loadParsed = ({ headers: h, rows: r }) => {
    const vc = guessValueCol(h, r)
    setHeaders(h)
    setRawRows(r)
    setLabelCol(0)
    setValueCol(vc)
    setError('')
    setStage('mapped')
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try { loadParsed(parseRaw(ev.target.result, ',')) }
      catch (err) { setError(err.message) }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleDetect = () => {
    try { loadParsed(parseRaw(pasteText, '\t')) }
    catch (err) { setError(err.message) }
  }

  const handleFlip = () => {
    setLabelCol(valueCol)
    setValueCol(labelCol)
  }

  const handleBuild = () => {
    const pairs = rawRows
      .map((row) => ({
        label: (row[labelCol] ?? '').trim(),
        value: (row[valueCol] ?? '').trim(),
      }))
      .filter((p) => p.label !== '' || p.value !== '')

    if (pairs.length === 0) { setError('No valid rows found.'); return }

    const bad = pairs.find((p) => p.value !== '' && isNaN(Number(p.value)))
    if (bad) {
      setError(`"${headers[valueCol]}" contains non-numeric data: "${bad.value}". Pick a numeric column.`)
      return
    }

    importRows(pairs)
    reset()
  }

  const colSelect = 'w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 ' +
    'text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors duration-150'

  return (
    <section className="border-b border-slate-700/60">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setError('') }}
        className="w-full px-5 py-3 flex items-center justify-between
          text-xs font-semibold text-slate-400 uppercase tracking-wider
          hover:text-slate-200 transition-colors duration-150"
      >
        Import Data
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-4">
          {error && (
            <p className="mb-3 text-red-400 text-xs bg-red-900/20 border border-red-800/40 rounded-md px-2.5 py-1.5">
              {error}
            </p>
          )}

          {/* ── Stage: idle — input area ── */}
          {stage === 'idle' && (
            <div className="space-y-4">
              {/* CSV upload */}
              <div>
                <p className="text-xs text-slate-500 mb-1.5">CSV file</p>
                <input ref={fileInputRef} type="file" accept=".csv,text/csv"
                  className="hidden" onChange={handleFile} />
                <button
                  type="button"
                  onClick={() => { setError(''); fileInputRef.current?.click() }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium
                    bg-slate-800 border border-slate-700 text-slate-300
                    hover:bg-slate-700 hover:border-slate-500 hover:text-white transition-all duration-150"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Choose CSV file…
                </button>
              </div>

              {/* Paste from Excel */}
              <div>
                <p className="text-xs text-slate-500 mb-1.5">Paste from Excel</p>
                <textarea
                  value={pasteText}
                  onChange={(e) => { setPasteText(e.target.value); setError('') }}
                  placeholder={'Year\tCallType\tCallLogCount\n2023\tInbound\t142\n2023\tOutbound\t98'}
                  rows={4}
                  spellCheck={false}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5
                    text-xs text-slate-200 placeholder-slate-600 font-mono resize-none
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
                    transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={handleDetect}
                  disabled={!pasteText.trim()}
                  className="mt-1.5 w-full py-1.5 rounded-md text-xs font-semibold
                    bg-slate-700 border border-slate-600 text-slate-200
                    hover:bg-slate-600 hover:text-white
                    disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                >
                  Detect Columns
                </button>
              </div>
            </div>
          )}

          {/* ── Stage: mapped — column mapper ── */}
          {stage === 'mapped' && (
            <div className="space-y-3">
              {/* Summary */}
              <p className="text-xs text-slate-500">
                <span className="text-slate-300 font-medium">{headers.length}</span> columns ·{' '}
                <span className="text-slate-300 font-medium">{rawRows.length}</span> rows detected
              </p>

              {/* Label column */}
              <div>
                <p className="text-xs text-slate-500 mb-1">Label column</p>
                <select value={labelCol}
                  onChange={(e) => setLabelCol(Number(e.target.value))}
                  className={colSelect}
                >
                  {headers.map((h, i) => (
                    <option key={i} value={i}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Value column */}
              <div>
                <p className="text-xs text-slate-500 mb-1">Value column</p>
                <select value={valueCol}
                  onChange={(e) => setValueCol(Number(e.target.value))}
                  className={colSelect}
                >
                  {headers.map((h, i) => (
                    <option key={i} value={i}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Flip + Build */}
              <div className="flex gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleFlip}
                  title="Swap label and value columns"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                    bg-slate-800 border border-slate-700 text-slate-300
                    hover:bg-slate-700 hover:text-white transition-all duration-150 shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                  Flip
                </button>
                <button
                  type="button"
                  onClick={handleBuild}
                  className="flex-1 py-1.5 rounded-md text-xs font-semibold
                    bg-blue-600 hover:bg-blue-500 text-white
                    transition-all duration-150"
                >
                  Build Chart
                </button>
              </div>

              {/* Start over */}
              <button
                type="button"
                onClick={reset}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-150"
              >
                ← Start over
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
