import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearAllOverrides,
  getExperimentAssignment,
  getFeatureFlag,
  hydrateOverridesFromSearch,
  isFeatureEnabled,
  registerExperiment,
  registerFeatureFlag,
  registerFeatureFlags,
  resetExperimentAssignments,
  resetFeatureFlags,
  setExperimentOverride,
  setFeatureFlag,
  setFeatureFlagOverride,
} from './experiments'

const uniqueName = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 11)}`

beforeEach(() => {
  resetFeatureFlags()
  resetExperimentAssignments()
  clearAllOverrides()
})

describe('feature flags', () => {
  it('returns defaults and prioritises overrides', () => {
    const flagName = uniqueName('flag-default')

    registerFeatureFlag(flagName, {
      defaultValue: false,
      description: 'Default test flag',
    })

    expect(getFeatureFlag(flagName)).toBe(false)

    setFeatureFlag(flagName, 'on')
    expect(getFeatureFlag(flagName)).toBe('on')

    setFeatureFlagOverride(flagName, true)
    expect(getFeatureFlag(flagName)).toBe(true)

    resetFeatureFlags()
    expect(getFeatureFlag(flagName)).toBe(false)
  })

  it('coerces string values when checking enabled state', () => {
    const flagName = uniqueName('flag-enabled')

    registerFeatureFlag(flagName, { defaultValue: null })
    expect(isFeatureEnabled(flagName, false)).toBe(false)

    setFeatureFlag(flagName, 'enabled')
    expect(isFeatureEnabled(flagName, false)).toBe(true)
  })
})

describe('experiments', () => {
  it('persists assignments per subject and supports overrides', () => {
    const experimentKey = uniqueName('experiment')

    registerExperiment({
      key: experimentKey,
      fallbackVariant: 'control',
      variants: [
        { name: 'control', weight: 1 },
        { name: 'treatment', weight: 1 },
      ],
    })

    resetExperimentAssignments(experimentKey)

    const first = getExperimentAssignment(experimentKey, { subjectId: 'user-a' })
    const second = getExperimentAssignment(experimentKey, { subjectId: 'user-a' })

    expect(second.variant.name).toBe(first.variant.name)
    expect(second.reason).toBe(first.reason)

    setExperimentOverride(experimentKey, 'treatment')
    const override = getExperimentAssignment(experimentKey, { subjectId: 'user-a' })
    expect(override.variant.name).toBe('treatment')
    expect(override.reason).toBe('override')

    setExperimentOverride(experimentKey, null)
    resetExperimentAssignments(experimentKey)
    const reassigned = getExperimentAssignment(experimentKey, { subjectId: 'user-a' })
    expect(reassigned.variant.name).toBe(first.variant.name)
  })

  it('falls back when a linked flag is disabled', () => {
    const flagName = uniqueName('flag-linked')
    const experimentKey = uniqueName('experiment-linked')

    registerFeatureFlag(flagName, { defaultValue: false })
    registerExperiment({
      key: experimentKey,
      fallbackVariant: 'control',
      linkedFlag: flagName,
      variants: [
        { name: 'control', weight: 1 },
        { name: 'enabled', weight: 1 },
      ],
    })

    resetExperimentAssignments(experimentKey)

    const initial = getExperimentAssignment(experimentKey, { subjectId: 'user-b' })
    expect(initial.isFallback).toBe(true)
    expect(initial.reason).toBe('flag_disabled')
    expect(initial.variant.name).toBe('control')

    setFeatureFlag(flagName, true)
    resetExperimentAssignments(experimentKey)
    const enabled = getExperimentAssignment(experimentKey, { subjectId: 'user-b' })
    expect(enabled.reason === 'flag_disabled').toBe(false)
  })
})

describe('hydration', () => {
  it('hydrates feature and experiment overrides from query params', () => {
    const flagName = uniqueName('flag-hydrate')
    const experimentKey = uniqueName('experiment-hydrate')

    registerFeatureFlags({
      [flagName]: {
        defaultValue: false,
        description: 'Hydration feature flag',
      },
    })

    registerExperiment({
      key: experimentKey,
      fallbackVariant: 'control',
      variants: [
        { name: 'control', weight: 1 },
        { name: 'curious', weight: 1 },
      ],
    })

    hydrateOverridesFromSearch(`?ff_${flagName}=on&exp_${experimentKey}=curious`)

    expect(getFeatureFlag(flagName)).toBe(true)

    const assignment = getExperimentAssignment(experimentKey, { subjectId: 'hydrated-user' })
    expect(assignment.variant.name).toBe('curious')
    expect(assignment.reason).toBe('override')
  })
})
