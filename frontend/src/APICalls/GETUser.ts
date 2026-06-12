import type { UserProfile } from '../types/User'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export interface GetUserResponse {
  user?: UserProfile
  error?: string
}

export async function GETUser(userId: string): Promise<Response> {
  return fetch(`${API_BASE}/users/${userId}`)
}
