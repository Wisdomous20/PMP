import { User } from "@prisma/client";

export default async function fetchGetAllUsers(): Promise<User[] | null> {
    const endpoint = "/api/user";
  
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.error}`);
      }
  
      const data = await response.json();
      return data as User[];
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      return null;
    }
  }
  