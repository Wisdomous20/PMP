import cron from "node-cron";

cron.schedule("* * * * *", async () => {
  try {
    const res = await fetch(`/api/cleanup`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[cron] cleanup failed:`, err);
    } else {
      const json = await res.json();
      console.log(`[cron] cleanup succeeded:`, json);
    }
  } catch (e) {
    console.error("[cron] request error:", e);
  }
});
