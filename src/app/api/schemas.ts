/**
 * API schemas and utilities for booking creation and gallery retrieval routes.
 * These are framework-agnostic helpers that provide request/response typing
 * alongside minimal runtime validation that can be shared across route
 * handlers, services, and tests.
 */

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

export interface ValidationError {
  field: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Booking API

export interface BookingRequest {
  guestName: string;
  email: string;
  phone?: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  specialRequests?: string;
}

export interface BookingResponseSuccess {
  success: true;
  bookingId: string;
  message?: string;
}

export interface BookingResponseError {
  success: false;
  errors: ValidationError[];
}

export type BookingResponse = BookingResponseSuccess | BookingResponseError;

export function validateBookingRequest(input: unknown): ValidationResult<BookingRequest> {
  const errors: ValidationError[] = [];

  if (!isRecord(input)) {
    return failure("root", "Expected an object payload");
  }

  const {
    guestName,
    email,
    phone,
    checkInDate,
    checkOutDate,
    guests,
    specialRequests,
  } = input;

  if (!isNonEmptyString(guestName)) {
    errors.push(errorFor("guestName", "Guest name is required"));
  }

  if (!isNonEmptyString(email) || !emailPattern.test(email)) {
    errors.push(errorFor("email", "Valid email address is required"));
  }

  if (phone != null && !isNonEmptyString(phone)) {
    errors.push(errorFor("phone", "Phone must be a non-empty string if provided"));
  }

  if (!isValidIsoDate(checkInDate)) {
    errors.push(errorFor("checkInDate", "Check-in date must be a valid ISO-8601 date (YYYY-MM-DD)"));
  }

  if (!isValidIsoDate(checkOutDate)) {
    errors.push(errorFor("checkOutDate", "Check-out date must be a valid ISO-8601 date (YYYY-MM-DD)"));
  }

  if (isValidIsoDate(checkInDate) && isValidIsoDate(checkOutDate)) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      errors.push(errorFor("checkOutDate", "Check-out date must be after check-in date"));
    }
  }

  if (!Number.isInteger(guests) || guests < 1) {
    errors.push(errorFor("guests", "Guests must be a positive integer"));
  }

  if (specialRequests != null && typeof specialRequests !== "string") {
    errors.push(errorFor("specialRequests", "Special requests must be a string if provided"));
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      guestName: guestName.trim(),
      email: email.trim(),
      phone: typeof phone === "string" ? phone.trim() : undefined,
      checkInDate,
      checkOutDate,
      guests,
      specialRequests:
        typeof specialRequests === "string" && specialRequests.trim().length > 0
          ? specialRequests.trim()
          : undefined,
    },
  };
}

// ---------------------------------------------------------------------------
// Gallery API

export interface GalleryFetchRequest {
  category?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
  includeFeatured?: boolean;
}

export interface NormalizedGalleryFetchRequest {
  category?: string;
  tags?: string[];
  limit: number;
  offset: number;
  includeFeatured: boolean;
}

export interface GalleryImage {
  id: string;
  url: string;
  altText: string;
  categories: string[];
  tags: string[];
  isFeatured: boolean;
  uploadedAt: string;
}

export interface GalleryFetchResponseSuccess {
  success: true;
  total: number;
  images: GalleryImage[];
  nextOffset?: number;
}

export interface GalleryFetchResponseError {
  success: false;
  errors: ValidationError[];
}

export type GalleryFetchResponse = GalleryFetchResponseSuccess | GalleryFetchResponseError;

export function validateGalleryFetchRequest(input: unknown): ValidationResult<NormalizedGalleryFetchRequest> {
  if (!isRecord(input)) {
    return failure("root", "Expected an object payload");
  }

  const errors: ValidationError[] = [];

  const category = normalizeOptionalString(input.category);
  const includeFeatured = normalizeOptionalBoolean(input.includeFeatured);
  const limit = normalizeOptionalNumber(input.limit);
  const offset = normalizeOptionalNumber(input.offset);
  const tags = normalizeOptionalStringArray(input.tags);
  const hasIncludeFeatured = Object.prototype.hasOwnProperty.call(input, "includeFeatured");
  const hasLimit = Object.prototype.hasOwnProperty.call(input, "limit");
  const hasOffset = Object.prototype.hasOwnProperty.call(input, "offset");
  const hasTags = Object.prototype.hasOwnProperty.call(input, "tags");

  if (input.category != null && category == null) {
    errors.push(errorFor("category", "Category must be a non-empty string if provided"));
  }

  if (hasTags && tags == null) {
    errors.push(errorFor("tags", "Tags must be an array of strings if provided"));
  }

  if (hasIncludeFeatured && includeFeatured == null) {
    errors.push(errorFor("includeFeatured", "includeFeatured must be a boolean or boolean-like string"));
  }

  if (hasLimit) {
    if (limit == null) {
      errors.push(errorFor("limit", "Limit must be a number or numeric string"));
    } else if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      errors.push(errorFor("limit", "Limit must be an integer between 1 and 100"));
    }
  }

  if (hasOffset) {
    if (offset == null) {
      errors.push(errorFor("offset", "Offset must be a number or numeric string"));
    } else if (!Number.isInteger(offset) || offset < 0) {
      errors.push(errorFor("offset", "Offset must be a non-negative integer"));
    }
  }

  if (tags != null && tags.length === 0) {
    errors.push(errorFor("tags", "Tags cannot be an empty array"));
  }

  if (tags != null && tags.some((tag) => tag.length === 0)) {
    errors.push(errorFor("tags", "Tags cannot contain empty strings"));
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      category: category ?? undefined,
      includeFeatured: includeFeatured ?? false,
      limit: limit ?? 24,
      offset: offset ?? 0,
      tags: tags ?? undefined,
    },
  };
}

// ---------------------------------------------------------------------------
// Shared helpers

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !isoDatePattern.test(value)) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeOptionalBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }

  return undefined;
}

function normalizeOptionalNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function normalizeOptionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized: string[] = [];

  for (const item of value) {
    if (typeof item !== "string") {
      return undefined;
    }

    normalized.push(item.trim());
  }

  return normalized;
}

function errorFor(field: string, message: string): ValidationError {
  return { field, message };
}

function failure(field: string, message: string): ValidationResult<never> {
  return { success: false, errors: [errorFor(field, message)] };
}

