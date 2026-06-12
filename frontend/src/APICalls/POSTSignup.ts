const API_BASE = import.meta.env.VITE_API_URL ?? '';

export interface SignupRequest {
  email: string;
  password: string;
}

export async function POSTSignup(email: string, password: string): Promise<Response> {
  const body: SignupRequest = { email, password };

  return fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}
