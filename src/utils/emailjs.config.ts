import emailjs from '@emailjs/browser';

// Initialize EmailJS with your Public Key
// Get these from: https://dashboard.emailjs.com
export const initEmailJS = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error('VITE_EMAILJS_PUBLIC_KEY environment variable is not set');
  }
  emailjs.init({ publicKey });
};

const getRequiredEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`${key} environment variable is not set`);
  }
  return value;
};

// Configuration constants — all values must be provided via environment variables
export const EMAILJS_CONFIG = {
  serviceId: getRequiredEnv('VITE_EMAILJS_SERVICE_ID'),
  loginTemplateId: getRequiredEnv('VITE_EMAILJS_LOGIN_TEMPLATE_ID'),
};
