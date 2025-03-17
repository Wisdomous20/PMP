import cron from 'node-cron';
import deleteArchive from './fetchDeleteArchive';

cron.schedule('0 0 * * *', async () => {
    try {
        await deleteArchive();
    } catch (error) {
        console.error('Error deleting archive:', error);
    }
});