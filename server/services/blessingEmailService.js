import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { Blessing } from '../models/blessing.model.js';

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const scheduleBlessingsEmail = () => {
//run the cron job every month on the 1st at 9:00 AM
    cron.schedule('0 9 1-7 * 0', async () => {
        try {
            console.log('מריץ תהליך שבועי של שליחת ברכות לרב...');

//define the date one month ago
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//find all blessings created just in the last month
            const newBlessings = await Blessing.find({
                createdAt: { $gte: oneMonthAgo }
            }).sort({ createdAt: -1 });

            if (newBlessings.length === 0) {
                console.log('אין ברכות חדשות שנוספו החודש. המייל לא יישלח.');
                return;
            }

            let emailContent = 'שלום כבוד הרב,\n\nלהלן שמות המתפללים לבקשת ברכה באתר בית הכנסת:\n\n';
            
            newBlessings.forEach((b, index) => {
                emailContent += `${index + 1}. שם: ${b.name}, בן/בת אמא: ${b.motherName} | סוג ברכה: ${b.blessingType}\n`;
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.RABBI_EMAIL,
                subject: 'רשימת הברכות לתפילה - בית כנסת',
                text: emailContent
            });

            console.log('המייל נשלח בהצלחה לרב!');
//keep only the latest 30 blessings in the database
            const allBlessings = await Blessing.find({}).sort({ createdAt: -1 });

            if (allBlessings.length > 30) {
                const blessingsToDelete = allBlessings.slice(30);
                const idsToDelete = blessingsToDelete.map(b => b._id);

                await Blessing.deleteMany({ _id: { $in: idsToDelete } });
                console.log(`המסד נוקה. נמחקו ${idsToDelete.length} ברכות ישנות.`);
            }

        } catch (error) {
            console.error('שגיאה בתהליך השליחה והניקוי האוטומטי:', error);
        }
    });
};
