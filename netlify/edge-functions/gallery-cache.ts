import type { Context } from "https://edge.netlify.com"

export default async function handler(request: Request, context: Context) {
  const response = await context.next()
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', 'public, max-age=60, s-maxage=600')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
}
