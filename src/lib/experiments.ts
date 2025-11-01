import { useSyncExternalStore } from 'react'

export type FeatureFlagValue = boolean | number | string | null

export interface FeatureFlagDefinition {
  defaultValue: FeatureFlagValue
  description?: string
}

type FeatureFlagRegistration =
  | FeatureFlagValue
  | (FeatureFlagDefinition & { value?: FeatureFlagValue })

export interface FeatureFlagSnapshot {
  name: string
  value: FeatureFlagValue
  source: 'override' | 'runtime' | 'default' | 'fallback'
  definition?: FeatureFlagDefinition
}

export interface ExperimentVariant<TPayload = unknown> {
  name: string
  weight?: number
  payload?: TPayload
  description?: string
}

export interface ExperimentDefinition<TPayload = unknown> {
  key: string
  variants: ExperimentVariant<TPayload>[]
  fallbackVariant?: string
  linkedFlag?: string
}

export interface ExperimentOptions {
  subjectId?: string
  fallbackVariant?: string
}

export type ExperimentAssignmentReason =
  | 'assignment'
  | 'fallback'
  | 'override'
  | 'flag_disabled'
  | 'unregistered'

export interface ExperimentAssignment<TPayload = unknown> {
  key: string
  variant: ExperimentVariant<TPayload>
  isFallback: boolean
  reason: ExperimentAssignmentReason
}

export interface OverrideHydrationOptions {
  featurePrefix?: string
  experimentPrefix?: string
}

type Listener = () => void

const DEFAULT_FEATURE_FALLBACK: FeatureFlagValue = null
const DEFAULT_EXPERIMENT_SUBJECT = '__global__'
const TRUTHY_STRINGS = new Set(['true', '1', 'on', 'enabled', 'yes'])

const featureDefinitions = new Map<string, FeatureFlagDefinition>()
const runtimeFeatureValues = new Map<string, FeatureFlagValue>()
const featureOverrides = new Map<string, FeatureFlagValue>()

const experimentDefinitions = new Map<string, NormalizedExperimentDefinition<unknown>>()
const experimentOverrides = new Map<string, string>()
const experimentAssignments = new Map<string, Map<string, string>>()

const listeners = new Set<Listener>()

interface NormalizedExperimentDefinition<TPayload> {
  key: string
  variants: ReadonlyArray<ExperimentVariant<TPayload>>
  variantMap: Map<string, ExperimentVariant<TPayload>>
  weights: number[]
  totalWeight: number
  fallbackVariant: string
  linkedFlag?: string
}

function isRegistrationObject(value: FeatureFlagRegistration): value is FeatureFlagDefinition & {
  value?: FeatureFlagValue
} {
  return typeof value === 'object' && value !== null && 'defaultValue' in value
}

function notifyListeners() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function hashToUnitInterval(input: string): number {
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  const uint32 = hash >>> 0
  return uint32 / 0xffffffff
}

