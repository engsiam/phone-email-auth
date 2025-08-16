export function sendSms(phone: string, message: string) {
  console.log(`successfully sent sms to: ${phone}`);
  console.log(`[SMS BODY]: ${message}`);
}

export function sendEmail(email: string, body: string) {
  console.log(`successfully sent email to: ${email}`);
  console.log(`[EMAIL BODY]: ${body}`);
}
