import { useState, useRef, useCallback } from 'react'
import ControlPanel from './components/ControlPanel'
import ChartPreview from './components/ChartPreview'
import { hexColorForIndex, hexToRgba } from './utils/colors'

const INITIAL_ROWS = [
  { id: 1, label: 'January',  value: '42', color: '#005CB9' },
  { id: 2, label: 'February', value: '78', color: '#091F40' },
  { id: 3, label: 'March',    value: '55', color: '#DB0032' },
  { id: 4, label: 'April',    value: '91', color: '#0054A4' },
  { id: 5, label: 'May',      value: '63', color: '#EE3124' },
]

let nextId = 6

export default function App() {
  const [chartType, setChartType] = useState('bar')
  const [rows, setRows] = useState(INITIAL_ROWS)
  const [errors, setErrors] = useState({})
  const [canvasBg, setCanvasBg] = useState('#FFFFFF')
  const [chartTitle, setChartTitle] = useState('')
  const [chartDesc, setChartDesc] = useState('')
  const [titleFont, setTitleFont] = useState('Inter')
  const [titleSize, setTitleSize] = useState(24)
  const chartRef = useRef(null)

  const validRows = rows.filter(
    (r) => r.label.trim() !== '' && r.value !== '' && !isNaN(Number(r.value))
  )

  const chartData = {
    labels: validRows.map((r) => r.label.trim()),
    values: validRows.map((r) => Number(r.value)),
    colors: {
      backgrounds: validRows.map((r) => hexToRgba(r.color, 0.75)),
      borders: validRows.map((r) => hexToRgba(r.color, 1)),
    },
  }

  const updateRow = useCallback((id, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
    if (field === 'value') {
      setErrors((prev) => {
        const next = { ...prev }
        if (value === '' || isNaN(Number(value))) {
          next[id] = 'Enter a valid number'
        } else {
          delete next[id]
        }
        return next
      })
    }
  }, [])

  const importRows = useCallback((parsed) => {
    setRows(parsed.map((item, i) => ({
      id: nextId++,
      label: item.label,
      value: item.value,
      color: hexColorForIndex(i),
    })))
    setErrors({})
  }, [])

  const addRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      { id: nextId++, label: '', value: '', color: hexColorForIndex(prev.length) },
    ])
  }, [])

  const removeRow = useCallback((id) => {
    setRows((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((r) => r.id !== id)
    })
    setErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const exportPng = useCallback(() => {
    if (!chartRef.current) return
    const canvas = chartRef.current.canvas
    const link = document.createElement('a')
    link.download = `chart-${chartType}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [chartType])

  const downloadCsv = useCallback(() => {
    if (validRows.length === 0) return
    const lines = ['Label,Value', ...validRows.map((r) => `"${r.label.replace(/"/g, '""')}",${r.value}`)]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.download = `chart-data-${Date.now()}.csv`
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }, [validRows])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700/60 px-6 py-4 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <div>
          <h1 className="text-white font-semibold text-lg leading-none">ChartCraft</h1>
          <p className="text-slate-400 text-xs mt-0.5">Interactive chart builder</p>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        <ControlPanel
          chartType={chartType}
          setChartType={setChartType}
          rows={rows}
          errors={errors}
          updateRow={updateRow}
          addRow={addRow}
          removeRow={removeRow}
          importRows={importRows}
          exportPng={exportPng}
          downloadCsv={downloadCsv}
          validCount={validRows.length}
          canvasBg={canvasBg}
          setCanvasBg={setCanvasBg}
          chartTitle={chartTitle}
          setChartTitle={setChartTitle}
          chartDesc={chartDesc}
          setChartDesc={setChartDesc}
          titleFont={titleFont}
          setTitleFont={setTitleFont}
          titleSize={titleSize}
          setTitleSize={setTitleSize}
        />
        <ChartPreview
          chartType={chartType}
          chartData={chartData}
          chartRef={chartRef}
          canvasBg={canvasBg}
          chartTitle={chartTitle}
          chartDesc={chartDesc}
          titleFont={titleFont}
          titleSize={titleSize}
        />
      </div>
    </div>
  )
}
