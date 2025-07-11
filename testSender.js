import { sendEmail } from './emailSender.js';
import 'dotenv/config';

async function main() {
  const emailOptions = {
    to: 'connectwithdivyansharma@gmail.com',
    subject: 'Test Email from Playwright',
    body: 'This is a test email sent automatically using Playwright.',
  };

  await sendEmail(emailOptions);
}

main(); 