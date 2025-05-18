export async function fetchVerificationToken(userId: string): Promise<string> {
  const response = await fetch(
    `/api/verify/generate-token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error ${response.status}: ${errorData.error}`);
  }

  const data = await response.json();
  return data.token;
}
