import type { UserProfile } from './types/User'

const STORAGE_KEY = 'keenkeyin_user'

export function saveUser(user: UserProfile): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getStoredUser(): UserProfile | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  return JSON.parse(raw) as UserProfile
}

export function clearUser(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function normalizeUser(user: UserProfile): UserProfile {
  return {
    ...user,
    date_of_birth: new Date(user.date_of_birth).toISOString(),
  }
}
