// Polyfill localStorage for Node.js 22+ / 25+ JSDOM Vitest environments
const store: Record<string, string> = {}
const mockLocalStorage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = String(value) },
  removeItem: (key: string) => { delete store[key] },
  clear: () => { for (const k in store) delete store[k] },
  key: (i: number) => Object.keys(store)[i] ?? null,
  get length() { return Object.keys(store).length }
}

try {
  Object.defineProperty(globalThis, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
    configurable: true
  })
} catch {
  // Ignore if already configured
}

if (typeof window !== 'undefined') {
  try {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true
    })
  } catch {
    // Ignore
  }
}

export {}