function normalizeExperiment<TPayload>(
  definition: ExperimentDefinition<TPayload>
): NormalizedExperimentDefinition<TPayload> {
  if (!definition.key) {
    throw new Error('[experiments] Experiment definitions require a `key`.')
  }

  if (!definition.variants || definition.variants.length === 0) {
    throw new Error(
      `[experiments] Experiment "${definition.key}" must declare at least one variant.`
    )
  }

  const variantMap = new Map<string, ExperimentVariant<TPayload>>()
  const weights: number[] = []

  for (const variant of definition.variants) {
    if (variantMap.has(variant.name)) {
      throw new Error(
        `[experiments] Experiment "${definition.key}" has duplicate variant "${variant.name}".`
      )
    }

    variantMap.set(variant.name, Object.freeze({ ...variant }))

    const weight = variant.weight ?? 1
    if (weight < 0) {
      throw new Error(
        `[experiments] Variant "${variant.name}" in "${definition.key}" cannot have a negative weight.`
      )
    }
    weights.push(weight)
  }

  const fallbackVariant = definition.fallbackVariant ?? definition.variants[0]?.name

  if (!variantMap.has(fallbackVariant)) {
    throw new Error(
      `[experiments] Experiment "${definition.key}" fallback variant "${fallbackVariant}" is not defined.`
    )
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

  return {
    key: definition.key,
    variants: definition.variants.map((variant) =>
      Object.freeze({ ...variant })
    ),
    variantMap,
    weights,
    totalWeight,
    fallbackVariant,
    linkedFlag: definition.linkedFlag,
  }
}

function resolveFallbackVariant<TPayload>(
  normalized: NormalizedExperimentDefinition<TPayload>,
  requestedFallback?: string
): ExperimentVariant<TPayload> {
  if (requestedFallback && normalized.variantMap.has(requestedFallback)) {
    return normalized.variantMap.get(requestedFallback) as ExperimentVariant<TPayload>
  }

  return normalized.variantMap.get(normalized.fallbackVariant) as ExperimentVariant<TPayload>
}

function pickVariantName<TPayload>(
  normalized: NormalizedExperimentDefinition<TPayload>,
  seed: number
): string {
  if (normalized.totalWeight <= 0) {
    return normalized.fallbackVariant
  }

  const target = seed * normalized.totalWeight
  let cumulative = 0

  for (let index = 0; index < normalized.variants.length; index += 1) {
    cumulative += normalized.weights[index]
    if (target < cumulative) {
      return normalized.variants[index].name
    }
  }

  return normalized.fallbackVariant
}

function getAssignmentBucket(key: string) {
  let bucket = experimentAssignments.get(key)
  if (!bucket) {
    bucket = new Map<string, string>()
    experimentAssignments.set(key, bucket)
  }
  return bucket
}

function coerceStringToValue(rawValue: string): FeatureFlagValue {
  const normalized = rawValue.trim()
  if (normalized === '') {
    return null
  }

  const lower = normalized.toLowerCase()
  if (TRUTHY_STRINGS.has(lower)) {
    return true
  }

  if (lower === 'false' || lower === '0' || lower === 'off' || lower === 'no' || lower === 'disabled') {
    return false
  }

  const asNumber = Number(normalized)
  if (!Number.isNaN(asNumber)) {
    return asNumber
  }

  return normalized
}

export function registerFeatureFlag(
  name: string,
  definition: FeatureFlagDefinition
): void {
  featureDefinitions.set(name, { ...definition })
  notifyListeners()
}

export function registerFeatureFlags(
  definitions: Record<string, FeatureFlagRegistration>
): void {
  for (const [name, registration] of Object.entries(definitions)) {
    if (isRegistrationObject(registration)) {
      registerFeatureFlag(name, {
        defaultValue: registration.defaultValue,
        description: registration.description,
      })

      if (registration.value !== undefined) {
        runtimeFeatureValues.set(name, registration.value)
      }
    } else {
      registerFeatureFlag(name, { defaultValue: registration })
    }
  }

  notifyListeners()
}

export function setFeatureFlag(
  name: string,
  value: FeatureFlagValue
): void {
  runtimeFeatureValues.set(name, value)
  notifyListeners()
}

export function setFeatureFlagOverride(
  name: string,
  value?: FeatureFlagValue | null
): void {
  if (value === undefined || value === null) {
    featureOverrides.delete(name)
  } else {
    featureOverrides.set(name, value)
  }
  notifyListeners()
}

export function resetFeatureFlags(): void {
  runtimeFeatureValues.clear()
  featureOverrides.clear()
  notifyListeners()
}

export function getFeatureFlag(
  name: string,
  fallback?: FeatureFlagValue
): FeatureFlagValue {
  if (featureOverrides.has(name)) {
    return featureOverrides.get(name) as FeatureFlagValue
  }

  if (runtimeFeatureValues.has(name)) {
    return runtimeFeatureValues.get(name) as FeatureFlagValue
  }

  if (featureDefinitions.has(name)) {
    const definition = featureDefinitions.get(name) as FeatureFlagDefinition
    if (definition.defaultValue !== undefined) {
      return definition.defaultValue
    }
  }

  return fallback ?? DEFAULT_FEATURE_FALLBACK
}

export function isFeatureEnabled(name: string, fallback = false): boolean {
  const value = getFeatureFlag(name, fallback)

  if (value === null) {
    return fallback
  }

  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  if (typeof value === 'string') {
    return TRUTHY_STRINGS.has(value.toLowerCase())
  }

  return fallback
}

export function getFeatureFlagSnapshot(name: string): FeatureFlagSnapshot {
  if (featureOverrides.has(name)) {
    return {
      name,
      value: featureOverrides.get(name) as FeatureFlagValue,
      source: 'override',
      definition: featureDefinitions.get(name),
    }
  }

  if (runtimeFeatureValues.has(name)) {
    return {
      name,
      value: runtimeFeatureValues.get(name) as FeatureFlagValue,
      source: 'runtime',
      definition: featureDefinitions.get(name),
    }
  }

  if (featureDefinitions.has(name)) {
    return {
      name,
      value: (featureDefinitions.get(name) as FeatureFlagDefinition).defaultValue,
      source: 'default',
      definition: featureDefinitions.get(name) as FeatureFlagDefinition,
    }
  }

  return {
    name,
    value: DEFAULT_FEATURE_FALLBACK,
    source: 'fallback',
    definition: undefined,
  }
}

export function listFeatureFlags(): FeatureFlagSnapshot[] {
  const names = new Set<string>([
    ...featureDefinitions.keys(),
    ...runtimeFeatureValues.keys(),
    ...featureOverrides.keys(),
  ])

  return Array.from(names).map((name) => getFeatureFlagSnapshot(name))
}

export function getExperimentAssignment<TPayload = unknown>(
  key: string,
  options?: ExperimentOptions
): ExperimentAssignment<TPayload> {
  const normalized = experimentDefinitions.get(key) as
    | NormalizedExperimentDefinition<TPayload>
    | undefined

  if (!normalized) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[experiments] Experiment "${key}" is not registered; returning fallback variant.`
      )
    }

    const fallbackName = options?.fallbackVariant ?? 'control'
    return {
      key,
      variant: { name: fallbackName } as ExperimentVariant<TPayload>,
      isFallback: true,
      reason: 'unregistered',
    }
  }

  const fallbackVariant = resolveFallbackVariant(normalized, options?.fallbackVariant)

  if (normalized.linkedFlag && !isFeatureEnabled(normalized.linkedFlag)) {
    return {
      key,
      variant: fallbackVariant,
      isFallback: true,
      reason: 'flag_disabled',
    }
  }

  const overrideName = experimentOverrides.get(key)
  if (overrideName && normalized.variantMap.has(overrideName)) {
    const variant = normalized.variantMap.get(overrideName) as ExperimentVariant<TPayload>
    return {
      key,
      variant,
      isFallback: false,
      reason: 'override',
    }
  }

  const subjectKey = options?.subjectId ?? DEFAULT_EXPERIMENT_SUBJECT
  const bucket = getAssignmentBucket(key)
  const existing = bucket.get(subjectKey)

  if (existing && normalized.variantMap.has(existing)) {
    const variant = normalized.variantMap.get(existing) as ExperimentVariant<TPayload>
    return {
      key,
      variant,
      isFallback: existing === normalized.fallbackVariant,
      reason: existing === normalized.fallbackVariant ? 'fallback' : 'assignment',
    }
  }

  const seed = options?.subjectId
    ? hashToUnitInterval(`${key}:${options.subjectId}`)
    : Math.random()

  const chosenName = pickVariantName(normalized, seed)
  bucket.set(subjectKey, chosenName)

  const chosenVariant = normalized.variantMap.get(chosenName) ?? fallbackVariant

  return {
    key,
    variant: chosenVariant,
    isFallback: chosenName === normalized.fallbackVariant,
    reason: chosenName === normalized.fallbackVariant ? 'fallback' : 'assignment',
  }
}

export function getExperimentVariant<TPayload = unknown>(
  key: string,
  options?: ExperimentOptions
): ExperimentVariant<TPayload> {
  return getExperimentAssignment<TPayload>(key, options).variant
}

export function useFeatureFlag(
  name: string,
  fallback?: FeatureFlagValue
): FeatureFlagValue {
  return useSyncExternalStore(
    subscribe,
    () => getFeatureFlag(name, fallback),
    () => getFeatureFlag(name, fallback)
  )
}

export function useFeatureEnabled(name: string, fallback = false): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isFeatureEnabled(name, fallback),
    () => isFeatureEnabled(name, fallback)
  )
}

export function useExperimentAssignment<TPayload = unknown>(
  key: string,
  options?: ExperimentOptions
): ExperimentAssignment<TPayload> {
  return useSyncExternalStore(
    subscribe,
    () => getExperimentAssignment<TPayload>(key, options),
    () => getExperimentAssignment<TPayload>(key, options)
  )
}

export function useExperimentVariant<TPayload = unknown>(
  key: string,
  options?: ExperimentOptions
): ExperimentVariant<TPayload> {
  return useExperimentAssignment<TPayload>(key, options).variant
}

export function registerExperiment<TPayload = unknown>(
  definition: ExperimentDefinition<TPayload>
): void {
  const normalized = normalizeExperiment(definition)
  experimentDefinitions.set(definition.key, normalized)
  experimentAssignments.delete(definition.key)
  notifyListeners()
}

export function registerExperiments(
  definitions: Array<ExperimentDefinition<unknown>>
): void {
  for (const definition of definitions) {
    registerExperiment(definition)
  }
  notifyListeners()
}

export function setExperimentOverride(
  key: string,
  variantName?: string | null
): void {
  if (!variantName) {
    experimentOverrides.delete(key)
  } else {
    experimentOverrides.set(key, variantName)
  }
  notifyListeners()
}

export function resetExperimentAssignments(key?: string): void {
  if (key) {
    experimentAssignments.delete(key)
  } else {
    experimentAssignments.clear()
  }
  notifyListeners()
}

export function hydrateOverridesFromSearch(
  source?: string | URLSearchParams,
  options?: OverrideHydrationOptions
): void {
  const params =
    source instanceof URLSearchParams
      ? source
      : new URLSearchParams(
          source ??
            (typeof window !== 'undefined' ? window.location.search : '')
        )

  const featurePrefix = options?.featurePrefix ?? 'ff_'
  const experimentPrefix = options?.experimentPrefix ?? 'exp_'

  params.forEach((value, key) => {
    if (featurePrefix && key.startsWith(featurePrefix)) {
      const flagName = key.slice(featurePrefix.length)
      setFeatureFlagOverride(flagName, coerceStringToValue(value))
    }

    if (experimentPrefix && key.startsWith(experimentPrefix)) {
      const experimentKey = key.slice(experimentPrefix.length)
      setExperimentOverride(experimentKey, value.trim() || undefined)
    }
  })
}

export function listExperimentAssignments(): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {}
  for (const [experimentKey, assignments] of experimentAssignments.entries()) {
    result[experimentKey] = Object.fromEntries(assignments.entries())
  }
  return result
}

export function getRegisteredExperiments(): string[] {
  return Array.from(experimentDefinitions.keys())
}

export function clearAllOverrides(): void {
  featureOverrides.clear()
  experimentOverrides.clear()
  notifyListeners()
}

