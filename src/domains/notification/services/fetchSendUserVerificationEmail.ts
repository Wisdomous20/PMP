export async function fetchSendUserVerificationEmail(
  to: string,
  userName: string,
  userId: string,
  verificationToken: string,
  color?: string
): Promise<void> {
  const response = await fetch(
    `/api/verify/send-email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        to,
        userName,
        userId,
        verificationToken,
        color 
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error ${response.status}: ${errorData.error}`);
  }
}