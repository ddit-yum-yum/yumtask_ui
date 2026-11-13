export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json'},
    ...init,
  })
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
    return res.json() as Promise<T>
}