const API_BASE = import.meta.env.VITE_API_URL ?? ''

export interface UpdateUserRequest {
  first_name: string
  last_name: string
  email: string
  date_of_birth: string
  active: boolean
}

export async function PUTUser(
  userId: string,
  profile: UpdateUserRequest,
): Promise<Response> {
  return fetch(`${API_BASE}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  })
}
