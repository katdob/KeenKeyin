const API_BASE = import.meta.env.VITE_API_URL ?? '';

export interface LogInRequest {
  username: string;
  password: string;
}

export async function POSTLogIn(username: string, password: string): Promise<Response> {
  const body: LogInRequest = { username, password };

  return fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}
