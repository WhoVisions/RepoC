import type { Handler } from '@netlify/functions'

const reportCsv = `date,totalBookings,revenue
2025-10-28,12,1800
2025-10-29,9,1350
2025-10-30,15,2250`

export const handler: Handler = async (event) => {
  if ((event.queryStringParameters?.format ?? 'json') === 'csv') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="booking-report.csv"'
      },
      body: reportCsv
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      summary: {
        totalBookings: 36,
        revenue: 5400,
        topPackage: 'Sunset Portraits'
      }
    })
  }
}
