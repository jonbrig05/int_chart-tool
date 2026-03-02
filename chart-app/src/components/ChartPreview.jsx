import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Line, Pie, Doughnut, Radar, Scatter } from 'react-chartjs-2'
import { useMemo } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
)

const CHART_LABEL = {
  bar: 'Bar Chart',
  line: 'Line Chart',
  pie: 'Pie Chart',
  doughnut: 'Doughnut Chart',
  radar: 'Radar Chart',
  scatter: 'Scatter Plot',
}

// Returns 0–1 perceived luminance from a #rrggbb hex string.
function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

function isLight(hex) {
  return /^#[0-9a-fA-F]{6}$/.test(hex) && luminance(hex) > 0.5
}

// Color tokens that flip based on background brightness.
function themeColors(canvasBg) {
  const light = isLight(canvasBg)
  return {
    legendText:      light ? '#1e293b' : '#94a3b8',
    tickText:        light ? '#475569' : '#64748b',
    grid:            light ? 'rgba(0,0,0,0.08)'          : 'rgba(148,163,184,0.08)',
    border:          light ? 'rgba(0,0,0,0.15)'          : 'rgba(148,163,184,0.15)',
    radarGrid:       light ? 'rgba(0,0,0,0.10)'          : 'rgba(148,163,184,0.15)',
    radarAngle:      light ? 'rgba(0,0,0,0.15)'          : 'rgba(148,163,184,0.2)',
    radarPointLabel: light ? '#334155'                   : '#94a3b8',
    radarTick:       light ? '#475569'                   : '#64748b',
    titleText:       light ? '#1e293b'                   : '#e2e8f0',
  }
}

function buildDataset(chartType, chartData) {
  const { labels, values, colors } = chartData

  if (chartType === 'scatter') {
    const points = labels.map((x, i) => ({ x: Number(x) || i, y: values[i] }))
    return {
      labels: [],
      datasets: [
        {
          label: 'Data',
          data: points,
          backgroundColor: colors.backgrounds,
          borderColor: colors.borders,
          pointRadius: 6,
          pointHoverRadius: 9,
        },
      ],
    }
  }

  const isMultiColor = ['pie', 'doughnut', 'bar'].includes(chartType)
  return {
    labels,
    datasets: [
      {
        label: 'Value',
        data: values,
        backgroundColor: isMultiColor ? colors.backgrounds : colors.backgrounds[0],
        borderColor: isMultiColor ? colors.borders : colors.borders[0],
        borderWidth: chartType === 'line' ? 2.5 : 1.5,
        fill: chartType === 'line' ? 'origin' : undefined,
        tension: chartType === 'line' ? 0.4 : undefined,
        pointBackgroundColor: chartType === 'line' ? colors.borders[0] : undefined,
        pointRadius: chartType === 'line' ? 4 : undefined,
        pointHoverRadius: chartType === 'line' ? 7 : undefined,
      },
    ],
  }
}

function buildOptions(chartType, canvasBg) {
  const t = themeColors(canvasBg)

  const base = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 4,
      },
    },
  }

  if (['pie', 'doughnut', 'radar'].includes(chartType)) {
    if (chartType === 'radar') {
      base.scales = {
        r: {
          grid:        { color: t.radarGrid },
          angleLines:  { color: t.radarAngle },
          pointLabels: { color: t.radarPointLabel, font: { size: 11 } },
          ticks:       { color: t.radarTick, backdropColor: 'transparent', font: { size: 10 } },
        },
      }
    }
    return base
  }

  base.scales = {
    x: {
      grid:   { color: t.grid, drawBorder: false },
      ticks:  { color: t.tickText, font: { size: 11, family: 'Inter, system-ui, sans-serif' }, maxRotation: 45, maxTicksLimit: 30 },
      border: { color: t.border },
    },
    y: {
      grid:   { color: t.grid, drawBorder: false },
      ticks:  { color: t.tickText, font: { size: 11, family: 'Inter, system-ui, sans-serif' } },
      border: { color: t.border },
    },
  }

  return base
}

const CHART_COMPONENTS = { bar: Bar, line: Line, pie: Pie, doughnut: Doughnut, radar: Radar, scatter: Scatter }

export default function ChartPreview({ chartType, chartData, chartRef, canvasBg, chartTitle, chartDesc, titleFont, titleSize }) {
  const ChartComponent = CHART_COMPONENTS[chartType]

  const data    = useMemo(() => buildDataset(chartType, chartData),  [chartType, chartData])
  const options = useMemo(() => buildOptions(chartType, canvasBg),   [chartType, canvasBg])
  const colors  = useMemo(() => themeColors(canvasBg),                               [canvasBg])

  const isEmpty = chartData.labels.length === 0

  return (
    <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
      {/* Preview header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-slate-200 font-semibold">{CHART_LABEL[chartType]}</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            {isEmpty
              ? 'Add valid data points to preview'
              : `Showing ${chartData.labels.length} data point${chartData.labels.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {!isEmpty && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-slate-500">Live</span>
          </div>
        )}
      </div>

      {/* Description — sits in the dark space above the chart canvas */}
      {!isEmpty && chartDesc.trim() && (
        <div className="px-6 pt-4 shrink-0">
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap max-w-2xl">
            {chartDesc}
          </p>
        </div>
      )}

      {/* Chart area */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div
            className="w-full h-full max-h-[600px] rounded-2xl border border-slate-800 p-6 flex flex-col"
            style={{ backgroundColor: canvasBg }}
          >
            {chartTitle.trim() && (
              <p
                className="shrink-0 text-center leading-tight mb-4"
                style={{ fontFamily: titleFont, fontSize: `${titleSize}px`, color: colors.titleText }}
              >
                {chartTitle}
              </p>
            )}
            <div className="flex-1 min-h-0">
              <ChartComponent ref={chartRef} data={data} options={options} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 text-center max-w-xs">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
        <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      </div>
      <div>
        <p className="text-slate-400 font-medium">No valid data yet</p>
        <p className="text-slate-600 text-sm mt-1">
          Add labels and numeric values in the left panel to render your chart.
        </p>
      </div>
    </div>
  )
}
