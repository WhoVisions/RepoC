import type { Handler } from '@netlify/functions'

const ADMIN_TOKEN = 'demo-admin-token'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'POST') {
    let credentials: { username?: string; password?: string }

    try {
      credentials = JSON.parse(event.body ?? '{}')
    } catch (error) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Invalid JSON payload' })
      }
    }

    const { username, password } = credentials

    if (username === 'admin@example.com' && password === 'password123') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: ADMIN_TOKEN, expiresIn: 60 * 60 })
      }
    }

    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Invalid credentials' })
    }
  }

  return {
    statusCode: 405,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Method Not Allowed' })
  }
}
