type TraceCategory = 'api:request' | 'api:response' | 'route:navigate'

export interface TraceLog {
  timestamp: string
  category: TraceCategory
  message: string
  metadata?: Record<string, unknown>
}

type TraceSink = (entry: TraceLog) => void

const sinks: TraceSink[] = []

const defaultSink: TraceSink = (entry) => {
  const { timestamp, category, message, metadata } = entry
  const meta = metadata ? JSON.stringify(metadata) : ''
  // Using console.debug so these traces can be easily filtered in DevTools
  console.debug(`[trace] ${timestamp} ${category} ${message}${meta ? ` ${meta}` : ''}`)
}

sinks.push(defaultSink)

function emitTrace(entry: TraceLog) {
  for (const sink of sinks) {
    sink(entry)
  }
}

function createTrace(category: TraceCategory, message: string, metadata?: Record<string, unknown>) {
  emitTrace({
    timestamp: new Date().toISOString(),
    category,
    message,
    metadata,
  })
}

export function traceApiRequest(
  method: string,
  url: string,
  metadata: Record<string, unknown> = {}
) {
  createTrace('api:request', `${method.toUpperCase()} ${url}`, metadata)
}

export function traceApiResponse(
  method: string,
  url: string,
  status: number,
  metadata: Record<string, unknown> = {}
) {
  createTrace('api:response', `${method.toUpperCase()} ${url} -> ${status}`, metadata)
}

export function traceRouteChange(
  from: string,
  to: string,
  metadata: Record<string, unknown> = {}
) {
  createTrace('route:navigate', `${from} -> ${to}`, metadata)
}

export function registerTraceSink(sink: TraceSink) {
  if (!sinks.includes(sink)) {
    sinks.push(sink)
  }
}

export function unregisterTraceSink(sink: TraceSink) {
  const index = sinks.indexOf(sink)
  if (index !== -1) {
    sinks.splice(index, 1)
  }
}
