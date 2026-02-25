export async function httpPost<TResponse>(
  url: string,
  body: unknown
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMessage = "Error de red";

    try {
      const error = await response.json();
      errorMessage = error?.message ?? errorMessage;
    } catch {
      // fallback si no es JSON
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<TResponse>;
}