import emailjs from '@emailjs/browser';

// Initialize EmailJS with your Public Key
// Get these from: https://dashboard.emailjs.com
export const initEmailJS = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error('VITE_EMAILJS_PUBLIC_KEY is not set');
  }
  emailjs.init({ publicKey });
};

// Configuration constants
export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  loginTemplateId: import.meta.env.VITE_EMAILJS_LOGIN_TEMPLATE_ID,
};
