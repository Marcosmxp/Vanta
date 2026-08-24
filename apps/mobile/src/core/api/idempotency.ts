import { randomUUID } from 'expo-crypto';

export function createIdempotencyKey(scope: string): string {
  const normalizedScope = scope.trim().replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  return `${normalizedScope || 'command'}-${randomUUID()}`;
}
