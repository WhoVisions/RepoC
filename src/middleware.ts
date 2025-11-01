export const ROLES = {
  PUBLIC: 'public',
  CLIENT: 'client',
  ADMIN: 'admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

const ROLE_PRIORITY: Record<Role, number> = {
  [ROLES.PUBLIC]: 0,
  [ROLES.CLIENT]: 1,
  [ROLES.ADMIN]: 2,
}

export interface UserLike {
  role?: Role | null
}

export interface RequestLike {
  user?: UserLike | null
}

export interface ResponseLike {
  status?: (code: number) => ResponseLike
  json?: (body: unknown) => ResponseLike
}

export type NextFunction = (err?: unknown) => void

export class ForbiddenError extends Error {
  readonly statusCode = 403

  constructor(message = 'Forbidden') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export interface AuthorizeOptions {
  onForbidden?: (
    error: ForbiddenError,
    req: RequestLike,
    res: ResponseLike,
    next: NextFunction
  ) => void
  deriveRole?: (req: RequestLike) => Role | null | undefined
}

const defaultForbiddenHandler: Required<AuthorizeOptions>['onForbidden'] = (
  error,
  _req,
  res,
  next
) => {
  const statusFn = res?.status
  const jsonFn = res?.json

  if (typeof statusFn === 'function') {
    const response = statusFn(error.statusCode)
    if (typeof response?.json === 'function') {
      response.json({ message: error.message })
      return
    }
  }

  if (typeof jsonFn === 'function') {
    jsonFn({ message: error.message })
    return
  }

  next(error)
}

export const hasSufficientRole = (
  requiredRoles: ReadonlyArray<Role>,
  currentRole: Role
): boolean => {
  const currentPriority = ROLE_PRIORITY[currentRole]
  return requiredRoles.some((role) => currentPriority >= ROLE_PRIORITY[role])
}

export const authorize = (
  required: Role | Role[],
  options: AuthorizeOptions = {}
) => {
  const requiredRoles = Array.isArray(required) ? required : [required]
  const uniqueRequiredRoles = [...new Set(requiredRoles)]

  if (uniqueRequiredRoles.length === 0) {
    throw new Error('authorize requires at least one role')
  }

  const onForbidden = options.onForbidden ?? defaultForbiddenHandler
  const deriveRole = options.deriveRole ?? ((req: RequestLike) => req.user?.role ?? ROLES.PUBLIC)

  return (req: RequestLike, res: ResponseLike = {}, next: NextFunction) => {
    const role = deriveRole(req) ?? ROLES.PUBLIC

    if (!role || !(role in ROLE_PRIORITY)) {
      const error = new ForbiddenError('Unknown role')
      onForbidden(error, req, res, next)
      return
    }

    if (hasSufficientRole(uniqueRequiredRoles, role)) {
      next()
      return
    }

    const error = new ForbiddenError()
    onForbidden(error, req, res, next)
  }
}

export const allowPublic = authorize(ROLES.PUBLIC)
export const allowClient = authorize([ROLES.CLIENT, ROLES.ADMIN])
export const allowAdmin = authorize(ROLES.ADMIN)
