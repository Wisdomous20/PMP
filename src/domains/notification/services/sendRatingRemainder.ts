import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { sendServiceRequestRatingReminderEmail } from './sendServiceRequestRatingReminderEmail';

const prisma = new PrismaClient();

cron.schedule('0 16 * * *', async () => {
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setUTCDate(fiveDaysAgo.getUTCDate() - 5);

  const requests = await prisma.serviceRequest.findMany({
    where: {
      status: {
        some: {
          status: 'completed',
          timestamp: { lte: fiveDaysAgo }
        }
      },
      ServiceRequestRating: null,
    },
    include: {
      user: true,
      status: { orderBy: { timestamp: 'desc' }, take: 1 },
    },
  });

  for (const req of requests) {
    const { user, status } = req;
    const latestStatus = status[0];
    try {
      await sendServiceRequestRatingReminderEmail({
        to: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        concern: req.concern,
        details: req.details,
        requestId: req.id,
        note: latestStatus.note || undefined,
      });
    } catch (err) {
      console.error(`Failed to send reminder for ${req.id}:`, err);
    }
  }

  await prisma.$disconnect();
});