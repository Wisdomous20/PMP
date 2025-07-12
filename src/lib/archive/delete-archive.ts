"use server";

import client from "@/lib/database/client";

export async function deleteArchive() {
  try {
    const currentDate = new Date();

    // Delete service requests where:
    // - The status is "archived"
    // - The deleteAt date is in the past (less than or equal to the current date)
    const result = await client.serviceRequest.deleteMany({
      where: {
        status: {
          some: {
            status: "archived", // Ensure the status is "archived"
          },
        },
        deleteAt: {
          lte: currentDate, // Ensure the deleteAt date is in the past
        },
      },
    });

    return result;
  } catch (error) {
    console.error("Error deleting old archives:", error);
    throw new Error("Failed to delete old archives");
  }
}